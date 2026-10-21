export async function computeFileHash(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function detectFileType(file: File): 'pdf' | 'image' | 'unknown' {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const mime = file.type.toLowerCase();
  
  if (mime === 'application/pdf' || ext === 'pdf') return 'pdf';
  if (mime.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'tiff'].includes(ext)) return 'image';
  return 'unknown';
}

export interface AnalysisRecord {
  id: string;
  fileName: string;
  fileType: 'pdf' | 'image';
  fileSize: number;
  timestamp: number;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  summary: string;
}

export function saveAnalysisRecord(record: AnalysisRecord): void {
  const existing = getAnalysisHistory();
  existing.unshift(record);
  // Храним максимум 50 записей
  localStorage.setItem('docverify_history', JSON.stringify(existing.slice(0, 50)));
}

export function getAnalysisHistory(): AnalysisRecord[] {
  try {
    const data = localStorage.getItem('docverify_history');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function clearHistory(): void {
  localStorage.removeItem('docverify_history');
}
