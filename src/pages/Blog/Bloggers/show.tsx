import React, {
  useEffect,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { DEFAULT_AVATAR } from '../../../assets/defaultAvatar';
import { useAuth } from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axiosInstance';

interface Blog {
  id: number;
  title: string;
  status: string;
  created_at: string;
  thumbnail_url?: string;
}

interface Blogger {
  id: number;
  username: string;
  email: string;
  avatar_url?: string;
  blogs?: Blog[];
}

const BloggerShow: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const message = location.state?.message;

  const [blogger, setBlogger] = useState<Blogger | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogger = async () => {
      try {
        const res = await axiosInstance.get(`/bloggers/${id}`);
        setBlogger(res.data);
      } catch (err: unknown) {
        const error = err as { response?: { status: number } };
        if (error.response?.status === 401) {
          setUnauthorized(true);
        } else {
          console.error('Lỗi khi tải thông tin blogger:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBlogger();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-md p-6 mt-10 border border-red-200 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-3">⚠ Bạn cần đăng nhập</h2>
        <p className="text-gray-700 mb-4">
          Vui lòng đăng nhập để xem thông tin người dùng.
        </p>
        <button
          onClick={() => navigate('/blogs/login')}
          className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Đăng nhập ngay
        </button>
      </div>
    );
  }

  if (!blogger) {
    return (
      <div className="text-center text-gray-600 mt-10">
        Không tìm thấy thông tin blogger.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 mt-10">
      {message && (
        <div className="p-3 bg-yellow-50 border border-yellow-300 text-yellow-800 rounded">
          {message}
        </div>
      )}

      <div className="bg-white border p-6 rounded-lg shadow-md space-y-5">
        <div className="flex flex-col items-center gap-3">
          <img
            src={blogger.avatar_url || DEFAULT_AVATAR}
            alt={blogger.username}
            className="w-24 h-24 rounded-full object-cover border border-gray-200 shadow-sm"
            onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
          />
          <h2 className="text-2xl font-semibold text-green-700">👤 {blogger.username}</h2>
          <p className="text-gray-700">{blogger.email}</p>
        </div>
        {user?.id === blogger.id && (
          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate(`/bloggers/${id}/activity`)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              📘 Xem nhật ký hoạt động
            </button>

            <button
              onClick={() => navigate(`/bloggers/${id}/edit`)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              ✏️ Chỉnh sửa thông tin
            </button>
          </div>
        )}
      </div>

      {/* Blog list */}
      <div className="bg-white border rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          📝 Danh sách Blog đã viết ({blogger.blogs?.length || 0})
        </h3>
        {blogger.blogs && blogger.blogs.length > 0 ? (
          <ul className="space-y-3">
            {blogger.blogs.map((blog) => (
            <li
              key={blog.id}
              onClick={() => navigate(`/blogs/${blog.id}`)}
              className="flex gap-4 items-start border p-4 rounded-lg hover:shadow-md transition cursor-pointer"
            >
              <img
                src={blog.thumbnail_url || DEFAULT_AVATAR}
                alt={blog.title}
                className="w-20 h-20 object-cover rounded border"
                onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
              />
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="text-green-800 font-semibold">{blog.title}</h4>
                  <span className="text-sm text-gray-500 italic">{blog.status}</span>
                </div>
                <p className="text-xs text-gray-500">🕒 {new Date(blog.created_at).toLocaleString()}</p>
              </div>
            </li>
          ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 italic">Chưa có blog nào được viết.</p>
        )}
      </div>
    </div>
  );
};

export default BloggerShow;
