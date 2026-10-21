import { Link } from 'react-router-dom';

export default function PrivacyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Политика конфиденциальности
              </span>
            </h1>
            <p className="text-gray-400">
              Последнее обновление: январь 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert max-w-none">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Общие положения</h2>
              <p className="text-gray-400 leading-relaxed">
                DocVerify является продуктом компании DocVerify Intelligence, Inc. 
                Мы серьёзно относимся к защите вашей конфиденциальности и обеспечиваем безопасность 
                ваших данных на каждом этапе взаимодействия с нашей платформой.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Какие данные мы собираем</h2>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Информация об аккаунте: email, имя, название компании</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Платёжная информация (обрабатывается через защищённого провайдера)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Технические данные: IP-адрес, тип браузера, журнал действий</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Загруженные документы (только на время обработки, не сохраняются)</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Как мы используем данные</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Мы используем собранные данные исключительно для:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Предоставления услуг верификации документов</li>
                <li>• Улучшения качества наших алгоритмов обнаружения</li>
                <li>•Обеспечения безопасности платформы</li>
                <li>•Коммуникации с пользователями по вопросам сервиса</li>
                <li>•Соблюдения правовых обязательств</li>
              </ul>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Безопасность данных</h2>
              <p className="text-gray-400 leading-relaxed">
                Все документы обрабатываются в зашифрованном контуре с использованием TLS 1.3. 
                После завершения анализа загруженные файлы немедленно удаляются из системы. 
                Мы сертифицированы по ISO 27001 и соответствуем стандарту SOC 2 Type II, 
                что подтверждает высочайшие стандарты защиты информации.
              </p>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mb-8">
              <h2 className="text-xl font-bold text-white mb-4">Ваши права</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Вы имеете право:
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Получить доступ к вашим персональным данным</li>
                <li>• Исправить неточные данные</li>
                <li>• Запросить удаление ваших данных</li>
                <li>• Ограничить обработку данных</li>
                <li>• Перенести данные в другой сервис</li>
                <li>• Отозвать согласие на обработку</li>
              </ul>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-xl font-bold text-white mb-4">Контакты</h2>
              <p className="text-gray-400 leading-relaxed">
                Если у вас возникли вопросы относительно нашей Политики конфиденциальности, 
                пожалуйста, свяжитесь с нами по адресу:{' '}
                <a href="mailto:hello@docverify.com" className="text-emerald-400 hover:underline">
                  hello@docverify.com
                </a>
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/about" className="text-emerald-400 hover:underline text-sm">О нас</Link>
            <span className="text-gray-600">•</span>
            <Link to="/contact" className="text-emerald-400 hover:underline text-sm">Связаться с нами</Link>
            <span className="text-gray-600">•</span>
            <Link to="/" className="text-emerald-400 hover:underline text-sm">Главная</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
