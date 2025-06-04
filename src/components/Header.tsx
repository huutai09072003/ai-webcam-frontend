import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  FaBars,
  FaBook,
  FaHeart,
  FaNewspaper,
  FaRobot,
  FaUserPlus,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [openMenu, setOpenMenu] = useState<null | string>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenMenu(null);
  };

  return (
    <header className="bg-gradient-to-r from-green-50 to-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
          <span className="text-3xl">♻</span> WasteAI
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8 relative" ref={dropdownRef}>
          <div className="relative group">
            <button className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-2 transition-colors duration-200">
              <FaBook /> Học & Tra cứu
            </button>
            <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-48 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link to="/global" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Tham khảo biểu đồ
              </Link>
              <Link to="/recyclepedia" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Tra cứu rác
              </Link>
            </div>
          </div>

          <div className="relative group">
            <button className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-2 transition-colors duration-200">
              <FaNewspaper /> Tin & Hoạt động
            </button>
            <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-48 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link to="/blogs" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Bài viết
              </Link>
              <Link to="/campaigns" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Chiến dịch
              </Link>
            </div>
          </div>

          <div className="relative group">
            <button className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-2 transition-colors duration-200">
              <FaRobot /> Công nghệ AI
            </button>
            <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-56 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
              <Link to="/ai-demo/games" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Game AI
              </Link>
              <Link to="/ai-demo/camera" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Camera Realtime
              </Link>
              <Link to="/ai-demo/application" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Ứng dụng của AI
              </Link>
              <Link to="/ai-demo/about" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                Về AI
              </Link>
            </div>
          </div>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/subscribers"
            className="text-sm text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
          >
            <FaUserPlus /> Đăng ký thành viên
          </Link>
          <Link
            to="/donate/new"
            className="text-sm text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200 flex items-center gap-2"
          >
            <FaHeart /> Ủng hộ
          </Link>
        </div>

        <button
          className="md:hidden text-gray-700 hover:text-green-600"
          onClick={toggleMobileMenu}
        >
          <FaBars size={24} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="md:hidden bg-white shadow-lg px-4 py-4 animate-slideIn">
          <div className="flex flex-col space-y-2">
            <div>
              <button
                className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-2 w-full text-left"
                onClick={() => setOpenMenu(openMenu === 'learn' ? null : 'learn')}
              >
                <FaBook /> Học & Tra cứu
              </button>
              {openMenu === 'learn' && (
                <div className="pl-4 mt-2 space-y-2 animate-fadeIn">
                  <Link to="/global" className="block px-4 py-2 hover:bg-green-50">
                    Tham khảo biểu đồ
                  </Link>
                  <Link to="/recyclepedia" className="block px-4 py-2 hover:bg-green-50">
                    Tra cứu rác
                  </Link>
                </div>
              )}
            </div>

            <div>
              <button
                className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-2 w-full text-left"
                onClick={() => setOpenMenu(openMenu === 'news' ? null : 'news')}
              >
                <FaNewspaper /> Tin & Hoạt động
              </button>
              {openMenu === 'news' && (
                <div className="pl-4 mt-2 space-y-2 animate-fadeIn">
                  <Link to="/blogs" className="block px-4 py-2 hover:bg-green-50">
                    Bài viết
                  </Link>
                  <Link to="/campaigns" className="block px-4 py-2 hover:bg-green-50">
                    Chiến dịch
                  </Link>
                </div>
              )}
            </div>

            <div>
              <button
                className="text-gray-700 hover:text-green-600 font-medium flex items-center gap-2 w-full text-left"
                onClick={() => setOpenMenu(openMenu === 'tech' ? null : 'tech')}
              >
                <FaRobot /> Công nghệ AI
              </button>
              {openMenu === 'tech' && (
                <div className="absolute bg-white shadow-lg rounded-lg mt-2 w-56 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/ai-demo/games" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                    Game AI
                  </Link>
                  <Link to="/ai-demo/camera" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                    Camera Realtime
                  </Link>
                  <Link to="/ai-demo/application" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                    Ứng dụng của AI
                  </Link>
                  <Link to="/ai-demo/about" className="block px-4 py-2 hover:bg-green-50 transition-colors duration-200">
                    Về AI
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/subscribers"
              className="text-sm text-white bg-green-600 px-4 py-2 rounded-full hover:bg-green-700 flex items-center gap-2"
            >
              <FaUserPlus /> Đăng ký thành viên
            </Link>
            <Link
              to="/donate"
              className="text-sm text-white bg-red-500 px-4 py-2 rounded-full hover:bg-red-600 flex items-center gap-2"
            >
              <FaHeart /> Ủng hộ
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;