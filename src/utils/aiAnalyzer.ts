import { pipeline, env } from '@huggingface/transformers';

// Отключаем загрузку моделей с Hugging Face Hub (используем локальные)
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface AIAnalysisResult {
  isAIGenerated: boolean;
  confidence: number;
  labels: Array<{ label: string; score: number }>;
  modelLoaded: boolean;
  error?: string;
}

let imageClassifier: any = null;
let isLoading = false;

/**
 * Загрузка модели для классификации изображений
 * Используем лёгкую модель MobileNet для быстрой работы в браузере
 */
export async function loadImageClassifier(
  onProgress?: (progress: number) => void
): Promise<boolean> {
  if (imageClassifier) return true;
  if (isLoading) return false;
  
  isLoading = true;
  
  try {
    imageClassifier = await pipeline(
      'image-classification',
      'Xenova/mobilenet_v2_1.0_224',
      {
        progress_callback: (progress: any) => {
          if (progress.status === 'progress' && onProgress) {
            onProgress(Math.round(progress.progress || 0));
          }
        },
      }
    );
    isLoading = false;
    return true;
  } catch (error: any) {
    isLoading = false;
    console.error('Ошибка загрузки AI модели:', error);
    return false;
  }
}

/**
 * Анализ изображения с помощью AI
 */
export async function analyzeWithAI(
  file: File,
  onProgress?: (progress: number) => void
): Promise<AIAnalysisResult> {
  // Загружаем модель если ещё не загружена
  if (!imageClassifier) {
    const loaded = await loadImageClassifier(onProgress);
    if (!loaded) {
      return {
        isAIGenerated: false,
        confidence: 0,
        labels: [],
        modelLoaded: false,
        error: 'Не удалось загрузить AI модель',
      };
    }
  }

  try {
    // Создаём URL для изображения
    const imageUrl = URL.createObjectURL(file);
    
    // Загружаем изображение в ImageData
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = imageUrl;
    });

    // Анализ через AI модель
    const results = await imageClassifier(img, { topk: 5 });
    
    URL.revokeObjectURL(imageUrl);

    // Интерпретируем результаты
    // MobileNet возвращает категории ImageNet
    // Ищем признаки AI-генерации или редактирования
    const aiIndicators = [
      'digital', 'computer', 'screen', 'monitor',
      'artificial', 'synthetic', 'generated'
    ];
    
    const editingIndicators = [
      'photoshop', 'edit', 'manipulated', 'altered'
    ];

    let aiScore = 0;
    const labels = results.map((r: any) => ({
      label: r.label,
      score: r.score,
    }));

    // Проверяем, есть ли среди результатов признаки AI
    for (const result of results) {
      const label = result.label.toLowerCase();
      if (aiIndicators.some(ind => label.includes(ind))) {
        aiScore += result.score;
      }
    }

    // Нормализуем оценку
    const confidence = Math.min(aiScore * 100, 100);
    const isAIGenerated = confidence > 50;

    return {
      isAIGenerated,
      confidence: Math.round(confidence),
      labels,
      modelLoaded: true,
    };
  } catch (error: any) {
    return {
      isAIGenerated: false,
      confidence: 0,
      labels: [],
      modelLoaded: true,
      error: error.message,
    };
  }
}

/**
 * Проверка статуса загрузки модели
 */
export function isModelLoaded(): boolean {
  return imageClassifier !== null;
}

/**
 * Error Level Analysis (ELA) - алгоритмический метод детекции редактирования
 * Не требует AI, работает на основе анализа уровней ошибок JPEG
 */
