import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyzePDF, type PDFAnalysisResult } from '../utils/pdfAnalyzer';
import { analyzeImage, type ImageAnalysisResult } from '../utils/imageAnalyzer';
import { computeFileHash, formatFileSize, detectFileType, saveAnalysisRecord } from '../utils/fileUtils';

type AnalysisState = 'idle' | 'uploading' | 'analyzing' | 'complete' | 'error';

interface FullResult {
  type: 'pdf' | 'image';
  fileName: string;
  fileSize: number;
  fileHash: string;
  pdfResult?: PDFAnalysisResult;
  imageResult?: ImageAnalysisResult;
}

export default function UploadPage() {
  const [state, setState] = useState<AnalysisState>('idle');
  const [dragActive, setDragActive] = useState(false);
  const [result, setResult] = useState<FullResult | null>(null);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFile = useCallback(async (file: File) => {
    setError('');
    setResult(null);
    setState('analyzing');
    setProgress(0);

    try {
      const fileType = detectFileType(file);
      if (fileType === 'unknown') {
        setError('Неподдерживаемый формат файла. Поддерживаются PDF, PNG, JPG, JPEG.');
        setState('error');
        return;
      }

      // Вычисление хеша
      setProgress(10);
      const hash = await computeFileHash(file);
      setProgress(20);

      let fullResult: FullResult = {
        type: fileType,
        fileName: file.name,
        fileSize: file.size,
        fileHash: hash,
      };

      if (fileType === 'pdf') {
        setProgress(40);
        const pdfResult = await analyzePDF(file);
        setProgress(90);
        fullResult.pdfResult = pdfResult;

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
        setProgress(40);
        const imageResult = await analyzeImage(file);
        setProgress(90);
        fullResult.imageResult = imageResult;

        saveAnalysisRecord({
          id: hash.substring(0, 16),
          fileName: file.name,
          fileType: 'image',
          fileSize: file.size,
          timestamp: Date.now(),
          riskLevel: imageResult.riskLevel,
          confidence: imageResult.confidence,
          summary: imageResult.riskLevel === 'low'
            ? 'Изображение прошло проверку'
            : `Обнаружены аномалии: ${imageResult.anomalies.length + imageResult.warnings.length}`,
        });
      }

      setProgress(100);
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
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Проверка документа
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Загрузите PDF или изображение для реального анализа подлинности
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

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {['Метаданные', 'Цифровые подписи', 'Следы редактирования', 'Структурный анализ'].map((item) => (
                <div key={item} className="bg-gray-800/50 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analyzing */}
        {(state === 'analyzing') && (
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-400 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Анализ документа</h3>
              <p className="text-gray-400">Выполняется проверка подлинности...</p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                <span>Прогресс</span>
                <span>{progress}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-6 space-y-2 font-mono text-xs text-gray-500">
                {progress >= 10 && <p className="text-emerald-400">✓ Вычисление хеша файла (SHA-256)</p>}
                {progress >= 20 && <p className="text-emerald-400">✓ Определение типа документа</p>}
                {progress >= 40 && <p className="text-emerald-400">✓ Извлечение метаданных</p>}
                {progress >= 60 && <p className="text-emerald-400">✓ Анализ структуры</p>}
                {progress >= 80 && <p className="text-emerald-400">✓ Проверка подписей и шифрования</p>}
                {progress >= 90 && <p className="text-emerald-400">✓ Формирование отчёта</p>}
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
          <ResultsView result={result} onReset={reset} />
        )}
      </div>
    </div>
  );
}

function ResultsView({ result, onReset }: { result: FullResult; onReset: () => void }) {
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

      {/* File Info */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Информация о файле</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow label="Имя файла" value={result.fileName} />
          <InfoRow label="Тип" value={result.type === 'pdf' ? 'PDF документ' : 'Изображение'} />
          <InfoRow label="Размер" value={formatFileSize(result.fileSize)} />
          <InfoRow label="SHA-256 хеш" value={result.fileHash.substring(0, 32) + '...'} mono />
        </div>
      </div>

      {/* Metadata */}
      {result.type === 'pdf' && result.pdfResult && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Метаданные PDF</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InfoRow label="Заголовок" value={result.pdfResult.metadata.title || '—'} />
            <InfoRow label="Автор" value={result.pdfResult.metadata.author || '—'} />
            <InfoRow label="Создатель" value={result.pdfResult.metadata.creator || '—'} />
            <InfoRow label="Производитель" value={result.pdfResult.metadata.producer || '—'} />
            <InfoRow label="Дата создания" value={result.pdfResult.metadata.creationDate || '—'} />
            <InfoRow label="Дата изменения" value={result.pdfResult.metadata.modificationDate || '—'} />
            <InfoRow label="Страниц" value={String(result.pdfResult.structure.numPages)} />
            <InfoRow label="Зашифрован" value={result.pdfResult.structure.isEncrypted ? 'Да' : 'Нет'} />
          </div>
        </div>
      )}

      {result.type === 'image' && result.imageResult && (
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
          </div>
        </div>
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

      {/* Extracted Text (PDF only) */}
      {result.type === 'pdf' && result.pdfResult?.rawText && (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Извлечённый текст (превью)</h3>
          <div className="bg-gray-800 rounded-xl p-4 max-h-60 overflow-y-auto">
            <pre className="text-gray-300 text-xs whitespace-pre-wrap font-mono">
              {result.pdfResult.rawText.substring(0, 1000) || 'Текст не извлечён'}
            </pre>
          </div>
        </div>
      )}

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
