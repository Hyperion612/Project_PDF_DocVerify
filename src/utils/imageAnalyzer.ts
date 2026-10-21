import exifr from 'exifr';

export interface ImageMetadata {
  width: number;
  height: number;
  format: string;
  colorSpace: string | null;
  bitDepth: number | null;
  dpi: number | null;
}

export interface ImageExif {
  camera: string | null;
  lens: string | null;
  software: string | null;
  dateTaken: string | null;
  dateModified: string | null;
  gps: { lat: number; lon: number } | null;
  iso: number | null;
  focalLength: number | null;
  aperture: number | null;
  exposureTime: string | null;
  hasGPS: boolean;
  hasThumbnail: boolean;
}

export interface ImageCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  description: string;
}

export interface ImageAnalysisResult {
  isValid: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  metadata: ImageMetadata;
  exif: ImageExif;
  checks: ImageCheck[];
  warnings: string[];
  anomalies: string[];
}

const SUSPICIOUS_SOFTWARE = [
  'adobe photoshop',
  'gimp',
  'paint.net',
  'pixelmator',
  'affinity photo',
  'corel',
  'lightroom',
  'darktable',
  'rawtherapee',
];

export async function analyzeImage(file: File): Promise<ImageAnalysisResult> {
  const checks: ImageCheck[] = [];
  const warnings: string[] = [];
  const anomalies: string[] = [];

  // Базовая информация об изображении
  const { width, height, format } = await getImageDimensions(file);
  
  const imageMetadata: ImageMetadata = {
    width,
    height,
    format,
    colorSpace: null,
    bitDepth: null,
    dpi: null,
  };

  // Извлечение EXIF
  let exifData: any = null;
  try {
    exifData = await exifr.parse(file, true);
  } catch {
    // EXIF может отсутствовать
  }

  const exif: ImageExif = {
    camera: null,
    lens: null,
    software: null,
    dateTaken: null,
    dateModified: null,
    gps: null,
    iso: null,
    focalLength: null,
    aperture: null,
    exposureTime: null,
    hasGPS: false,
    hasThumbnail: false,
  };

  if (exifData) {
    exif.camera = exifData.Make && exifData.Model
      ? `${exifData.Make} ${exifData.Model}`
      : exifData.Model || exifData.Make || null;
    exif.lens = exifData.LensModel || null;
    exif.software = exifData.Software || null;
    exif.dateTaken = exifData.DateTimeOriginal 
      ? formatDate(exifData.DateTimeOriginal) 
      : exifData.CreateDate ? formatDate(exifData.CreateDate) : null;
    exif.dateModified = exifData.ModifyDate ? formatDate(exifData.ModifyDate) : null;
    exif.iso = exifData.ISO || null;
    exif.focalLength = exifData.FocalLength || null;
    exif.aperture = exifData.FNumber || null;
    exif.exposureTime = exifData.ExposureTime ? `${exifData.ExposureTime}s` : null;
    
    if (exifData.latitude && exifData.longitude) {
      exif.gps = { lat: exifData.latitude, lon: exifData.longitude };
      exif.hasGPS = true;
    }

    imageMetadata.colorSpace = exifData.ColorSpace || null;
    imageMetadata.dpi = exifData.XResolution || null;
  }

  // === ПРОВЕРКИ ===

  // 1. Проверка соответствия расширения и формата
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const formatMatch = checkFormatMatch(ext, format);
  checks.push(formatMatch);
  if (formatMatch.status !== 'pass') anomalies.push(formatMatch.description);

  // 2. Проверка EXIF на наличие
  const hasExif = exifData != null;
  checks.push({
    name: 'EXIF данные',
    status: hasExif ? 'pass' : 'warning',
    score: hasExif ? 100 : 50,
    description: hasExif
      ? 'EXIF метаданные присутствуют'
      : 'EXIF метаданные отсутствуют — изображение могло быть обработано или скачано из интернета',
  });
  if (!hasExif) warnings.push('EXIF метаданные отсутствуют');

  // 3. Проверка на подозрительное ПО
  if (exif.software) {
    const swLower = exif.software.toLowerCase();
    const suspicious = SUSPICIOUS_SOFTWARE.filter(s => swLower.includes(s));
    if (suspicious.length > 0) {
      checks.push({
        name: 'Программное обеспечение',
        status: 'warning',
        score: 55,
        description: `Изображение обработано в: ${suspicious.join(', ')} — возможны манипуляции`,
      });
      warnings.push(`Обработано в: ${suspicious.join(', ')}`);
    } else {
      checks.push({
        name: 'Программное обеспечение',
        status: 'pass',
        score: 100,
        description: `ПО: ${exif.software}`,
      });
    }
  } else {
    checks.push({
      name: 'Программное обеспечение',
      status: 'pass',
      score: 80,
      description: 'Информация о ПО не найдена',
    });
  }

  // 4. Проверка дат
  if (exif.dateTaken && exif.dateModified) {
    try {
      const taken = new Date(exif.dateTaken);
      const modified = new Date(exif.dateModified);
      if (!isNaN(taken.getTime()) && !isNaN(modified.getTime()) && modified < taken) {
        checks.push({
          name: 'Согласованность дат',
          status: 'fail',
          score: 10,
          description: 'Дата модификации раньше даты съёмки — аномалия!',
        });
        anomalies.push('Дата модификации раньше даты съёмки');
      } else {
        checks.push({
          name: 'Согласованность дат',
          status: 'pass',
          score: 100,
          description: `Даты согласованы: съёмка ${exif.dateTaken}, модификация ${exif.dateModified}`,
        });
      }
    } catch {
      checks.push({
        name: 'Согласованность дат',
        status: 'warning',
        score: 50,
        description: 'Не удалось проанализировать даты',
      });
    }
  } else {
    checks.push({
      name: 'Согласованность дат',
      status: 'warning',
      score: 50,
      description: 'Неполные данные о датах',
    });
  }

  // 5. Проверка разрешения
  if (width > 0 && height > 0) {
    const aspectRatio = width / height;
    const isStandard = [
      4/3, 3/2, 16/9, 1, 5/4, 3/4, 2/3, 9/16
    ].some(r => Math.abs(aspectRatio - r) < 0.05);

    checks.push({
      name: 'Соотношение сторон',
      status: isStandard ? 'pass' : 'warning',
      score: isStandard ? 100 : 65,
      description: `${width}×${height} (соотношение ${aspectRatio.toFixed(2)})`,
    });
    if (!isStandard) warnings.push('Нестандартное соотношение сторон');
  }

  // 6. Проверка размера файла
  const sizeMB = file.size / (1024 * 1024);
  const pixels = width * height;
  const expectedSizeMB = pixels / 1000000 * 0.5; // грубая оценка

  if (sizeMB > expectedSizeMB * 5) {
    checks.push({
      name: 'Размер файла',
      status: 'warning',
      score: 55,
      description: `Файл (${sizeMB.toFixed(2)} МБ) необычно велик для разрешения ${width}×${height}`,
    });
    warnings.push('Необычно большой размер файла');
  } else if (sizeMB < expectedSizeMB * 0.1 && pixels > 1000000) {
    checks.push({
      name: 'Размер файла',
      status: 'warning',
      score: 55,
      description: `Файл (${sizeMB.toFixed(2)} МБ) необычно мал для разрешения ${width}×${height}`,
    });
    warnings.push('Необычно малый размер файла');
  } else {
    checks.push({
      name: 'Размер файла',
      status: 'pass',
      score: 100,
      description: `Размер файла: ${sizeMB.toFixed(2)} МБ`,
    });
  }

  // 7. Проверка GPS данных
  if (exif.hasGPS) {
    checks.push({
      name: 'GPS координаты',
      status: 'pass',
      score: 100,
      description: `GPS: ${exif.gps?.lat.toFixed(4)}, ${exif.gps?.lon.toFixed(4)}`,
    });
  } else {
    checks.push({
      name: 'GPS координаты',
      status: 'warning',
      score: 70,
      description: 'GPS координаты отсутствуют',
    });
  }

  // 8. Проверка на наличие камеры
  if (exif.camera) {
    checks.push({
      name: 'Камера',
      status: 'pass',
      score: 100,
      description: `Снято на: ${exif.camera}`,
    });
  } else {
    checks.push({
      name: 'Камера',
      status: 'warning',
      score: 50,
      description: 'Информация о камере отсутствует — возможно скриншот или обработанное изображение',
    });
    warnings.push('Информация о камере отсутствует');
  }

  // 9. Проверка параметров съёмки
  const hasCameraSettings = exif.iso || exif.focalLength || exif.aperture || exif.exposureTime;
  checks.push({
    name: 'Параметры съёмки',
    status: hasCameraSettings ? 'pass' : 'warning',
    score: hasCameraSettings ? 100 : 45,
    description: hasCameraSettings
      ? `ISO: ${exif.iso || '—'}, ${exif.focalLength || '—'}mm, f/${exif.aperture || '—'}, ${exif.exposureTime || '—'}`
      : 'Параметры съёмки отсутствуют — возможно, не оригинальное фото',
  });
  if (!hasCameraSettings) warnings.push('Параметры съёмки отсутствуют');

  // Расчёт итогового результата
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warning').length;
  const totalChecks = checks.length || 1;
  const avgScore = checks.reduce((sum, c) => sum + c.score, 0) / totalChecks;

  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let confidence = Math.round(avgScore);

  if (failCount >= 2 || anomalies.length >= 2) {
    riskLevel = 'high';
    confidence = Math.min(confidence, 40);
  } else if (failCount >= 1 || warnCount >= 4 || anomalies.length >= 1) {
    riskLevel = 'medium';
    confidence = Math.min(confidence, 70);
  }

  return {
    isValid: riskLevel === 'low',
    riskLevel,
    confidence,
    metadata: imageMetadata,
    exif,
    checks,
    warnings,
    anomalies,
  };
}

