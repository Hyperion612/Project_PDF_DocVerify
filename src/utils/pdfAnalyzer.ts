import * as pdfjsLib from 'pdfjs-dist';

// Настройка worker через CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export interface PDFAnalysisResult {
  isValid: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  metadata: {
    title: string | null;
    author: string | null;
    subject: string | null;
    creator: string | null;
    producer: string | null;
    creationDate: string | null;
    modificationDate: string | null;
    keywords: string | null;
  };
  structure: {
    numPages: number;
    fileSize: number;
    hasJavaScript: boolean;
    hasEmbeddedFiles: boolean;
    hasSignatures: boolean;
    fonts: string[];
    isEncrypted: boolean;
    isLinearized: boolean;
  };
  checks: AnalysisCheck[];
  rawText: string;
  warnings: string[];
  anomalies: string[];
}

export interface AnalysisCheck {
  name: string;
  status: 'pass' | 'warning' | 'fail';
  score: number;
  description: string;
}

const SUSPICIOUS_EDITORS = [
  'adobe photoshop',
  'adobe illustrator',
  'gimp',
  'paint.net',
  'coreldraw',
  'affinity',
  'pixelmator',
  'seashore',
];

const SUSPICIOUS_PRODUCERS = [
  'ghostscript',
  'princexml',
  'wkhtmltopdf',
  'microsoft word',
  'openoffice',
];

