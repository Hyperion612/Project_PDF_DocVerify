import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzePDF, type PDFAnalysisResult } from '../utils/pdfAnalyzer';
import { analyzeImage, type ImageAnalysisResult } from '../utils/imageAnalyzer';
import { analyzeWithAI, performELA, analyzeHistogram, type AIAnalysisResult } from '../utils/aiAnalyzer';
import { performLSBAnalysis, type LSBAnalysisResult } from '../utils/lsbAnalyzer';
import { analyzeText, type TextAnalysisResult } from '../utils/textAnalyzer';
import { generateHeatmap, type HeatmapResult } from '../utils/heatmapGenerator';
import { exportToJSON, exportToPDF, type AnalysisReport } from '../utils/reportExporter';
import { computeFileHash, computeMD5, formatFileSize, detectFileType, saveAnalysisRecord } from '../utils/fileUtils';

type AnalysisState = 'idle' | 'analyzing' | 'complete' | 'error';

interface FullResult {
  type: 'pdf' | 'image';
  fileName: string;
  fileSize: number;
  fileHash: string;
  md5Hash: string;
  pdfResult?: PDFAnalysisResult;
  imageResult?: ImageAnalysisResult;
  aiResult?: AIAnalysisResult;
  elaResult?: {
    meanError: number;
    maxError: number;
    suspiciousRegions: number;
    isEdited: boolean;
  };
  histogramResult?: {
    isManipulated: boolean;
    anomalies: number;
    description: string;
  };
  lsbResult?: LSBAnalysisResult;
  heatmapResult?: HeatmapResult;
  textAnalysis?: TextAnalysisResult;
}

