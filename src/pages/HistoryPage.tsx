import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAnalysisHistory, clearHistory, type AnalysisRecord } from '../utils/fileUtils';
import { formatFileSize } from '../utils/fileUtils';

export default function HistoryPage() {
  const [history, setHistory] = useState<AnalysisRecord[]>([]);

  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, []);

  const handleClear = () => {
    if (confirm('Удалить всю историю проверок?')) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">История проверок</h1>
            <p className="text-gray-400">Все проанализированные документы сохраняются локально</p>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClear}
              className="px-4 py-2 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm hover:bg-red-500/20 transition-colors"
            >
              Очистить
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">История пуста</h3>
            <p className="text-gray-400 mb-6">Загрузите первый документ для анализа</p>
            <Link
              to="/upload"
              className="inline-flex px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Проверить документ
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((record) => (
              <div
                key={record.id + record.timestamp}
                className="bg-gray-900 border border-gray-800 rounded-xl p-5 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      record.riskLevel === 'low' ? 'bg-emerald-500/20' :
                      record.riskLevel === 'medium' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {record.fileType === 'pdf' ? (
                        <svg className={`w-5 h-5 ${
                          record.riskLevel === 'low' ? 'text-emerald-400' :
                          record.riskLevel === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className={`w-5 h-5 ${
                          record.riskLevel === 'low' ? 'text-emerald-400' :
                          record.riskLevel === 'medium' ? 'text-yellow-400' :
                          'text-red-400'
                        }`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-medium text-sm">{record.fileName}</h3>
                      <p className="text-gray-500 text-xs mt-1">
                        {formatFileSize(record.fileSize)} • {record.summary}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className={`text-lg font-bold ${
                      record.riskLevel === 'low' ? 'text-emerald-400' :
                      record.riskLevel === 'medium' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>{record.confidence}%</div>
                    <p className="text-gray-500 text-xs">
                      {new Date(record.timestamp).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/upload"
            className="inline-flex px-8 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Проверить новый документ
          </Link>
        </div>
      </div>
    </div>
  );
}