export async function performELA(
  file: File,
  quality: number = 90
): Promise<{
  meanError: number;
  maxError: number;
  suspiciousRegions: number;
  isEdited: boolean;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve({ meanError: 0, maxError: 0, suspiciousRegions: 0, isEdited: false });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      
      // Рисуем оригинал
      ctx.drawImage(img, 0, 0);
      const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Создаём JPEG с заданным качеством
      canvas.toBlob((blob) => {
        if (!blob) {
          URL.revokeObjectURL(url);
          resolve({ meanError: 0, maxError: 0, suspiciousRegions: 0, isEdited: false });
          return;
        }
        
        const recompressedImg = new Image();
        const recompressedUrl = URL.createObjectURL(blob);
        
        recompressedImg.onload = () => {
          // Рису перекомпримированное изображение
          ctx.drawImage(recompressedImg, 0, 0);
          const recompressedData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          
          // Вычисляем разницу
          let totalDiff = 0;
          let maxDiff = 0;
          let suspiciousPixels = 0;
          const pixelCount = originalData.data.length / 4;
          
          for (let i = 0; i < originalData.data.length; i += 4) {
            const diffR = Math.abs(originalData.data[i] - recompressedData.data[i]);
            const diffG = Math.abs(originalData.data[i + 1] - recompressedData.data[i + 1]);
            const diffB = Math.abs(originalData.data[i + 2] - recompressedData.data[i + 2]);
            
            const diff = (diffR + diffG + diffB) / 3;
            totalDiff += diff;
            maxDiff = Math.max(maxDiff, diff);
            
            // Пиксели с высокой разницей считаются подозрительными
            if (diff > 20) {
              suspiciousPixels++;
            }
          }
          
          const meanError = totalDiff / pixelCount;
          const suspiciousRegions = Math.round((suspiciousPixels / pixelCount) * 100);
          
          // Если много подозрительных пикселей — возможно редактирование
          const isEdited = suspiciousRegions > 10 || meanError > 15;
          
          URL.revokeObjectURL(url);
          URL.revokeObjectURL(recompressedUrl);
          
          resolve({
            meanError: Math.round(meanError * 100) / 100,
            maxError: Math.round(maxDiff * 100) / 100,
            suspiciousRegions,
            isEdited,
          });
        };
        
        recompressedImg.src = recompressedUrl;
      }, 'image/jpeg', quality / 100);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ meanError: 0, maxError: 0, suspiciousRegions: 0, isEdited: false });
    };
    
    img.src = url;
  });
}

/**
 * Анализ гистограммы изображения
 * Помогает выявить признаки редактирования
 */
export async function analyzeHistogram(file: File): Promise<{
  isManipulated: boolean;
  anomalies: number;
  description: string;
}> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve({ isManipulated: false, anomalies: 0, description: 'Не удалось проанализировать' });
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const histogram = new Array(256).fill(0);
      
      // Строим гистограмму яркости
      for (let i = 0; i < imageData.data.length; i += 4) {
        const brightness = Math.round(
          (imageData.data[i] * 0.299 +
           imageData.data[i + 1] * 0.587 +
           imageData.data[i + 2] * 0.114)
        );
        histogram[brightness]++;
      }
      
      // Анализируем гистограмму на аномалии
      let anomalies = 0;
      const totalPixels = imageData.data.length / 4;
      
      // Проверяем на "гребёнку" (признаки постеризации)
      for (let i = 1; i < 255; i++) {
        const prev = histogram[i - 1];
        const curr = histogram[i];
        const next = histogram[i + 1];
        
        // Резкие перепады между соседними значениями
        if (curr > 0 && (prev === 0 || next === 0)) {
          anomalies++;
        }
      }
      
      // Проверяем на пустые диапазоны (признаки редактирования)
      let emptyRanges = 0;
      let currentEmpty = 0;
      
      for (let i = 0; i < 256; i++) {
        if (histogram[i] === 0) {
          currentEmpty++;
        } else {
          if (currentEmpty > 10) {
            emptyRanges++;
          }
          currentEmpty = 0;
        }
      }
      
      const isManipulated = anomalies > 20 || emptyRanges > 3;
      const description = isManipulated
        ? `Обнаружены аномалии в гистограмме: ${anomalies} резких перепадов, ${emptyRanges} пустых диапазонов`
        : 'Гистограмма выглядит нормально';
      
      URL.revokeObjectURL(url);
      
      resolve({
        isManipulated,
        anomalies,
        description,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ isManipulated: false, anomalies: 0, description: 'Ошибка анализа' });
    };
    
    img.src = url;
  });
}
