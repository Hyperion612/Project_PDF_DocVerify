import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                О DocVerify
              </span>
            </h1>
            <p className="text-xl text-gray-400">
              Наша миссия — предоставить самый надёжный сервис верификации подлинности документов.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Наша история</h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                DocVerify был основан в 2023 году командой специалистов по кибербезопасности и экспертов в области 
                документной форензики. Столкнувшись с нарастающей угрозой мошенничества с документами, мы приняли 
                решение создать доступное решение для каждого.
              </p>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Сегодня наша платформа применяет передовой искусственный интеллект для выявления самых изощрённых 
                подделок. Нам доверяют частные лица, коммерческие организации и государственные учреждения по всему миру.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6 text-white">Наша технология</h2>
              <p className="text-gray-400 mb-4 leading-relaxed">
                Наш верификационный движок на базе ИИ задействует множество методов обнаружения для тщательного 
                анализа PDF-файлов на предмет вмешательства или подделки. Система изучает метаданные документа, 
                цифровые подписи, согласованность содержимого и прочие форензические маркеры.
              </p>
              <p className="text-gray-400 leading-relaxed">
                Мы непрерывно совершенствуем алгоритмы через машинное обучение, обучая систему на миллионах 
                документов для достижения максимальной точности в выявлении мошенничества.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Commitments */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold mb-10 text-center text-white">Наши принципы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Точность',
                desc: 'Предоставляем максимально точную верификацию документов на рынке.'
              },
              {
                icon: '🛡️',
                title: 'Безопасность',
                desc: 'Гарантируем конфиденциальность и защиту ваших документов на каждом этапе.'
              },
              {
                icon: '✨',
                title: 'Доступность',
                desc: 'Делаем проверку документов простой и удобной для каждого пользователя.'
              },
              {
                icon: '🔄',
                desc: 'Непрерывно развиваем технологию, опережая новые методы мошенничества.',
                title: 'Инновации'
              }
            ].map((item) => (
              <div key={item.title} className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
                <span className="text-4xl mb-4 block">{item.icon}</span>
                <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '200K+', label: 'Шаблонов в базе' },
              { value: '99.7%', label: 'Точность обнаружения' },
              { value: '<10с', label: 'Время проверки' },
              { value: '5000+', label: 'Корпоративных клиентов' }
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold mb-4 text-white">Есть вопросы о нашем сервисе?</h2>
          <p className="text-gray-400 mb-8">Мы будем рады услышать вас и помочь разобраться во всех возможностях платформы.</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white font-semibold hover:opacity-90 transition-opacity"
          >
            Связаться с нами →
          </Link>
        </div>
      </section>
    </div>
  );
}
