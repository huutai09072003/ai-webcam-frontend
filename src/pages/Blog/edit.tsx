import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../utils/axiosInstance';

const BlogEditModal: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axiosInstance.get(`/blogs/${id}`);
        const blog = res.data;

        if (user?.id !== blog.blogger.id) {
          navigate(`/blogs/${id}`, { replace: true });
          return;
        }

        setTitle(blog.title || '');
        setContent(blog.content || '');
      } catch {
        setError('❌ Không thể tải bài viết.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axiosInstance.patch(`/blogs/${id}`, {
        blog: { title, content },
      });

      navigate(`/blogs/${id}`, {
        state: { message: '✅ Bài viết đã được cập nhật thành công.' },
      });
    } catch {
      setError('❌ Cập nhật bài viết thất bại.');
    }
  };

  const handleClose = () => navigate(`/blogs/${id}`);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="text-white text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl p-6 rounded shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold text-green-700 mb-4">✏️ Chỉnh sửa bài viết</h2>

        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-1">Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Nội dung</label>
            <textarea
              rows={10}
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full border px-3 py-2 rounded resize-none"
            />
          </div>

          <div className="text-right">
            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
            >
              💾 Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditModal;
