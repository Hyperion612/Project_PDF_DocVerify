import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                DocVerify
              </span>
            </Link>
            <p className="text-gray-400 text-sm max-w-md">
              Передовая платформа обнаружения мошенничества с документами на базе искусственного интеллекта. 
              Реальный анализ метаданных, структуры, подписей и следов редактирования.
            </p>
            <div className="flex items-center gap-4 mt-4">
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                ISO 27001
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                SOC 2
              </span>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">Главная</Link></li>
              <li><Link to="/upload" className="text-gray-400 hover:text-white text-sm transition-colors">Проверить документ</Link></li>
              <li><Link to="/history" className="text-gray-400 hover:text-white text-sm transition-colors">История проверок</Link></li>
              <li><Link to="/how-it-works" className="text-gray-400 hover:text-white text-sm transition-colors">Как это работает</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Цены</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white text-sm transition-colors">О нас</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Контакты</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Правовая информация</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Политика конфиденциальности</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Связаться с нами</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2026 DocVerify. Все права защищены.
          </p>
        </div>
      </div>
    </footer>
  );
}
