import {
  Outlet,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useEffect, useState } from 'react';
import UnauthorizedModal from '../pages/Blog/UnauthorizeModal';
import { unauthorizedListeners } from '../utils/axiosInstance';

const BlogLayout = () => {
  const { user, signOut, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  console.log("user", user);
  

  const handleNewPostClick = () => {
    if (isLoggedIn) {
      navigate("/blogs/new");
    } else {
      navigate("/blogs/login");
    }
  };

  const handleProfileClick = () => {
    if (user?.username) {
      navigate(`/bloggers/${user.id}`);
    }
  };

  const [showUnauthorized, setShowUnauthorized] = useState(false);

  useEffect(() => {
    const showModal = () => setShowUnauthorized(true);
    unauthorizedListeners.push(showModal);

    return () => {
      const index = unauthorizedListeners.indexOf(showModal);
      if (index > -1) unauthorizedListeners.splice(index, 1);
    };
  }, []);

  return (
    <div className="pt-4 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <div
            onClick={() => navigate("/blogs")}
            className="cursor-pointer hover:opacity-80 transition-opacity"
          >
            <h1 className="text-2xl font-bold text-green-700">
              📰 Bài viết từ cộng đồng
            </h1>
          </div>
          <p className="text-sm text-gray-500">
            Cập nhật tin tức môi trường và các hoạt động xanh
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleNewPostClick}
            className="text-white bg-green-600 px-4 py-1 rounded hover:bg-green-700 text-sm"
          >
            ✍️ Viết bài
          </button>

          {isLoggedIn ? (
            <>
              <button
                onClick={handleProfileClick}
                className="text-sm font-medium text-gray-700 flex items-center gap-1 hover:underline"
              >
                <span className="text-green-500">👋</span> {user?.username}
              </button>
              <button
                onClick={signOut}
                className="text-sm px-3 py-1 text-red-500 border border-red-300 rounded-md hover:bg-red-50 transition-colors duration-200 flex items-center gap-1"
              >
                <span>🚪</span> Đăng xuất
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/blogs/login")}
                className="text-sm px-3 py-1 text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition-colors duration-200 flex items-center gap-1"
              >
                <span>🔑</span> Đăng nhập
              </button>
              <button
                onClick={() => navigate("/blogs/signup")}
                className="text-sm px-3 py-1 text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors duration-200 flex items-center gap-1"
              >
                <span>✨</span> Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
      <UnauthorizedModal
        show={showUnauthorized}
        onClose={() => setShowUnauthorized(false)}
      />
      <Outlet />
    </div>
  );
};

export default BlogLayout;