export async function analyzePDF(file: File): Promise<PDFAnalysisResult> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  
  const checks: AnalysisCheck[] = [];
  const warnings: string[] = [];
  const anomalies: string[] = [];

  // 1. Проверка заголовка PDF
  const headerCheck = checkPDFHeader(uint8Array);
  checks.push(headerCheck);
  if (headerCheck.status === 'fail') anomalies.push(headerCheck.description);

  // 2. Загрузка PDF через pdf.js
  let pdfDoc;
  let metadata: PDFAnalysisResult['metadata'] = {
    title: null, author: null, subject: null, creator: null,
    producer: null, creationDate: null, modificationDate: null, keywords: null,
  };
  let structure: PDFAnalysisResult['structure'] = {
    numPages: 0, fileSize: file.size, hasJavaScript: false,
    hasEmbeddedFiles: false, hasSignatures: false, fonts: [],
    isEncrypted: false, isLinearized: false,
  };
  let rawText = '';

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: uint8Array,
      useSystemFonts: true,
      stopAtErrors: false,
    });
    
    pdfDoc = await loadingTask.promise;
    
    // Извлечение метаданных
    const meta = await pdfDoc.getMetadata().catch(() => null);
    if (meta) {
      const info = meta.info as any;
      if (info) {
        metadata = {
          title: info.Title || null,
          author: info.Author || null,
          subject: info.Subject || null,
          creator: info.Creator || null,
          producer: info.Producer || null,
          creationDate: info.CreationDate ? formatDate(info.CreationDate) : null,
          modificationDate: info.ModDate ? formatDate(info.ModDate) : null,
          keywords: info.Keywords || null,
        };
      }
    }

    structure.numPages = pdfDoc.numPages;
    // Проверка шифрования через метаданные
    const encryptMeta = meta?.info as any;
    structure.isEncrypted = encryptMeta?.IsEncrypted === true || encryptMeta?.Filter != null;

    // Извлечение текста для анализа
    for (let i = 1; i <= Math.min(pdfDoc.numPages, 5); i++) {
      const page = await pdfDoc.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      rawText += pageText + '\n';

      // Сбор шрифтов
      const ops = await page.getOperatorList();
      for (let j = 0; j < ops.fnArray.length; j++) {
        if (ops.fnArray[j] === pdfjsLib.OPS.setFont) {
          const fontName = ops.argsArray[j][0] as string;
          if (fontName && !structure.fonts.includes(fontName)) {
            structure.fonts.push(fontName);
          }
        }
      }
    }

    // 3. Проверка на JavaScript в PDF
    const jsCheck = checkForJavaScript(uint8Array);
    checks.push(jsCheck);
    if (jsCheck.status !== 'pass') {
      structure.hasJavaScript = true;
      warnings.push(jsCheck.description);
    }

    // 4. Проверка на встроенные файлы
    const embeddedCheck = checkForEmbeddedFiles(uint8Array);
    checks.push(embeddedCheck);
    if (embeddedCheck.status !== 'pass') {
      structure.hasEmbeddedFiles = true;
      warnings.push(embeddedCheck.description);
    }

    // 5. Проверка на цифровые подписи
    const sigCheck = checkForSignatures(uint8Array);
    checks.push(sigCheck);
    structure.hasSignatures = sigCheck.status === 'pass';

    // 6. Проверка на линейность
    structure.isLinearized = checkLinearization(uint8Array);

    // 7. Анализ Producer/Creator на подозрительные редакторы
    const editorCheck = checkForSuspiciousEditors(metadata);
    checks.push(editorCheck);
    if (editorCheck.status !== 'pass') anomalies.push(editorCheck.description);

    // 8. Проверка дат
    const dateCheck = checkDates(metadata);
    checks.push(dateCheck);
    if (dateCheck.status !== 'pass') warnings.push(dateCheck.description);

    // 9. Проверка согласованности шрифтов
    const fontCheck = checkFontConsistency(structure.fonts);
    checks.push(fontCheck);
    if (fontCheck.status !== 'pass') warnings.push(fontCheck.description);

    // 10. Проверка целостности структуры
    const integrityCheck = checkStructuralIntegrity(uint8Array);
    checks.push(integrityCheck);
    if (integrityCheck.status !== 'pass') anomalies.push(integrityCheck.description);

    // 11. Проверка размера файла
    const sizeCheck = checkFileSize(file.size, structure.numPages);
    checks.push(sizeCheck);
    if (sizeCheck.status !== 'pass') warnings.push(sizeCheck.description);

    // 12. Проверка метаданных на пустоту
    const metaCheck = checkMetadataCompleteness(metadata);
    checks.push(metaCheck);
    if (metaCheck.status !== 'pass') warnings.push(metaCheck.description);

  } catch (error: any) {
    anomalies.push(`Ошибка парсинга PDF: ${error.message}`);
    checks.push({
      name: 'Валидность PDF',
      status: 'fail',
      score: 0,
      description: `Не удалось разобрать файл: ${error.message}`,
    });
  }

  // Расчёт общего уровня риска
  const failCount = checks.filter(c => c.status === 'fail').length;
  const warnCount = checks.filter(c => c.status === 'warning').length;
  const totalChecks = checks.length || 1;
  
  const avgScore = checks.reduce((sum, c) => sum + c.score, 0) / totalChecks;
  
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let confidence = Math.round(avgScore);
  
  if (failCount >= 2 || anomalies.length >= 2) {
    riskLevel = 'high';
    confidence = Math.min(confidence, 40);
  } else if (failCount >= 1 || warnCount >= 3 || anomalies.length >= 1) {
    riskLevel = 'medium';
    confidence = Math.min(confidence, 70);
  }

  const isValid = riskLevel === 'low';

  return {
    isValid,
    riskLevel,
    confidence,
    metadata,
    structure,
    checks,
    rawText: rawText.substring(0, 2000),
    warnings,
    anomalies,
  };
}

function checkPDFHeader(data: Uint8Array): AnalysisCheck {
  const header = String.fromCharCode(...data.slice(0, 5));
  const isValid = header.startsWith('%PDF-');
  return {
    name: 'Заголовок PDF',
    status: isValid ? 'pass' : 'fail',
    score: isValid ? 100 : 0,
    description: isValid
      ? 'Заголовок файла соответствует формату PDF'
      : 'Заголовок файла не соответствует формату PDF — возможно, файл повреждён или переименован',
  };
}