function getImageDimensions(file: File): Promise<{ width: number; height: number; format: string }> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const format = file.type || `image/${ext}`;
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
        format,
      });
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ width: 0, height: 0, format: file.type });
    };
    
    img.src = url;
  });
}

function checkFormatMatch(ext: string, mimeType: string): ImageCheck {
  const formatMap: Record<string, string[]> = {
    'jpg': ['image/jpeg'],
    'jpeg': ['image/jpeg'],
    'png': ['image/png'],
    'gif': ['image/gif'],
    'webp': ['image/webp'],
    'bmp': ['image/bmp'],
    'tiff': ['image/tiff'],
    'tif': ['image/tiff'],
  };

  const expected = formatMap[ext] || [];
  const matches = expected.length === 0 || expected.includes(mimeType);

  return {
    name: 'Соответствие формата',
    status: matches ? 'pass' : 'fail',
    score: matches ? 100 : 0,
    description: matches
      ? `Расширение .${ext} соответствует MIME типу ${mimeType}`
      : `Расширение .${ext} не соответствует MIME типу ${mimeType} — файл мог быть переименован`,
  };
}

function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  if (!(date instanceof Date) || isNaN(date.getTime())) return String(date);
  return date.toISOString().split('T')[0] + ' ' + date.toTimeString().split(' ')[0];
}
