/**
 * LSB (Least Significant Bit) Analysis
 * Анализирует наименее значимые биты пикселей для выявления стеганографии и редактирования
 */

export interface LSBAnalysisResult {
  meanDeviation: number;
  maxDeviation: number;
  suspiciousPixels: number;
  suspiciousPercentage: number;
  isSteganography: boolean;
  channelAnalysis: {
    red: number;
    green: number;
    blue: number;
  };
  pattern: 'natural' | 'suspicious' | 'highly_suspicious';
  description: string;
}

export async function performLSBAnalysis(file: File): Promise<LSBAnalysisResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve(getDefaultResult());
        return;
      }

      // Ограничиваем размер для производительности
      const maxSize = 1024;
      let width = img.width;
      let height = img.height;
      
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.floor(width * ratio);
        height = Math.floor(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      
      let totalDeviation = 0;
      let maxDeviation = 0;
      let suspiciousPixels = 0;
      
      let redDeviation = 0;
      let greenDeviation = 0;
      let blueDeviation = 0;
      
      const pixelCount = data.length / 4;
      
      // Анализируем LSB каждого канала
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Извлекаем LSB
        const lsbR = r & 1;
        const lsbG = g & 1;
        const lsbB = b & 1;
        
        // В естественных изображениях LSB должны быть случайными (50/50)
        // Если есть паттерн — это подозрительно
        const avgLSB = (lsbR + lsbG + lsbB) / 3;
        const deviation = Math.abs(avgLSB - 0.5);
        
        totalDeviation += deviation;
        maxDeviation = Math.max(maxDeviation, deviation);
        
        redDeviation += lsbR;
        greenDeviation += lsbG;
        blueDeviation += lsbB;
        
        // Если отклонение слишком большое — подозрительный пиксель
        if (deviation > 0.3) {
          suspiciousPixels++;
        }
      }
      
      const meanDeviation = totalDeviation / pixelCount;
      const suspiciousPercentage = (suspiciousPixels / pixelCount) * 100;
      
      const channelAnalysis = {
        red: redDeviation / pixelCount,
        green: greenDeviation / pixelCount,
        blue: blueDeviation / pixelCount,
      };
      
      // Определяем паттерн
      let pattern: 'natural' | 'suspicious' | 'highly_suspicious';
      let isSteganography = false;
      
      if (suspiciousPercentage > 30 || meanDeviation > 0.25) {
        pattern = 'highly_suspicious';
        isSteganography = true;
      } else if (suspiciousPercentage > 15 || meanDeviation > 0.15) {
        pattern = 'suspicious';
        isSteganography = suspiciousPercentage > 20;
      } else {
        pattern = 'natural';
      }
      
      const description = pattern === 'natural'
        ? 'LSB анализ показывает естественное распределение — признаков стеганографии не обнаружено'
        : pattern === 'suspicious'
        ? 'Обнаружены аномалии в LSB — возможна стеганография или редактирование'
        : 'Высокая степень аномалий в LSB — вероятна стеганография или серьёзное редактирование';
      
      URL.revokeObjectURL(url);
      
      resolve({
        meanDeviation: Math.round(meanDeviation * 1000) / 1000,
        maxDeviation: Math.round(maxDeviation * 1000) / 1000,
        suspiciousPixels,
        suspiciousPercentage: Math.round(suspiciousPercentage * 100) / 100,
        isSteganography,
        channelAnalysis,
        pattern,
        description,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(getDefaultResult());
    };
    
    img.src = url;
  });
}

function getDefaultResult(): LSBAnalysisResult {
  return {
    meanDeviation: 0,
    maxDeviation: 0,
    suspiciousPixels: 0,
    suspiciousPercentage: 0,
    isSteganography: false,
    channelAnalysis: { red: 0, green: 0, blue: 0 },
    pattern: 'natural',
    description: 'Не удалось выполнить LSB анализ',
  };
}