function checkForJavaScript(data: Uint8Array): AnalysisCheck {
  const text = new TextDecoder('latin1').decode(data.slice(0, Math.min(data.length, 500000)));
  const hasJS = /\/JavaScript|\/JS\s|\/OpenAction|\/AA\s/.test(text);
  return {
    name: 'JavaScript в PDF',
    status: hasJS ? 'warning' : 'pass',
    score: hasJS ? 40 : 100,
    description: hasJS
      ? 'Обнаружен JavaScript в документе — потенциальный вектор атаки'
      : 'JavaScript не обнаружен в документе',
  };
}

function checkForEmbeddedFiles(data: Uint8Array): AnalysisCheck {
  const text = new TextDecoder('latin1').decode(data.slice(0, Math.min(data.length, 500000)));
  const hasEmbedded = /\/EmbeddedFiles|\/EmbeddedFile/.test(text);
  return {
    name: 'Встроенные файлы',
    status: hasEmbedded ? 'warning' : 'pass',
    score: hasEmbedded ? 60 : 100,
    description: hasEmbedded
      ? 'Обнаружены встроенные файлы — требуется дополнительная проверка'
      : 'Встроенные файлы не обнаружены',
  };
}

function checkForSignatures(data: Uint8Array): AnalysisCheck {
  const text = new TextDecoder('latin1').decode(data.slice(0, Math.min(data.length, 500000)));
  const hasSigs = /\/Sig|\/Signature|\/ByteRange/.test(text);
  return {
    name: 'Цифровые подписи',
    status: hasSigs ? 'pass' : 'warning',
    score: hasSigs ? 100 : 70,
    description: hasSigs
      ? 'Обнаружены цифровые подписи в документе'
      : 'Цифровые подписи не обнаружены — документ не подписан',
  };
}

function checkLinearization(data: Uint8Array): boolean {
  const text = new TextDecoder('latin1').decode(data.slice(0, 1024));
  return /\/Linearized/.test(text);
}

function checkForSuspiciousEditors(metadata: PDFAnalysisResult['metadata']): AnalysisCheck {
  const fields = [
    (metadata.creator || '').toLowerCase(),
    (metadata.producer || '').toLowerCase(),
  ].join(' ');

  const found = SUSPICIOUS_EDITORS.filter(e => fields.includes(e));
  const hasProducer = SUSPICIOUS_PRODUCERS.filter(p => fields.includes(p));
  const allFound = [...found, ...hasProducer];

  if (found.length > 0) {
    return {
      name: 'Графические редакторы',
      status: 'fail',
      score: 20,
      description: `Обнаружены следы графического редактора: ${found.join(', ')} — документ мог быть отредактирован`,
    };
  }
  
  if (hasProducer.length > 0) {
    return {
      name: 'Подозрительный Producer',
      status: 'warning',
      score: 60,
      description: `Producer указывает на возможную конвертацию: ${hasProducer.join(', ')}`,
    };
  }

  return {
    name: 'Графические редакторы',
    status: 'pass',
    score: 100,
    description: 'Следы графических редакторов не обнаружены',
  };
}

function checkDates(metadata: PDFAnalysisResult['metadata']): AnalysisCheck {
  if (!metadata.creationDate || !metadata.modificationDate) {
    return {
      name: 'Анализ дат',
      status: 'warning',
      score: 60,
      description: 'Отсутствуют даты создания или модификации — метаданные могли быть удалены',
    };
  }

  const created = new Date(metadata.creationDate);
  const modified = new Date(metadata.modificationDate);

  if (modified < created) {
    return {
      name: 'Анализ дат',
      status: 'fail',
      score: 10,
      description: 'Дата модификации раньше даты создания — аномалия!',
    };
  }

  // Проверка на будущие даты
  const now = new Date();
  if (created > now || modified > now) {
    return {
      name: 'Анализ дат',
      status: 'fail',
      score: 15,
      description: 'Обнаружены даты в будущем — документ мог быть сфальсифицирован',
    };
  }

  return {
    name: 'Анализ дат',
    status: 'pass',
    score: 100,
    description: `Даты согласованы: создан ${metadata.creationDate}, изменён ${metadata.modificationDate}`,
  };
}

