import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-900/20 via-transparent to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-gray-800/50 border border-gray-700 rounded-full px-4 py-2 mb-8">
              <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-300">Лучший детектор мошенничества 2026</span>
              <span className="text-yellow-400 text-sm">★ 4.7/5</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Выявляйте поддельные и сгенерированные ИИ документы
              </span>{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                в реальном времени
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
              Проверяйте и распознавайте манипулированные, фальшивые или сгенерированные нейросетями PDF-документы и изображения 
              с помощью передовой системы обнаружения мошенничества на базе искусственного интеллекта.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link
                to="/upload"
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20"
              >
                Проверить сейчас
              </Link>
              <Link
                to="/how-it-works"
                className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl text-lg font-semibold text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Как это работает
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ISO 27001
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC 2
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Корпоративная безопасность
              </span>
            </div>
          </div>

          {/* Upload Area */}
          <div className="max-w-2xl mx-auto mt-16">
            <div className="bg-gray-900/80 border border-gray-700 rounded-2xl p-8 backdrop-blur-sm">
              <h2 className="text-xl font-semibold text-center mb-2">Проверка документов</h2>
              <p className="text-gray-400 text-center text-sm mb-6">
                Загрузите PDF или изображение для проверки его подлинности
              </p>
              
              <div
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
                  dragActive ? 'border-emerald-400 bg-emerald-400/5' : 'border-gray-600 hover:border-gray-500'
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  setDragActive(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    // Сохраняем файл в sessionStorage и переходим на страницу загрузки
                    sessionStorage.setItem('pending_file', 'true');
                    window.location.hash = '#/upload';
                  }
                }}
              >
                <svg className="w-12 h-12 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-400 mb-2">Перетащите файл сюда</p>
                <p className="text-gray-500 text-sm mb-4">Поддерживает PDF, PNG, JPG, JPEG (до 25МБ)</p>
                <Link
                  to="/upload"
                  className="inline-block px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-white transition-colors"
                >
                  Выбрать файл
                </Link>
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <input type="checkbox" id="terms" className="rounded border-gray-600 bg-gray-800" />
                <label htmlFor="terms" className="text-sm text-gray-400">
                  Я согласен с <Link to="/privacy" className="text-emerald-400 hover:underline">Политикой конфиденциальности</Link>
                </label>
              </div>

              <Link
                to="/upload"
                className="block w-full mt-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity text-center"
              >
                Перейти к проверке
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by */}
      <section className="py-12 bg-gray-900/50 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-8 uppercase tracking-wider">Нам доверяют ведущие компании мира</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-50">
            {['Accenture', 'Amazon', 'Boeing', 'Deloitte', 'Siemens', 'Tesla', 'Red Bull', 'PepsiCo'].map((name) => (
              <span key={name} className="text-gray-400 font-bold text-lg md:text-xl">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Продвинутая верификация документов
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Инновационная технология на базе ИИ для выявления подделок и подтверждения подлинности документов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🧠',
                title: 'ИИ-обнаружение',
                desc: 'Алгоритмы машинного обучения исследуют PDF-файлы на предмет признаков подделки, выявляя изменения, незаметные для человеческого глаза.'
              },
              {
                icon: '⚡',
                title: 'Мгновенный результат',
                desc: 'Получайте вердикт проверки менее чем за 10 секунд. Наши алгоритмы молниеносно подтверждают или опровергают подлинность.'
              },
              {
                icon: '🔒',
                title: 'Безопасная обработка',
                desc: 'Ваши документы обрабатываются в зашифрованном контуре и не сохраняются на серверах. Конфиденциальность — наш приоритет.'
              },
              {
                icon: '🏢',
                title: 'Корпоративный уровень',
                desc: 'Сертификация ISO 27001 и соответствие SOC 2 гарантируют защиту данных по самым строгим отраслевым стандартам.'
              }
            ].map((feature) => (
              <div key={feature.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scan Demo */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Уверенная проверка с продвинутым ИИ
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              DocVerify анализирует документы за считанные секунды, выявляя мошенничество с точностью, не имеющей аналогов в отрасли.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Valid Document */}
            <div className="bg-gray-900 border border-emerald-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-emerald-400 text-sm font-mono">НАДЁЖНЫЙ [CODE:AUTH_VERIFIED_926]</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">Этот документ соответствует оригиналам данного эмитента [99.8% УВЕРЕННОСТЬ]</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Совпадение в базе данных</span>
                    <span className="text-emerald-400 font-mono text-sm">99.7%</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Целостность документа</span>
                    <span className="text-emerald-400 font-mono text-sm">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Нет следов редактирования</span>
                    <span className="text-emerald-400 font-mono text-sm">97.8%</span>
                  </div>
                </div>

                <div className="mt-4 font-mono text-xs text-gray-500 space-y-1">
                  <p>&gt; Запуск финальной верификации...</p>
                  <p>&gt; Аутентификация документа: ПРОЙДЕНА</p>
                  <p>&gt; Цепочка цифровых подписей: ПОДТВЕРЖДЕНА</p>
                  <p>&gt; Оценка уверенности: 99.27%</p>
                  <p className="text-emerald-400">▶ Готов к обработке</p>
                </div>
              </div>
            </div>

            {/* Fraudulent Document */}
            <div className="bg-gray-900 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-400 text-sm font-mono">ВЫСОКИЙ РИСК [CODE:FRAUD_DETECTED_781]</span>
                </div>
                <p className="text-gray-300 text-sm mb-4">Этот документ демонстрирует признаки цифровых манипуляций [97.2% УВЕРЕННОСТЬ]</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Изменён после создания</span>
                    <span className="text-red-400 font-mono text-sm">94.3%</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Несогласованные шрифты</span>
                    <span className="text-red-400 font-mono text-sm">98.2%</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-2">
                    <span className="text-gray-400 text-sm">Следы графического редактора</span>
                    <span className="text-red-400 font-mono text-sm">99.1%</span>
                  </div>
                </div>

                <div className="mt-4 font-mono text-xs text-gray-500 space-y-1">
                  <p>&gt; Выполнение глубокого анализа...</p>
                  <p>&gt; ВНИМАНИЕ: Обнаружены аномалии в структуре</p>
                  <p>&gt; Манипуляция с документом: ОБНАРУЖЕНА</p>
                  <p>&gt; Уверенность в мошенничестве: 97.64%</p>
                  <p className="text-red-400">⚠ Рекомендуется расследование</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detection Methods */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Комплексная система обнаружения
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Многослойный подход к анализу документов для максимальной точности верификации.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'База шаблонов мошенничества',
                desc: 'Сопоставление с хранилищем из более чем 200 000 известных поддельных шаблонов, ежедневно пополняемым нашей лабораторией. Проверка по даркнету и фермам шаблонов.'
              },
              {
                title: 'Верификация целостности',
                desc: 'Сравнение с проверенными надёжными счетами, накопленными с 2003 года, формируя масштабную базу для выявления фальшивых финансовых документов.'
              },
              {
                title: 'Анализ согласованности полей',
                desc: 'Углублённое исследование шрифтов и графических элементов для выявления расхождений, свидетельствующих о вмешательстве в документ.'
              },
              {
                title: 'Проверка подписей',
                desc: 'Контроль редактирования после подписания, валидация по глобальным доверенным корням Microsoft, Mozilla, Google, Apple и базе eIDAS (ежедневное обновление).'
              },
              {
                title: 'Детекция редактирования',
                desc: 'Мощные возможности версионирования, точно показывающие, что было изменено в документе, подсвечивая даже минимальные модификации.'
              },
              {
                title: 'Обнаружение дипфейков',
                desc: 'Передовые алгоритмы для идентификации сложных дипфейк-элементов в документах, противостоящие самым изощрённым методам подделки.'
              },
              {
                title: 'Анализ ИИ-контента',
                desc: 'Специализированные алгоритмы для выявления контента, созданного нейросетями, защищающие от машинно-сгенерированных подделок.'
              },
              {
                title: 'Автоклассификация документов',
                desc: 'Интеллектуальная категоризация для оптимизации рабочих процессов верификации и применения релевантных мер безопасности.'
              },
              {
                title: 'Метаданные и структура',
                desc: 'Глубокий анализ метаданных PDF, истории изменений, встроенных скриптов и структурных аномалий для выявления скрытых манипуляций.'
              }
            ].map((method) => (
              <div key={method.title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/30 transition-colors group">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-lg flex items-center justify-center mb-4 group-hover:from-emerald-500/30 group-hover:to-blue-500/30 transition-colors">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold mb-2">{method.title}</h3>
                <p className="text-gray-400 text-sm">{method.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Простой процесс
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Проверяйте документы в три простых шага с нашей безопасной ИИ-платформой.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Загрузка',
                desc: 'Перетащите PDF или изображение, или выберите вручную. Также доступно подключение через API, Dropbox, Google Drive, Amazon S3 или Microsoft OneDrive.'
              },
              {
                step: '2',
                title: 'Анализ за секунды',
                desc: 'Система мгновенно исследует документ с помощью продвинутого ИИ. Проверяются метаданные, текстовая структура, встроенные подписи и возможные манипуляции.'
              },
              {
                step: '3',
                title: 'Результат',
                desc: 'Получите детальный отчёт о подлинности — на панели управления или через webhook. Полная прозрачность: что именно проверено и почему.'
              }
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 h-full">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl mb-6">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Попробовать сейчас
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* API Integration */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Автоматизация документооборота
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                Интегрируйте наш лаконичный API для бесшовной проверки любого PDF в вашем конвейере документов или через обработку из облачного хранилища.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Облачное хранилище', desc: 'Интеграция с Dropbox, Google Drive, OneDrive или S3 для автопроверки при загрузке.' },
                  { title: 'Автоматизация процессов', desc: 'Подключение к Zapier, Make.com, Power Automate или собственные конвейеры.' },
                  { title: 'API для разработчиков', desc: 'REST API и SDK для Node.js, Python, PHP, Java и .NET.' },
                  { title: 'Удобный DX', desc: 'Полная документация, примеры, вебхуки и готовые интеграции.' }
                ].map((item) => (
                  <div key={item.title} className="flex gap-3">
                    <div className="w-6 h-6 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 font-mono text-sm overflow-hidden">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-500 text-xs ml-2">api-integration.js</span>
              </div>
              <pre className="text-gray-300 overflow-x-auto">
                <code>{`// Простой REST API
const response = await fetch(
  'https://api.docverify.com/v1/documents', 
  {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      file: \`data:application/pdf;
        name=invoice.pdf;
        base64,\${base64PDF}\`
    })
  }
);

const result = await response.json();
console.log("Статус:", result.status);
// => "Статус: verified"`}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Нам доверяют компании по всему миру
              </span>
            </h2>
            <p className="text-gray-400 text-lg">
              Отзывы клиентов, которые полагаются на DocVerify для верификации критически важных документов.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'DocVerify спас нашу компанию от серьёзного мошенничества. Мы проверили ключевой контракт и выявили, что он был подделан. Детальный отчёт позволил точно определить внесённые изменения.',
                name: 'Анна Волкова',
                role: 'Юрист, Legix Corp.',
                initials: 'АВ'
              },
              {
                quote: 'Как риелтор, мне важна скорость проверки. ИИ от DocVerify работает невероятно быстро и точно. Обнаружил проблемы в документе на недвижимость, которые могли привести к серьёзным осложнениям при сделке.',
                name: 'Дмитрий Орлов',
                role: 'Риелтор, ДомИнвест',
                initials: 'ДО'
              },
              {
                quote: 'Корпоративный тариф стал незаменимым для нашего HR-отдела. Мы обрабатываем сотни документов о трудоустройствии еженедельно, и пакетная проверка экономит огромное количество времени.',
                name: 'Елена Козлова',
                role: 'HR-директор, TechGrowth',
                initials: 'ЕК'
              }
            ].map((review) => (
              <div key={review.name} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-6 italic">"{review.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {review.initials}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{review.name}</p>
                    <p className="text-gray-500 text-xs">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Готовы проверить ваши документы?
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Загрузите PDF или изображение и получите реальный анализ подлинности за секунды. 
            Все проверки выполняются локально в вашем браузере.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/upload"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-lg font-semibold text-white hover:opacity-90 transition-opacity shadow-lg shadow-emerald-500/20"
            >
              Проверить документ сейчас
            </Link>
            <Link
              to="/history"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl text-lg font-semibold text-gray-300 hover:bg-gray-700 transition-colors"
            >
              История проверок →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
