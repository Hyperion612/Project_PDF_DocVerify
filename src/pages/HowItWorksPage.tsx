import { Link } from 'react-router-dom';

export default function HowItWorksPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Как работает DocVerify
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Верификация документов стала проще благодаря технологии на базе искусственного интеллекта
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-white">Простой процесс</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Проверяйте документы в три простых шага с нашей безопасной платформой на базе ИИ.
            </p>
          </div>

          <div className="space-y-16">
            {/* Step 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    1
                  </div>
                  <h3 className="text-2xl font-bold text-white">Загрузка документа</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Перетащите ваш PDF или изображение в окно загрузки, или выберите файл вручную через панель управления. 
                  Вы также можете подключиться к нашему API или конвейеру обработки через Dropbox, Google Drive, 
                  Amazon S3 или Microsoft OneDrive.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['PDF', 'PNG', 'JPG', 'JPEG'].map((format) => (
                    <span key={format} className="px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-sm text-gray-300">
                      {format}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
                <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-400 mb-2">Перетащите файл сюда</p>
                  <p className="text-gray-500 text-sm">или нажмите для выбора</p>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-gray-500 text-sm">API</span>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 order-2 lg:order-1">
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">Действительная подпись</span>
                    </div>
                    <span className="text-emerald-400 text-xs font-mono">✓</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">Создано ИИ</span>
                    </div>
                    <span className="text-yellow-400 text-xs font-mono">⚠</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">Подделка</span>
                    </div>
                    <span className="text-red-400 text-xs font-mono">✗</span>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    2
                  </div>
                  <h3 className="text-2xl font-bold text-white">Анализ за секунды</h3>
                </div>
                <p className="text-gray-400 leading-relaxed">
                  Наша система мгновенно анализирует документ с помощью продвинутого ИИ для обнаружения мошенничества. 
                  Исследуются метаданные, структура текста, встроенные подписи и потенциальные манипуляции. 
                  Каждая проверка выполняется по множеству параметров параллельно.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    3
                  </div>
                  <h3 className="text-2xl font-bold text-white">Получение результатов</h3>
                </div>
                <p className="text-gray-400 leading-relaxed mb-4">
                  Получите детальный отчёт о подлинности документа — прямо на панели управления или через webhook. 
                  Увидьте, что именно было проверено и почему, с абсолютной прозрачностью каждого этапа анализа.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm">Надёжный ✓</span>
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">Средний риск</span>
                  <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">Высокий риск</span>
                </div>
              </div>
              <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Вердикт</span>
                    <span className="text-emerald-400 font-semibold text-sm">Подлинный</span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full w-[97%] bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Уверенность</span>
                    <span className="text-white font-mono text-sm">97.3%</span>
                  </div>
                  <hr className="border-gray-800" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Подписи</span>
                    <span className="text-emerald-400 text-sm">Проверены</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Метаданные</span>
                    <span className="text-emerald-400 text-sm">Целостны</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">ИИ-генерация</span>
                    <span className="text-emerald-400 text-sm">Не обнаружена</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Готовы проверить свой первый документ?</h2>
          <p className="text-gray-400 mb-8">Оцените мощь верификации документов на базе искусственного интеллекта.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Проверить сейчас
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
            >
              Тарифные планы →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
