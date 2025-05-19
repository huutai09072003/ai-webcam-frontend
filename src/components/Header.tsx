import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { RootState } from '../store';
import { logout } from '../store/authSlice';

const Header = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState<null | string>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center relative">
        <Link to="/" className="text-2xl font-bold text-green-600">
          ♻ WasteAI
        </Link>

        <nav className="hidden md:flex space-x-6 relative" ref={dropdownRef}>
          <div className="relative">
            <button
              className="text-gray-700 hover:text-green-600 font-medium"
              onClick={() =>
                setOpenMenu(openMenu === "learn" ? null : "learn")
              }
            >
              Học & Tra cứu
            </button>
            {openMenu === "learn" && (
              <div className="absolute bg-white shadow rounded mt-2 w-48 z-20">
                <Link to="/study" className="block px-4 py-2 hover:bg-green-50">
                  Kiến thức môi trường
                </Link>
                <Link
                  to="/recyclepedia"
                  className="block px-4 py-2 hover:bg-green-50"
                >
                  Tra cứu rác
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="text-gray-700 hover:text-green-600 font-medium"
              onClick={() =>
                setOpenMenu(openMenu === "news" ? null : "news")
              }
            >
              Tin & Hoạt động
            </button>
            {openMenu === "news" && (
              <div className="absolute bg-white shadow rounded mt-2 w-48 z-20">
                <Link to="/news" className="block px-4 py-2 hover:bg-green-50">
                  Tin tức
                </Link>
                <Link to="/blogs" className="block px-4 py-2 hover:bg-green-50">
                  Chiến dịch & Bài viết
                </Link>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              className="text-gray-700 hover:text-green-600 font-medium"
              onClick={() =>
                setOpenMenu(openMenu === "tech" ? null : "tech")
              }
            >
              Công nghệ AI
            </button>
            {openMenu === "tech" && (
              <div className="absolute bg-white shadow rounded mt-2 w-56 z-20">
                <Link to="/ai-demo" className="block px-4 py-2 hover:bg-green-50">
                  AI Demo
                </Link>
                <Link
                  to="/tech/ai-model"
                  className="block px-4 py-2 hover:bg-green-50"
                >
                  AI Model
                </Link>
                <Link
                  to="/tech/edge-ai"
                  className="block px-4 py-2 hover:bg-green-50"
                >
                  Edge AI & IoT
                </Link>
                <Link
                  to="/tech/dataset"
                  className="block px-4 py-2 hover:bg-green-50"
                >
                  Dataset & Training
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="space-x-3 hidden md:flex items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-700">👋 {user.username}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-green-600"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="text-sm text-white bg-green-600 px-3 py-1 rounded hover:bg-green-700"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
