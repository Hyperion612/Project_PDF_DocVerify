/**
 * Report Exporter
 * Экспорт отчётов в JSON и PDF
 */

export interface AnalysisReport {
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: number;
  fileHash: string;
  timestamp: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  checks: any[];
  warnings: string[];
  anomalies: string[];
  metadata?: any;
  structure?: any;
  aiResult?: any;
  elaResult?: any;
  lsbResult?: any;
  histogramResult?: any;
  textAnalysis?: any;
}

/**
 * Экспорт в JSON
 */
export function exportToJSON(report: AnalysisReport): void {
  const jsonString = JSON.stringify(report, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${report.fileName.replace(/\.[^/.]+$/, '')}_analysis_${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Экспорт в PDF (через print-friendly HTML)
 */
export function exportToPDF(report: AnalysisReport): void {
  const riskColor = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  
  const riskLabel = {
    low: 'ПОДЛИННЫЙ',
    medium: 'СРЕДНИЙ РИСК',
    high: 'ВЫСОКИЙ РИСК',
  };

  const html = `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Отчёт анализа: ${report.fileName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1f2937;
      padding: 40px;
      max-width: 900px;
      margin: 0 auto;
    }
    h1 { 
      color: #111827; 
      font-size: 28px; 
      margin-bottom: 8px;
      border-bottom: 3px solid #10b981;
      padding-bottom: 12px;
    }
    h2 { 
      color: #374151; 
      font-size: 20px; 
      margin-top: 32px;
      margin-bottom: 16px;
      border-left: 4px solid #10b981;
      padding-left: 12px;
    }
    h3 {
      color: #4b5563;
      font-size: 16px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 32px;
    }
    .meta {
      color: #6b7280;
      font-size: 14px;
    }
    .result-box {
      background: #f9fafb;
      border: 2px solid ${riskColor[report.riskLevel]};
      border-radius: 12px;
      padding: 24px;
      margin: 24px 0;
    }
    .result-label {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .result-value {
      font-size: 32px;
      font-weight: bold;
      color: ${riskColor[report.riskLevel]};
    }
    .confidence-bar {
      background: #e5e7eb;
      height: 12px;
      border-radius: 6px;
      margin-top: 12px;
      overflow: hidden;
    }
    .confidence-fill {
      background: ${riskColor[report.riskLevel]};
      height: 100%;
      width: ${report.confidence}%;
      border-radius: 6px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 14px;
    }
    th, td {
      text-align: left;
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    th {
      background: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }
    .check-item {
      padding: 12px;
      margin: 8px 0;
      border-radius: 8px;
      border-left: 4px solid;
    }
    .check-pass {
      background: #d1fae5;
      border-color: #10b981;
    }
    .check-warning {
      background: #fef3c7;
      border-color: #f59e0b;
    }
    .check-fail {
      background: #fee2e2;
      border-color: #ef4444;
    }
    .check-name {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .check-desc {
      font-size: 13px;
      color: #4b5563;
    }
    .check-score {
      float: right;
      font-weight: bold;
      font-size: 16px;
    }
    .warning-item, .anomaly-item {
      padding: 10px 14px;
      margin: 8px 0;
      border-radius: 6px;
      font-size: 14px;
    }
    .warning-item {
      background: #fef3c7;
      border-left: 3px solid #f59e0b;
    }
    .anomaly-item {
      background: #fee2e2;
      border-left: 3px solid #ef4444;
    }
    .disclaimer {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 16px;
      margin-top: 32px;
      font-size: 13px;
      color: #6b7280;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 12px;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Отчёт анализа документа</h1>
      <p class="meta">Сгенерировано: ${new Date(report.timestamp).toLocaleString('ru-RU')}</p>
    </div>
    <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #10b981; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px;">
      🖨️ Печать / Сохранить PDF
    </button>
  </div>

  <div class="result-box">
    <div class="result-label">Вердикт</div>
    <div class="result-value">${riskLabel[report.riskLevel]}</div>
    <div style="margin-top: 16px;">
      <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 4px;">
        <span>Уверенность</span>
        <span>${report.confidence}%</span>
      </div>
      <div class="confidence-bar">
        <div class="confidence-fill"></div>
      </div>
    </div>
  </div>

  <h2>Информация о файле</h2>
  <table>
    <tr><th>Имя файла</th><td>${report.fileName}</td></tr>
    <tr><th>Тип</th><td>${report.fileType === 'pdf' ? 'PDF документ' : 'Изображение'}</td></tr>
    <tr><th>Размер</th><td>${formatFileSize(report.fileSize)}</td></tr>
    <tr><th>SHA-256</th><td style="font-family: monospace; font-size: 12px; word-break: break-all;">${report.fileHash}</td></tr>
  </table>

  ${report.checks && report.checks.length > 0 ? `
    <h2>Результаты проверок (${report.checks.length})</h2>
    ${report.checks.map((check: any) => `
      <div class="check-item check-${check.status}">
        <span class="check-score">${check.score}%</span>
        <div class="check-name">${check.name}</div>
        <div class="check-desc">${check.description}</div>
      </div>
    `).join('')}
  ` : ''}

  ${report.anomalies && report.anomalies.length > 0 ? `
    <h2>⚠️ Аномалии (${report.anomalies.length})</h2>
    ${report.anomalies.map((a: string) => `
      <div class="anomaly-item">${a}</div>
    `).join('')}
  ` : ''}

  ${report.warnings && report.warnings.length > 0 ? `
    <h2>Предупреждения (${report.warnings.length})</h2>
    ${report.warnings.map((w: string) => `
      <div class="warning-item">${w}</div>
    `).join('')}
  ` : ''}

  ${report.aiResult ? `
    <h2>AI Анализ</h2>
    <table>
      <tr><th>AI-сгенерировано</th><td>${report.aiResult.isAIGenerated ? 'Да' : 'Нет'}</td></tr>
      <tr><th>Уверенность AI</th><td>${report.aiResult.confidence}%</td></tr>
    </table>
  ` : ''}

  ${report.elaResult ? `
    <h2>Error Level Analysis</h2>
    <table>
      <tr><th>Средняя ошибка</th><td>${report.elaResult.meanError}</td></tr>
      <tr><th>Максимальная ошибка</th><td>${report.elaResult.maxError}</td></tr>
      <tr><th>Подозрительные области</th><td>${report.elaResult.suspiciousRegions}%</td></tr>
      <tr><th>Признаки редактирования</th><td>${report.elaResult.isEdited ? 'Да' : 'Нет'}</td></tr>
    </table>
  ` : ''}

  ${report.lsbResult ? `
    <h2>LSB Анализ</h2>
    <table>
      <tr><th>Паттерн</th><td>${report.lsbResult.pattern}</td></tr>
      <tr><th>Подозрительные пиксели</th><td>${report.lsbResult.suspiciousPercentage}%</td></tr>
      <tr><th>Стеганография</th><td>${report.lsbResult.isSteganography ? 'Обнаружена' : 'Не обнаружена'}</td></tr>
    </table>
  ` : ''}

  ${report.textAnalysis ? `
    <h2>Анализ текста</h2>
    <table>
      <tr><th>Вердикт</th><td>${report.textAnalysis.verdict === 'ai' ? 'AI' : report.textAnalysis.verdict === 'human' ? 'Человек' : 'Неопределённо'}</td></tr>
      <tr><th>AI вероятность</th><td>${(report.textAnalysis.aiProbability * 100).toFixed(1)}%</td></tr>
      <tr><th>Perplexity</th><td>${report.textAnalysis.signals.perplexity}</td></tr>
      <tr><th>Burstiness</th><td>${report.textAnalysis.signals.burstiness}</td></tr>
    </table>
    ${report.textAnalysis.topReasons.length > 0 ? `
      <h3>Основные признаки</h3>
      <ul style="margin-left: 20px; margin-top: 8px;">
        ${report.textAnalysis.topReasons.map((r: string) => `<li>${r}</li>`).join('')}
      </ul>
    ` : ''}
  ` : ''}

  <div class="disclaimer">
    <strong>⚠️ Дисклеймер:</strong> Данный отчёт сгенерирован автоматически на основе алгоритмического анализа. 
    Результаты носят вероятностный характер и не являются юридически значимым заключением. 
    Для принятия важных решений рекомендуется дополнительная экспертиза квалифицированными специалистами.
  </div>

  <div class="footer">
    <p>DocVerify — Система верификации документов на базе ИИ</p>
    <p>Отчёт сгенерирован: ${new Date(report.timestamp).toLocaleString('ru-RU')}</p>
  </div>

  <script>
    // Автоматическая печать при открытии (опционально)
    // window.onload = () => window.print();
  </script>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
