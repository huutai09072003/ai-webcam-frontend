import React, { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaEye, FaHeart, FaThumbsUp } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { DEFAULT_AVATAR } from '../../assets/defaultAvatar';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../utils/axiosInstance';

type Blogger = {
  id: number;
  name: string;
  avatar_url: string;
};

type BlogLike = {
  blogger_id: number;
};

type Blog = {
  id: number;
  title: string;
  content: string;
  view_count: number;
  likes_count: number;
  blogger: Blogger;
  blog_likes: BlogLike[];
  thumb_nail_url?: string;
  published_at: string;
};

const BlogShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const didFetch = useRef(false);
  const { user } = useAuth();

  useEffect(() => {
    if (didFetch.current) return;

    const fetchBlog = async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/blogs/${id}`);
        setBlog(response.data);
        setError(null);
        if (response.data.blog_likes && user?.id) {
          const liked = response.data.blog_likes.some((like: BlogLike) => like.blogger_id === user.id);
          setHasLiked(liked);
        }
      } catch (error: unknown) {
        console.error('Error fetching blog:', error);
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
    didFetch.current = true;
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!blog) return;

    try {
      const res = await axiosInstance.post(`/blogs/${blog.id}/like`);

      setHasLiked(res.data.liked);
      setBlog({
        ...blog,
        likes_count: res.data.likes_count
      });

      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 300);
    } catch (err) {
      console.error('Lỗi khi thích bài viết:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error || 'Bài viết không tồn tại'}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto space-y-6">
        {blog.thumb_nail_url && (
          <img
            src={blog.thumb_nail_url}
            alt={blog.title}
            className="w-full h-64 object-cover rounded-lg"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}

        <h1 className="text-3xl font-bold text-green-700">{blog.title}</h1>

        <div className="flex items-center gap-4">
          <Link to={`/bloggers/${blog.blogger.id}`}>
            <img
              src={blog.blogger.avatar_url || DEFAULT_AVATAR}
              alt={blog.blogger.name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            />
          </Link>
          <div>
            <Link
              to={`/bloggers/${blog.blogger.id}`}
              className="text-green-700 font-medium hover:underline"
            >
              {blog.blogger.name}
            </Link>
            <p className="text-sm text-gray-500">
              {new Date(blog.published_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        <div className="prose prose-lg text-gray-800">{blog.content}</div>

        <div className="flex justify-between items-center text-sm text-gray-600 pt-4 border-t">
          <span className="flex items-center gap-1">
            <FaEye /> {blog.view_count || 0} lượt xem
          </span>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <FaThumbsUp /> {blog.likes_count || 0} lượt thích
            </span>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1 px-3 py-1 text-white text-sm rounded transition transform
                ${hasLiked ? 'bg-gray-500 hover:bg-gray-600' : 'bg-pink-600 hover:bg-pink-700'}
                ${likeAnim ? 'scale-110 animate-pulse' : ''}`}
            >
              <FaHeart className={likeAnim ? 'text-red-200' : ''} />
              {hasLiked ? 'Đã thích' : 'Thích'}
            </button>
          </div>
        </div>

        <Link
          to="/blogs"
          className="mt-4 inline-flex items-center text-green-700 hover:text-green-800 font-medium"
        >
          <FaArrowLeft className="mr-1" /> Quay lại danh sách bài viết
        </Link>
      </article>

      {/* Modal yêu cầu đăng nhập */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-3">Bạn chưa đăng nhập</h2>
            <p className="text-gray-700 mb-4">
              Bạn cần đăng nhập để thích bài viết này.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                Đóng
              </button>
              <button
                onClick={() => navigate('/blogs/login')}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Đăng nhập
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogShowPage;
