import { useEffect } from 'react';

import {
  Outlet,
  useLocation,
} from 'react-router-dom';

import Footer from './Footer';
import Header from './Header';

const MainLayout = () => {
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
