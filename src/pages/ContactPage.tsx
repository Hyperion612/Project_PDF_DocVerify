import { useState } from 'react';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Как выполняется проверка PDF?',
      a: 'Наша система на базе ИИ анализирует документ по множеству параметров: метаданные, цифровые подписи, согласованность шрифтов, структурные аномалии и следы редактирования. Результат формируется менее чем за 10 секунд.'
    },
    {
      q: 'Мои данные в безопасности?',
      a: 'Абсолютно. Документы обрабатываются в зашифрованном контуре и не сохраняются на наших серверах после анализа. Мы сертифицированы по ISO 27001 и соответствуем стандарту SOC 2.'
    },
    {
      q: 'Насколько точна проверка?',
      a: 'Наша система демонстрирует точность свыше 99% при обнаружении подделок. Мы постоянно улучшаем алгоритмы, обучая их на миллионах документов из нашей базы.'
    },
    {
      q: 'Какие форматы документов поддерживаются?',
      a: 'Мы поддерживаем PDF, PNG, JPG и JPEG. Максимальный размер файла — 25 МБ. Для пакетной обработки доступны дополнительные форматы через API.'
    },
    {
      q: 'Какие типы документов можно проверить?',
      a: 'Финансовые документы (счета, выписки), удостоверения личности, договоры, сертификаты, медицинские записи, документы на недвижимость и многие другие типы.'
    },
    {
      q: 'Какие языки поддерживаются?',
      a: 'Наша платформа поддерживает документы на множестве языков, включая русский, английский, немецкий, французский, испанский, китайский и другие.'
    }
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
                Свяжитесь с нами
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Есть вопросы о нашем сервисе? Мы здесь, чтобы помочь.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Наша команда готова помочь</h2>
              <p className="text-gray-400 mb-8">
                Наша команда всегда готова ответить на ваши вопросы и оказать поддержку по всем аспектам 
                использования наших услуг верификации PDF-документов.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <p className="text-gray-400">hello@docverify.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Веб-сайт</h3>
                    <p className="text-gray-400">www.docverify.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Чат поддержки</h3>
                    <p className="text-gray-400">Доступен в рабочее время</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity">
                  Написать нам
                </button>
                <button className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 transition-colors">
                  Начать чат
                </button>
                <button className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 font-semibold hover:bg-gray-700 transition-colors">
                  Запланировать демо
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
                  >
                    <button
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span className="text-white font-medium text-sm">{faq.q}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-400 text-sm">{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