export default function UploadPage() {
  const [state, setState] = useState<AnalysisState>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<FullResult | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisTime, setAnalysisTime] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setResult(null);
    setState('analyzing');
    setProgress(0);
    setAiProgress(0);
    setCurrentStep('Инициализация...');
    
    // Создаём превью для изображений
    if (file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
    
    const startTime = Date.now();

    try {
      const fileType = detectFileType(file);
      if (fileType === 'unknown') {
        setError('Неподдерживаемый формат файла. Поддерживаются PDF, PNG, JPG, JPEG.');
        setState('error');
        return;
      }

      // Вычисление хеша
      setCurrentStep('Вычисление хешей файла (SHA-256, MD5)...');
      setProgress(10);
      const hash = await computeFileHash(file);
      const md5 = await computeMD5(file);
      setProgress(20);

      let fullResult: FullResult = {
        type: fileType,
        fileName: file.name,
        fileSize: file.size,
        fileHash: hash,
        md5Hash: md5,
      };

      if (fileType === 'pdf') {
        // Анализ PDF
        setCurrentStep('Анализ структуры PDF...');
        setProgress(40);
        const pdfResult = await analyzePDF(file);
        setProgress(70);
        fullResult.pdfResult = pdfResult;

        // Анализ текста на AI-генерацию
        if (pdfResult.rawText && pdfResult.rawText.length > 50) {
          setCurrentStep('Анализ текста на признаки AI-генерации...');
          setProgress(85);
          const textAnalysis = analyzeText(pdfResult.rawText);
          setProgress(90);
          fullResult.textAnalysis = textAnalysis;
          
          // Обновляем уровень риска если текст AI
          if (textAnalysis.verdict === 'ai' && textAnalysis.confidence > 70) {
            pdfResult.riskLevel = 'high';
            pdfResult.confidence = Math.min(pdfResult.confidence, 30);
          }
        }

        saveAnalysisRecord({
          id: hash.substring(0, 16),
          fileName: file.name,
          fileType: 'pdf',
          fileSize: file.size,
          timestamp: Date.now(),
          riskLevel: pdfResult.riskLevel,
          confidence: pdfResult.confidence,
          summary: pdfResult.riskLevel === 'low' 
            ? 'Документ прошёл проверку' 
            : `Обнаружены аномалии: ${pdfResult.anomalies.length + pdfResult.warnings.length}`,
        });
      } else {
        // Анализ изображения
        setCurrentStep('Анализ метаданных изображения...');
        setProgress(30);
        const imageResult = await analyzeImage(file);
        setProgress(50);
        fullResult.imageResult = imageResult;

        // ELA анализ
        setCurrentStep('Выполнение Error Level Analysis...');
        setProgress(55);
        const elaResult = await performELA(file);
        setProgress(60);
        fullResult.elaResult = elaResult;

        // LSB анализ
        setCurrentStep('LSB анализ (детекция стеганографии)...');
        setProgress(65);
        const lsbResult = await performLSBAnalysis(file);
        setProgress(70);
        fullResult.lsbResult = lsbResult;

        // Анализ гистограммы
        setCurrentStep('Анализ гистограммы...');
        setProgress(75);
        const histogramResult = await analyzeHistogram(file);
        setProgress(78);
        fullResult.histogramResult = histogramResult;

        // Генерация heatmap
        setCurrentStep('Генерация heatmap подозрительных областей...');
        setProgress(80);
        const heatmapResult = await generateHeatmap(file);
        setProgress(83);
        fullResult.heatmapResult = heatmapResult;

        // AI анализ (опционально)
        setCurrentStep('Загрузка AI модели...');
        setProgress(85);
        const aiResult = await analyzeWithAI(file, (p) => {
          setAiProgress(p);
          setCurrentStep(`Загрузка AI модели... ${p}%`);
        });
        setProgress(90);
        fullResult.aiResult = aiResult;

        // Обновляем уровень риска на основе всех анализов
        let riskLevel = imageResult.riskLevel;
        let confidence = imageResult.confidence;

        if (elaResult.isEdited) {
          riskLevel = 'high';
          confidence = Math.min(confidence, 30);
        } else if (histogramResult.isManipulated) {
          if (riskLevel === 'low') {
            riskLevel = 'medium';
            confidence = Math.min(confidence, 60);
          }
        }

        if (aiResult.isAIGenerated) {
          riskLevel = 'high';
          confidence = Math.min(confidence, 25);
        }

        fullResult.imageResult = { ...imageResult, riskLevel, confidence };

        saveAnalysisRecord({
          id: hash.substring(0, 16),
          fileName: file.name,
          fileType: 'image',
          fileSize: file.size,
          timestamp: Date.now(),
          riskLevel,
          confidence,
          summary: riskLevel === 'low'
            ? 'Изображение прошло проверку'
            : `Обнаружены аномалии: ${imageResult.anomalies.length + imageResult.warnings.length}`,
        });
      }

      setProgress(100);
      setCurrentStep('Анализ завершён');
      setAnalysisTime(Date.now() - startTime);
      setResult(fullResult);
      setState('complete');
    } catch (err: any) {
      setError(`Ошибка анализа: ${err.message}`);
      setState('error');
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const reset = () => {
    setState('idle');
    setResult(null);
    setError('');
    setProgress(0);
    setAiProgress(0);
    setCurrentStep('');
    setAnalysisTime(0);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Проверка документа
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Загрузите PDF или изображение для комплексного анализа подлинности
          </p>
        </div>

        {/* Upload Area */}
        {state === 'idle' && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
            <div
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive 
                  ? 'border-emerald-400 bg-emerald-400/5 scale-[1.02]' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-300 text-lg mb-2">Перетащите файл сюда</p>
              <p className="text-gray-500 text-sm mb-6">Поддерживаются PDF, PNG, JPG, JPEG (до 25 МБ)</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
              >
                Выбрать файл
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
              {['Метаданные', 'ELA анализ', 'Гистограмма', 'AI детекция', 'Структура'].map((item) => (
                <div key={item} className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyzing */}
        {state === 'analyzing' && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Анализ документа</h3>
              <p className="text-gray-400">{currentStep}</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Общий прогресс</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {aiProgress > 0 && aiProgress < 100 && (
                <>
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                    <span>Загрузка AI модели</span>
                    <span>{aiProgress}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${aiProgress}%` }}
                    ></div>
                  </div>
                </>
              )}

              <div className="mt-6 space-y-2 font-mono text-xs text-gray-500">
                {progress >= 10 && <p className="text-emerald-400">✓ Вычисление хешей (SHA-256, MD5)</p>}
                {progress >= 20 && <p className="text-emerald-400">✓ Определение типа документа</p>}
                {progress >= 40 && <p className="text-emerald-400">✓ Извлечение метаданных</p>}
                {progress >= 60 && <p className="text-emerald-400">✓ Error Level Analysis</p>}
                {progress >= 65 && <p className="text-emerald-400">✓ LSB анализ (стеганография)</p>}
                {progress >= 75 && <p className="text-emerald-400">✓ Анализ гистограммы</p>}
                {progress >= 80 && <p className="text-emerald-400">✓ Генерация heatmap</p>}
                {progress >= 85 && <p className="text-emerald-400">✓ AI классификация</p>}
                {progress >= 90 && <p className="text-emerald-400">✓ Анализ текста на AI</p>}
                {progress >= 95 && <p className="text-emerald-400">✓ Формирование отчёта</p>}
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {state === 'error' && (
          <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-8 text-center">
            <svg className="w-16 h-16 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">Ошибка анализа</h3>
            <p className="text-red-400 mb-6">{error}</p>
            <button
              onClick={reset}
              className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white hover:bg-gray-700 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        )}

        {/* Results */}
        {state === 'complete' && result && (
          <ResultsView result={result} onReset={reset} previewUrl={previewUrl} analysisTime={analysisTime} />
        )}
      </div>
    </div>
  );
}

function ResultsView({ result, onReset, previewUrl, analysisTime }: { result: FullResult; onReset: () => void; previewUrl?: string | null; analysisTime?: number }) {
  const navigate = useNavigate();
  
  const riskColor = {
    low: 'text-emerald-400',
    medium: 'text-yellow-400',
    high: 'text-red-400',
  };
  const riskBg = {
    low: 'from-emerald-500/20 to-emerald-500/5',
    medium: 'from-yellow-500/20 to-yellow-500/5',
    high: 'from-red-500/20 to-red-500/5',
  };
  const riskBorder = {
    low: 'border-emerald-500/30',
    medium: 'border-yellow-500/30',
    high: 'border-red-500/30',
  };
  const riskLabel = {
    low: 'ДОКУМЕНТ ПОДЛИННЫЙ',
    medium: 'СРЕДНИЙ РИСК',
    high: 'ВЫСОКИЙ РИСК — ВОЗМОЖНА ПОДДЕЛКА',
  };

  const risk = result.type === 'pdf' 
    ? result.pdfResult!.riskLevel 
    : result.imageResult!.riskLevel;
  const confidence = result.type === 'pdf'
    ? result.pdfResult!.confidence
    : result.imageResult!.confidence;
  const checks = result.type === 'pdf'
    ? result.pdfResult!.checks
    : result.imageResult!.checks;
  const warnings = result.type === 'pdf'
    ? result.pdfResult!.warnings
    : result.imageResult!.warnings;
  const anomalies = result.type === 'pdf'
    ? result.pdfResult!.anomalies
    : result.imageResult!.anomalies;

  return (
    <div className="space-y-6">
      {/* Превью файла */}
      {previewUrl && result.type === 'image' && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">🖼️ Превью изображения</h3>
          <div className="flex justify-center">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full h-auto rounded-lg max-h-96 object-contain"
            />
          </div>
        </div>
      )}

      {/* Main Result Card */}
      <div className={`bg-gradient-to-br ${riskBg[risk]} border ${riskBorder[risk]} rounded-2xl p-8`}>
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-4 h-4 rounded-full ${
                risk === 'low' ? 'bg-emerald-400' : risk === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
              } animate-pulse`}></div>
              <span className={`font-mono text-sm font-bold ${riskColor[risk]}`}>
                {riskLabel[risk]}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{result.fileName}</h2>
            <p className="text-gray-400 text-sm">
              {result.type === 'pdf' ? 'PDF документ' : 'Изображение'} • {formatFileSize(result.fileSize)}
              {analysisTime && analysisTime > 0 && (
                <span className="ml-2">• Анализ: {(analysisTime / 1000).toFixed(1)}с</span>
              )}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-white">{confidence}%</div>
            <p className="text-gray-400 text-sm">уверенность</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>Уровень доверия</span>
            <span>{confidence}%</span>
          </div>
          <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ${
                risk === 'low' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                risk === 'medium' ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                'bg-gradient-to-r from-red-500 to-red-400'
              }`}
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Сводка анализа */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📊 Сводка анализа</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-emerald-400">{checks.filter(c => c.status === 'pass').length}</p>
            <p className="text-xs text-gray-400 mt-1">Пройдено</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-yellow-400">{checks.filter(c => c.status === 'warning').length}</p>
            <p className="text-xs text-gray-400 mt-1">Предупреждений</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-red-400">{checks.filter(c => c.status === 'fail').length}</p>
            <p className="text-xs text-gray-400 mt-1">Ошибок</p>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-400">{checks.length}</p>
            <p className="text-xs text-gray-400 mt-1">Всего проверок</p>
          </div>
        </div>
      </div>

      {/* File Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">📄 Информация о файле</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Имя файла" value={result.fileName} />
          <InfoRow label="Тип" value={result.type === 'pdf' ? 'PDF документ' : 'Изображение'} />
          <InfoRow label="Размер" value={formatFileSize(result.fileSize)} />
          <InfoRow label="SHA-256" value={result.fileHash} mono />
          <InfoRow label="MD5" value={result.md5Hash} mono />
        </div>
      </div>

      {/* PDF Metadata */}
      {result.type === 'pdf' && result.pdfResult && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📋 Метаданные PDF</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Заголовок" value={result.pdfResult.metadata.title || '—'} />
            <InfoRow label="Автор" value={result.pdfResult.metadata.author || '—'} />
            <InfoRow label="Создатель (ПО)" value={result.pdfResult.metadata.creator || '—'} />
            <InfoRow label="Производитель" value={result.pdfResult.metadata.producer || '—'} />
            <InfoRow label="Дата создания" value={result.pdfResult.metadata.creationDate || '—'} />
            <InfoRow label="Дата изменения" value={result.pdfResult.metadata.modificationDate || '—'} />
            <InfoRow label="Страниц" value={String(result.pdfResult.structure.numPages)} />
            <InfoRow label="Зашифрован" value={result.pdfResult.structure.isEncrypted ? 'Да' : 'Нет'} />
            <InfoRow label="JavaScript" value={result.pdfResult.structure.hasJavaScript ? '⚠ Обнаружен' : 'Нет'} />
            <InfoRow label="Цифровые подписи" value={result.pdfResult.structure.hasSignatures ? '✓ Есть' : 'Нет'} />
            <InfoRow label="Аннотации" value={result.pdfResult.structure.hasAnnotations ? 'Есть' : 'Нет'} />
            <InfoRow label="Ссылки" value={String(result.pdfResult.structure.linksCount)} />
            <InfoRow label="Формы" value={String(result.pdfResult.structure.formsCount)} />
            <InfoRow label="Встроенные изображения" value={String(result.pdfResult.structure.embeddedImagesCount)} />
            <InfoRow label="Скрытые слои (OCG)" value={result.pdfResult.structure.hasLayers ? '⚠ Обнаружены' : 'Нет'} />
            <InfoRow label="Линеаризован" value={result.pdfResult.structure.isLinearized ? 'Да' : 'Нет'} />
            <InfoRow label="Инкрементальные правки" value={String(result.pdfResult.structure.incrementalUpdates)} />
            <InfoRow label="Xref таблиц" value={String(result.pdfResult.structure.xrefCount)} />
          </div>
        </div>
      )}

      {/* Image Metadata */}
      {result.type === 'image' && result.imageResult && (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Метаданные изображения</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoRow label="Разрешение" value={`${result.imageResult.metadata.width}×${result.imageResult.metadata.height}`} />
              <InfoRow label="Формат" value={result.imageResult.metadata.format} />
              <InfoRow label="Камера" value={result.imageResult.exif.camera || '—'} />
              <InfoRow label="ПО" value={result.imageResult.exif.software || '—'} />
              <InfoRow label="Дата съёмки" value={result.imageResult.exif.dateTaken || '—'} />
              <InfoRow label="ISO" value={result.imageResult.exif.iso ? String(result.imageResult.exif.iso) : '—'} />
              <InfoRow label="Диафрагма" value={result.imageResult.exif.aperture ? `f/${result.imageResult.exif.aperture}` : '—'} />
              <InfoRow label="Выдержка" value={result.imageResult.exif.exposureTime || '—'} />
              <InfoRow label="GPS" value={result.imageResult.exif.hasGPS ? `${result.imageResult.exif.gps?.lat.toFixed(4)}, ${result.imageResult.exif.gps?.lon.toFixed(4)}` : '—'} />
            </div>
          </div>

          {/* ELA Analysis */}
          {result.elaResult && (
            <div className={`border rounded-2xl p-6 ${
              result.elaResult.isEdited 
                ? 'bg-red-500/5 border-red-500/30' 
                : 'bg-gray-900 border-gray-800'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-4">
                🔍 Error Level Analysis (ELA)
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                ELA выявляет области с разным уровнем сжатия, что указывает на возможное редактирование
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoRow label="Средняя ошибка" value={result.elaResult.meanError.toFixed(2)} />
                <InfoRow label="Максимальная ошибка" value={result.elaResult.maxError.toFixed(2)} />
                <InfoRow 
                  label="Подозрительные области" 
                  value={`${result.elaResult.suspiciousRegions}%`}
                />
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                  result.elaResult.isEdited 
                    ? 'bg-red-500/20 text-red-400' 
                    : 'bg-emerald-500/20 text-emerald-400'
                }`}>
                  {result.elaResult.isEdited ? '⚠ Обнаружены признаки редактирования' : '✓ Следы редактирования не обнаружены'}
                </span>
              </div>
            </div>
          )}

          {/* LSB Analysis */}
          {result.lsbResult && (
            <div className={`border rounded-2xl p-6 ${
              result.lsbResult.isSteganography 
                ? 'bg-red-500/5 border-red-500/30' 
                : result.lsbResult.pattern === 'suspicious'
                ? 'bg-yellow-500/5 border-yellow-500/30'
                : 'bg-gray-900 border-gray-800'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-4">
                🔐 LSB Анализ (Least Significant Bit)
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {result.lsbResult.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Паттерн" value={
                  result.lsbResult.pattern === 'natural' ? 'Естественный' :
                  result.lsbResult.pattern === 'suspicious' ? 'Подозрительный' :
                  'Высокоподозрительный'
                } />
                <InfoRow label="Подозрительные пиксели" value={`${result.lsbResult.suspiciousPercentage}%`} />
                <InfoRow label="Стеганография" value={result.lsbResult.isSteganography ? '⚠ Обнаружена' : 'Не обнаружена'} />
                <InfoRow label="Среднее отклонение" value={result.lsbResult.meanDeviation.toFixed(3)} />
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="bg-red-500/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">Красный канал</p>
                  <p className="text-sm text-red-400 font-mono">{result.lsbResult.channelAnalysis.red.toFixed(3)}</p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">Зелёный канал</p>
                  <p className="text-sm text-green-400 font-mono">{result.lsbResult.channelAnalysis.green.toFixed(3)}</p>
                </div>
                <div className="bg-blue-500/10 rounded-lg p-2 text-center">
                  <p className="text-xs text-gray-400">Синий канал</p>
                  <p className="text-sm text-blue-400 font-mono">{result.lsbResult.channelAnalysis.blue.toFixed(3)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Heatmap */}
          {result.heatmapResult && result.heatmapResult.dataUrl && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                🗺️ Heatmap подозрительных областей
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Визуализация областей с аномальной текстурой и вариацией
              </p>
              <div className="bg-gray-800 rounded-xl p-4 flex justify-center">
                <img 
                  src={result.heatmapResult.dataUrl} 
                  alt="Heatmap" 
                  className="max-w-full h-auto rounded-lg"
                  style={{ maxHeight: '400px' }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <InfoRow label="Подозрительных блоков" value={String(result.heatmapResult.suspiciousRegions)} />
                <InfoRow label="Максимальная интенсивность" value={result.heatmapResult.maxIntensity.toFixed(2)} />
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-green-500 rounded"></span> Низкая
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-yellow-500 rounded"></span> Средняя
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 bg-red-500 rounded"></span> Высокая
                </span>
              </div>
            </div>
          )}

          {/* Histogram Analysis */}
          {result.histogramResult && (
            <div className={`border rounded-2xl p-6 ${
              result.histogramResult.isManipulated 
                ? 'bg-yellow-500/5 border-yellow-500/30' 
                : 'bg-gray-900 border-gray-800'
            }`}>
              <h3 className="text-lg font-semibold text-white mb-4">
                Анализ гистограммы
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {result.histogramResult.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Аномалий обнаружено" value={String(result.histogramResult.anomalies)} />
                <InfoRow 
                  label="Статус" 
                  value={result.histogramResult.isManipulated ? 'Подозрительно' : 'Нормально'}
                />
              </div>
            </div>
          )}

          {/* AI Analysis */}
          {result.aiResult && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                AI Детекция
                {result.aiResult.modelLoaded && (
                  <span className="ml-2 text-xs text-emerald-400">✓ Модель загружена</span>
                )}
              </h3>
              {result.aiResult.error ? (
                <p className="text-yellow-400 text-sm">{result.aiResult.error}</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <InfoRow 
                      label="AI-сгенерировано" 
                      value={result.aiResult.isAIGenerated ? 'Да' : 'Нет'}
                    />
                    <InfoRow 
                      label="Уверенность AI" 
                      value={`${result.aiResult.confidence}%`}
                    />
                  </div>
                  {result.aiResult.labels.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Классификация изображения:</p>
                      <div className="space-y-2">
                        {result.aiResult.labels.slice(0, 5).map((label, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-gray-300 text-sm">{label.label}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                  style={{ width: `${label.score * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-400 text-xs w-12 text-right">
                                {(label.score * 100).toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Checks */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Результаты проверок ({checks.length})</h3>
        <div className="space-y-3">
          {checks.map((check, i) => (
            <div key={i} className={`flex items-start justify-between gap-4 p-4 rounded-xl ${
              check.status === 'pass' ? 'bg-emerald-500/5 border border-emerald-500/20' :
              check.status === 'warning' ? 'bg-yellow-500/5 border border-yellow-500/20' :
              'bg-red-500/5 border border-red-500/20'
            }`}>
              <div className="flex items-start gap-3 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                  check.status === 'pass' ? 'bg-emerald-500/20' :
                  check.status === 'warning' ? 'bg-yellow-500/20' :
                  'bg-red-500/20'
                }`}>
                  {check.status === 'pass' ? (
                    <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : check.status === 'warning' ? (
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">{check.name}</p>
                  <p className="text-gray-400 text-xs mt-1">{check.description}</p>
                </div>
              </div>
              <span className={`text-sm font-mono ${
                check.status === 'pass' ? 'text-emerald-400' :
                check.status === 'warning' ? 'text-yellow-400' :
                'text-red-400'
              }`}>{check.score}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies & Warnings */}
      {(anomalies.length > 0 || warnings.length > 0) && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Обнаруженные проблемы</h3>
          {anomalies.length > 0 && (
            <div className="mb-4">
              <h4 className="text-red-400 text-sm font-medium mb-2">⚠ Аномалии ({anomalies.length})</h4>
              <ul className="space-y-2">
                {anomalies.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
                    <span className="text-red-400">•</span> {a}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {warnings.length > 0 && (
            <div>
              <h4 className="text-yellow-400 text-sm font-medium mb-2">Предупреждения ({warnings.length})</h4>
              <ul className="space-y-2">
                {warnings.map((w, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                    <span className="text-yellow-400">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Text Analysis (PDF only) */}
      {result.type === 'pdf' && result.textAnalysis && (
        <div className={`border rounded-2xl p-6 ${
          result.textAnalysis.verdict === 'ai' 
            ? 'bg-red-500/5 border-red-500/30' 
            : result.textAnalysis.verdict === 'uncertain'
            ? 'bg-yellow-500/5 border-yellow-500/30'
            : 'bg-gray-900 border-gray-800'
        }`}>
          <h3 className="text-lg font-semibold text-white mb-4">
            🤖 AI Детекция текста
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InfoRow 
              label="Вердикт" 
              value={
                result.textAnalysis.verdict === 'ai' ? '⚠ Вероятно AI' :
                result.textAnalysis.verdict === 'human' ? '✓ Вероятно человек' :
                '? Неопределённо'
              }
            />
            <InfoRow label="AI вероятность" value={`${(result.textAnalysis.aiProbability * 100).toFixed(1)}%`} />
            <InfoRow label="Уверенность" value={`${result.textAnalysis.confidence}%`} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Perplexity</p>
              <p className="text-sm text-white font-mono">{result.textAnalysis.signals.perplexity}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Burstiness</p>
              <p className="text-sm text-white font-mono">{result.textAnalysis.signals.burstiness}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Ср. длина слов</p>
              <p className="text-sm text-white font-mono">{result.textAnalysis.signals.avgWordLength}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Слов</p>
              <p className="text-sm text-white font-mono">{result.textAnalysis.wordCount}</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <p className="text-xs text-gray-400">Предложений</p>
              <p className="text-sm text-white font-mono">{result.textAnalysis.sentenceCount}</p>
            </div>
          </div>
          {result.textAnalysis.topReasons.length > 0 && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Основные признаки:</p>
              <ul className="space-y-1">
                {result.textAnalysis.topReasons.map((reason, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-emerald-400">•</span> {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Extracted Text (PDF only) */}
      {result.type === 'pdf' && result.pdfResult?.rawText && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">📝 Извлечённый текст (превью)</h3>
          <div className="bg-gray-800 rounded-xl p-4 max-h-60 overflow-y-auto">
            <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
              {result.pdfResult.rawText.substring(0, 1000) || 'Текст не извлечён'}
            </pre>
          </div>
        </div>
      )}

      {/* Export Buttons */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">💾 Экспорт отчёта</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              const report: AnalysisReport = {
                fileName: result.fileName,
                fileType: result.type,
                fileSize: result.fileSize,
                fileHash: result.fileHash,
                timestamp: new Date().toISOString(),
                riskLevel: risk,
                confidence,
                checks,
                warnings,
                anomalies,
                metadata: result.type === 'pdf' ? result.pdfResult?.metadata : result.imageResult?.metadata,
                structure: result.type === 'pdf' ? result.pdfResult?.structure : undefined,
                aiResult: result.aiResult,
                elaResult: result.elaResult,
                lsbResult: result.lsbResult,
                histogramResult: result.histogramResult,
                textAnalysis: result.textAnalysis,
              };
              exportToJSON(report);
            }}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-semibold transition-colors"
          >
            📥 Экспорт JSON
          </button>
          <button
            onClick={() => {
              const report: AnalysisReport = {
                fileName: result.fileName,
                fileType: result.type,
                fileSize: result.fileSize,
                fileHash: result.fileHash,
                timestamp: new Date().toISOString(),
                riskLevel: risk,
                confidence,
                checks,
                warnings,
                anomalies,
                metadata: result.type === 'pdf' ? result.pdfResult?.metadata : result.imageResult?.metadata,
                structure: result.type === 'pdf' ? result.pdfResult?.structure : undefined,
                aiResult: result.aiResult,
                elaResult: result.elaResult,
                lsbResult: result.lsbResult,
                histogramResult: result.histogramResult,
                textAnalysis: result.textAnalysis,
              };
              exportToPDF(report);
            }}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-white font-semibold transition-colors"
          >
            📄 Экспорт PDF
          </button>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-yellow-500/5 border border-yellow-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <h4 className="text-yellow-400 font-semibold mb-2">Дисклеймер</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Данный отчёт сгенерирован автоматически на основе алгоритмического анализа и носит <strong>вероятностный характер</strong>. 
              Результаты не являются юридически значимым заключением и не могут использоваться как единственное основание для принятия важных решений. 
              Для критически важных случаев рекомендуется дополнительная экспертиза квалифицированными специалистами.
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button
          onClick={onReset}
          className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Проверить другой файл
        </button>
        <button
          onClick={() => navigate('/pricing')}
          className="px-8 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
        >
          Тарифные планы
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-gray-500 text-xs">{label}</span>
      <span className={`text-gray-200 text-sm ${mono ? 'font-mono break-all' : ''}`}>{value}</span>
    </div>
  );
}
