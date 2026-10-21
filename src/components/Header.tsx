import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Главная' },
    { to: '/upload', label: 'Проверить' },
    { to: '/history', label: 'История' },
    { to: '/how-it-works', label: 'Как это работает' },
    { to: '/pricing', label: 'Цены' },
    { to: '/about', label: 'О нас' },
    { to: '/contact', label: 'Контакты' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
              DocVerify
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'text-emerald-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/upload"
              className="ml-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-sm font-semibold text-white hover:opacity-90 transition-opacity"
            >
              Загрузить файл
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 text-gray-300"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden pb-4 border-t border-gray-800 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block py-2 text-sm font-medium ${
                  isActive(link.to) ? 'text-emerald-400' : 'text-gray-300'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/upload"
              onClick={() => setMobileOpen(false)}
              className="block mt-3 px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-sm font-semibold text-white text-center"
            >
              Загрузить файл
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
