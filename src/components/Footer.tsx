import './index.scss';

import React from 'react';

import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-50 text-gray-800 py-8 border-t border-green-100 mt-10">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center space-y-4 md:space-y-0 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm font-medium">
            © {new Date().getFullYear()} <span className="text-green-700 font-semibold">WasteAI</span>. Vì một tương lai xanh 🌱
          </p>
          <p className="mt-2 text-sm">
            Designed with ❤️ | Inspired by{' '}
            <a
              href="https://recycleye.com"
              target="_blank"
              rel="noreferrer"
              className="text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              Recycleye
            </a>{' '}
            &{' '}
            <a
              href="https://recyclopedia.sg"
              target="_blank"
              rel="noreferrer"
              className="text-green-600 hover:text-green-700 transition-colors duration-200"
            >
              Recyclopedia.sg
            </a>
          </p>
        </div>
        <Link
          to="/donates"
          className="inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
        >
          Xem danh sách người ủng hộ
        </Link>
      </div>
    </footer>
  );
};

export default Footer;