function checkFontConsistency(fonts: string[]): AnalysisCheck {
  if (fonts.length === 0) {
    return {
      name: 'Согласованность шрифтов',
      status: 'warning',
      score: 50,
      description: 'Не удалось определить используемые шрифты',
    };
  }

  if (fonts.length > 15) {
    return {
      name: 'Согласованность шрифтов',
      status: 'warning',
      score: 50,
      description: `Обнаружено ${fonts.length} различных шрифтов — необычно большое количество`,
    };
  }

  return {
    name: 'Согласованность шрифтов',
    status: 'pass',
    score: 100,
    description: `Используется ${fonts.length} шрифт(ов) — согласованно`,
  };
}

function checkStructuralIntegrity(data: Uint8Array): AnalysisCheck {
  const text = new TextDecoder('latin1').decode(data.slice(Math.max(0, data.length - 1024)));
  const hasEOF = /%%EOF/.test(text);
  
  // Проверка на множественные %%EOF (может указывать на сращивание)
  const fullText = new TextDecoder('latin1').decode(data);
  const eofCount = (fullText.match(/%%EOF/g) || []).length;

  if (!hasEOF) {
    return {
      name: 'Целостность структуры',
      status: 'fail',
      score: 20,
      description: 'Отсутствует маркер %%EOF — файл может быть повреждён',
    };
  }

  if (eofCount > 3) {
    return {
      name: 'Целостность структуры',
      status: 'warning',
      score: 55,
      description: `Обнаружено ${eofCount} маркеров %%EOF — возможно сращивание документов`,
    };
  }

  return {
    name: 'Целостность структуры',
    status: 'pass',
    score: 100,
    description: 'Структура PDF корректна',
  };
}

function checkFileSize(size: number, numPages: number): AnalysisCheck {
  if (numPages === 0) {
    return {
      name: 'Размер файла',
      status: 'warning',
      score: 50,
      description: 'Не удалось определить количество страниц',
    };
  }

  const sizePerPage = size / numPages;
  
  // Слишком маленький файл для количества страниц
  if (sizePerPage < 500 && numPages > 1) {
    return {
      name: 'Размер файла',
      status: 'warning',
      score: 50,
      description: `Необычно малый размер файла (${(size / 1024).toFixed(1)} КБ для ${numPages} стр.)`,
    };
  }

  return {
    name: 'Размер файла',
    status: 'pass',
    score: 100,
    description: `Размер файла: ${(size / 1024).toFixed(1)} КБ, ${numPages} стр.`,
  };
}

function checkMetadataCompleteness(metadata: PDFAnalysisResult['metadata']): AnalysisCheck {
  const filled = Object.values(metadata).filter(v => v !== null && v !== '').length;
  const total = Object.keys(metadata).length;
  const ratio = filled / total;

  if (ratio < 0.3) {
    return {
      name: 'Полнота метаданных',
      status: 'warning',
      score: 40,
      description: `Заполнено только ${filled} из ${total} полей метаданных — возможно, метаданные были удалены`,
    };
  }

  return {
    name: 'Полнота метаданных',
    status: 'pass',
    score: 100,
    description: `Заполнено ${filled} из ${total} полей метаданных`,
  };
}

function formatDate(dateStr: string): string {
  // PDF даты в формате D:YYYYMMDDHHmmSS
  if (dateStr.startsWith('D:')) {
    const d = dateStr.substring(2);
    const year = d.substring(0, 4);
    const month = d.substring(4, 6) || '01';
    const day = d.substring(6, 8) || '01';
    const hour = d.substring(8, 10) || '00';
    const min = d.substring(10, 12) || '00';
    return `${year}-${month}-${day} ${hour}:${min}`;
  }
  return dateStr;
}
