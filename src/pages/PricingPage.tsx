import { Link } from 'react-router-dom';

export default function PricingPage() {
  const plans = [
    {
      name: 'Базовый',
      price: '$0.79',
      per: '/проверка',
      minimum: '$99',
      minLabel: 'минимум в месяц',
      desc: 'Базовая верификация для ограниченных объёмов. Оптимально для организаций с менее чем 200 ежемесячными проверками.',
      features: [
        'Детекция известных шаблонов подделки',
        'Анализ согласованности полей',
        'Верификация подлинности и целостности',
        'Обнаружение отредактированных документов',
        'API доступ',
        'Базовая поддержка'
      ],
      recommended: false
    },
    {
      name: 'Соответствие',
      price: '$0.45',
      per: '/проверка',
      minimum: '$299',
      minLabel: 'минимум в месяц',
      desc: 'Для бизнеса с регулярными потребностями в проверке. Идеально для организаций с 200–3 000 ежемесячными проверками.',
      features: [
        'Детекция известных шаблонов подделки',
        'Анализ согласованности полей',
        'Верификация подлинности и целостности',
        'Обнаружение отредактированных документов',
        'API доступ',
        'Приоритетная поддержка'
      ],
      recommended: false
    },
    {
      name: 'Форензик',
      price: '$0.25',
      per: '/проверка',
      minimum: '$599',
      minLabel: 'минимум в месяц',
      desc: 'Для организаций с большими объёмами проверок. Оптимально для компаний с более чем 3 000 ежемесячными проверками.',
      features: [
        'Детекция известных шаблонов подделки',
        'Анализ согласованности полей',
        'Верификация подлинности и целостности',
        'Обнаружение отредактированных документов',
        'API доступ',
        'Выделенная поддержка'
      ],
      recommended: true
    },
    {
      name: 'Корпоративный',
      price: 'Индивидуально',
      per: '',
      minimum: 'Индивидуально',
      minLabel: 'минимум в месяц',
      desc: 'Для организаций с высокими объёмами и особыми требованиями к безопасности и интеграции.',
      features: [
        'Детекция известных шаблонов подделки',
        'Анализ согласованности полей',
        'Верификация подлинности и целостности',
        'Обнаружение отредактированных документов',
        'API доступ',
        'Выделенная поддержка',
        'Все расширенные функции'
      ],
      recommended: false
    }
  ];

  const addons = [
    { title: 'Расширенное обнаружение дипфейков', desc: 'Доступно со всеми планами' },
    { title: 'Анализ ИИ-сгенерированного контента', desc: 'Доступно со всеми планами' },
    { title: 'Автоклассификация документов', desc: 'Доступно со всеми планами' }
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Прозрачное ценообразование
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Выберите тариф, соответствующий вашим потребностям в верификации документов
            </p>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-gray-900 border rounded-2xl p-6 flex flex-col ${
                  plan.recommended
                    ? 'border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'border-gray-800'
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-full text-xs font-semibold text-white">
                      РЕКОМЕНДУЕМ
                    </span>
                  </div>
                )}
                
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 text-sm">{plan.per}</span>
                </div>
                <p className="text-gray-500 text-xs mb-4">{plan.minimum} {plan.minLabel}</p>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/contact"
                  className={`block text-center py-3 rounded-xl font-semibold transition-colors ${
                    plan.recommended
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-600 text-white hover:opacity-90'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {plan.name === 'Корпоративный' ? 'Связаться с нами' : 'Начать'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Addons */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Дополнительные возможности</h2>
          <p className="text-gray-400 text-center mb-10">Улучшите вашу верификацию с помощью расширенных сервисов, доступных для всех тарифов</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {addons.map((addon) => (
              <div key={addon.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-emerald-400 text-sm font-medium">Включено</span>
                </div>
                <h3 className="text-white font-semibold mb-1">{addon.title}</h3>
                <p className="text-gray-500 text-sm">{addon.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom CTA */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Нужно индивидуальное решение?</h2>
          <p className="text-gray-400 mb-8">
            Свяжитесь с нашей командой для обсуждения ваших требований. Мы предлагаем скидки на объём, 
            индивидуальные интеграции и специализированные решения для вашего бизнеса.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Связаться с отделом продаж →
          </Link>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Готовы защитить свой бизнес?</h2>
          <p className="text-gray-400 mb-8">Начните проверять документы уже сегодня с нашим обнаружением мошенничества на базе ИИ.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/"
              className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
            >
              Начать бесплатный период
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 transition-colors"
            >
              Связаться с отделом продаж →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
