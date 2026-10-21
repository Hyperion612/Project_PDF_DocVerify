/**
 * Heatmap Generator
 * Генерирует визуализацию подозрительных областей изображения
 */

export interface HeatmapResult {
  dataUrl: string;
  suspiciousRegions: number;
  maxIntensity: number;
}

export async function generateHeatmap(
  file: File,
  blockSize: number = 16
): Promise<HeatmapResult> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        URL.revokeObjectURL(url);
        resolve({ dataUrl: '', suspiciousRegions: 0, maxIntensity: 0 });
        return;
      }

      // Ограничиваем размер для производительности
      const maxSize = 800;
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
      
      // Создаём карту интенсивности
      const blocksX = Math.ceil(width / blockSize);
      const blocksY = Math.ceil(height / blockSize);
      const intensityMap = new Array(blocksX * blocksY).fill(0);
      
      let maxIntensity = 0;
      
      // Анализируем каждый блок
      for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
          let totalVariance = 0;
          let pixelCount = 0;
          
          const startX = bx * blockSize;
          const startY = by * blockSize;
          const endX = Math.min(startX + blockSize, width);
          const endY = Math.min(startY + blockSize, height);
          
          // Вычисляем среднее значение яркости в блоке
          let sumBrightness = 0;
          for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
              const i = (y * width + x) * 4;
              const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
              sumBrightness += brightness;
              pixelCount++;
            }
          }
          
          const avgBrightness = sumBrightness / pixelCount;
          
          // Вычисляем вариацию (отклонение от среднего)
          for (let y = startY; y < endY; y++) {
            for (let x = startX; x < endX; x++) {
              const i = (y * width + x) * 4;
              const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
              totalVariance += Math.abs(brightness - avgBrightness);
            }
          }
          
          const variance = totalVariance / pixelCount;
          intensityMap[by * blocksX + bx] = variance;
          maxIntensity = Math.max(maxIntensity, variance);
        }
      }
      
      // Нормализуем интенсивность
      if (maxIntensity > 0) {
        for (let i = 0; i < intensityMap.length; i++) {
          intensityMap[i] = intensityMap[i] / maxIntensity;
        }
      }
      
      // Рисуем heatmap
      const heatmapCanvas = document.createElement('canvas');
      const heatmapCtx = heatmapCanvas.getContext('2d');
      
      if (!heatmapCtx) {
        URL.revokeObjectURL(url);
        resolve({ dataUrl: '', suspiciousRegions: 0, maxIntensity });
        return;
      }
      
      heatmapCanvas.width = width;
      heatmapCanvas.height = height;
      
      // Рисуем оригинальное изображение с прозрачностью
      heatmapCtx.globalAlpha = 0.3;
      heatmapCtx.drawImage(img, 0, 0, width, height);
      
      // Рисуем блоки с цветовой кодировкой
      heatmapCtx.globalAlpha = 0.7;
      
      let suspiciousRegions = 0;
      
      for (let by = 0; by < blocksY; by++) {
        for (let bx = 0; bx < blocksX; bx++) {
          const intensity = intensityMap[by * blocksX + bx];
          
          // Цветовая кодировка: зелёный (низкая) → жёлтый (средняя) → красный (высокая)
          let r, g, b;
          
          if (intensity < 0.33) {
            // Зелёный
            r = 0;
            g = 255;
            b = 0;
          } else if (intensity < 0.66) {
            // Жёлтый
            r = 255;
            g = 255;
            b = 0;
          } else {
            // Красный
            r = 255;
            g = 0;
            b = 0;
            suspiciousRegions++;
          }
          
          heatmapCtx.fillStyle = `rgb(${r}, ${g}, ${b})`;
          heatmapCtx.fillRect(bx * blockSize, by * blockSize, blockSize, blockSize);
        }
      }
      
      URL.revokeObjectURL(url);
      
      resolve({
        dataUrl: heatmapCanvas.toDataURL('image/png'),
        suspiciousRegions,
        maxIntensity: Math.round(maxIntensity * 100) / 100,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ dataUrl: '', suspiciousRegions: 0, maxIntensity: 0 });
    };
    
    img.src = url;
  });
}
