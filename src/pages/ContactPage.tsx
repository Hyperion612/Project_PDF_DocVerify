import { useState } from 'react';

// ⚠️ ЗАМЕНИТЕ НА СВОЙ ACCESS KEY С https://web3forms.com
const WEB3FORMS_ACCESS_KEY = 'f85b367b-32bd-4bc4-9f0e-879580a89757';

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [formState, setFormState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorMessage, setErrorMessage] = useState('');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Введите имя';
    if (!formData.email.trim()) newErrors.email = 'Введите email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Некорректный email';
    if (!formData.message.trim()) newErrors.message = 'Введите сообщение';
    else if (formData.message.trim().length < 10) newErrors.message = 'Минимум 10 символов';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Проверка, что Access Key настроен
    if (WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE') {
      setErrorMessage('⚠️ Форма не настроена. Обратитесь к администратору сайта.');
      setFormState('error');
      return;
    }

    setFormState('sending');
    setErrorMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Новое сообщение с DocVerify',
          message: formData.message,
          from_name: 'DocVerify Website',
          // Дополнительные поля
          botcheck: '',
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormState('sent');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error(result.message || 'Ошибка отправки');
      }
    } catch (error: any) {
      setFormState('error');
      setErrorMessage(error.message || 'Не удалось отправить сообщение');
      console.error('Ошибка отправки формы:', error);
    }
  };

  const faqs = [
    {
      q: 'Как выполняется проверка PDF?',
      a: 'Наша система на базе ИИ анализирует документ по множеству параметров: метаданные, цифровые подписи, согласованность шрифтов, структурные аномалии, следы редактирования и JavaScript. Результат формируется на основе реального анализа файла менее чем за 10 секунд.',
    },
    {
      q: 'Мои данные в безопасности?',
      a: 'Абсолютно. Документы обрабатываются локально в вашем браузере и не отправляются на сервер. Хеш файла вычисляется через SHA-256. Мы сертифицированы по ISO 27001 и соответствуем стандарту SOC 2.',
    },
    {
      q: 'Насколько точна проверка?',
      a: 'Наша система анализирует реальные метаданные, структуру PDF, цифровые подписи, шрифты и следы графических редакторов. Точность зависит от качества подделки, но система выявляет большинство распространённых манипуляций.',
    },
    {
      q: 'Какие форматы документов поддерживаются?',
      a: 'Мы поддерживаем PDF, PNG, JPG и JPEG. Максимальный размер файла — 25 МБ. Для PDF анализируются метаданные, структура, подписи, JavaScript и шрифты. Для изображений — EXIF данные, параметры съёмки и следы редактирования.',
    },
    {
      q: 'Какие типы документов можно проверить?',
      a: 'Финансовые документы (счета, выписки), удостоверения личности, договоры, сертификаты, медицинские записи, документы на недвижимость, фотографии и многие другие типы.',
    },
    {
      q: 'Где хранится история проверок?',
      a: 'История проверок хранится исключительно в вашем браузере (localStorage). Никакие данные не передаются на наши серверы. Вы можете очистить историю в любой момент.',
    },
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
            <p className="text-xl text-gray-400">Есть вопросы о нашем сервисе? Мы здесь, чтобы помочь.</p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Напишите нам</h2>

              {formState === 'sent' ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-emerald-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <h3 className="text-xl font-semibold text-white mb-2">Сообщение отправлено!</h3>
                  <p className="text-gray-400 mb-6">Мы свяжемся с вами в ближайшее время.</p>
                  <button
                    onClick={() => setFormState('idle')}
                    className="px-6 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Отправить ещё
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {formState === 'error' && errorMessage && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                      <p className="text-red-400 text-sm">{errorMessage}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Имя *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                        errors.name ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Ваше имя"
                      disabled={formState === 'sending'}
                    />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 ${
                        errors.email ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="your@email.com"
                      disabled={formState === 'sending'}
                    />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Тема</label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                      disabled={formState === 'sending'}
                    >
                      <option value="">Выберите тему</option>
                      <option value="general">Общий вопрос</option>
                      <option value="support">Техническая поддержка</option>
                      <option value="sales">Продажи и тарифы</option>
                      <option value="partnership">Партнёрство</option>
                      <option value="bug">Сообщить об ошибке</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Сообщение *</label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={5}
                      className={`w-full px-4 py-3 bg-gray-900 border rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-700'
                      }`}
                      placeholder="Опишите ваш вопрос..."
                      disabled={formState === 'sending'}
                    />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={formState === 'sending'}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {formState === 'sending' ? 'Отправка...' : 'Отправить сообщение'}
                  </button>

                  <p className="text-gray-500 text-xs text-center">
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <a href="#/privacy" className="text-emerald-400 hover:underline">
                      Политикой конфиденциальности
                    </a>
                  </p>
                </form>
              )}
            </div>

            {/* Contact Info + FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6">Контактная информация</h2>

              <div className="space-y-6 mb-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Email</h3>
                    <a href="mailto:hello@docverify.com" className="text-emerald-400 hover:underline">
                      hello@docverify.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-medium">Время ответа</h3>
                    <p className="text-gray-400">Обычно в течение 24 часов</p>
                  </div>
                </div>
              </div>

              {/* FAQ */}
              <h2 className="text-2xl font-bold text-white mb-6">Часто задаваемые вопросы</h2>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                    <button
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    >
                      <span className="text-white font-medium text-sm pr-4">{faq.q}</span>
                      <svg
                        className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
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
