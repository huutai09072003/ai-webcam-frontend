import './blog-show-page.scss';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  FaArrowLeft,
  FaEye,
  FaHeart,
  FaThumbsUp,
} from 'react-icons/fa';
import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { DEFAULT_AVATAR } from '../../assets/defaultAvatar';
import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';
import axiosInstance from '../../utils/axiosInstance';

type Blogger = {
  id: number;
  username: string;
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
  thumbnail_url?: string;
  published_at: string;
};

type Comment = {
  id: number;
  content: string;
  created_at: string;
  blogger: {
    id: number;
    username: string;
    avatar_url: string;
  };
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

  // Bình luận
  const [comments, setComments] = useState<Comment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  // Sửa bình luận
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  // Fetch blog
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
      } catch {
        setError('Không thể tải bài viết. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
    didFetch.current = true;
  }, [id, user?.id]);

  // Fetch comments khi có blog
  useEffect(() => {
    if (!blog) return;
    axiosInstance
      .get(`${API_BASE_URL}/blogs/${blog.id}/comments`)
      .then(res => setComments(res.data))
      .catch(() => setComments([]));
  }, [blog?.id]);

  // Like blog
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
        likes_count: res.data.likes_count,
      });
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 300);
    } catch {
      // lỗi
    }
  };

  // Gửi bình luận mới
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    if (!commentContent.trim()) return;

    setCommentLoading(true);
    setCommentError('');
    try {
      const res = await axiosInstance.post(
        `${API_BASE_URL}/blogs/${blog!.id}/comments`,
        { comment: { content: commentContent } }
      );
      setComments((prev) => [...prev, res.data]);
      setCommentContent('');
      setShowAllComments(true);
    } catch {
      setCommentError('Không thể gửi bình luận.');
    } finally {
      setCommentLoading(false);
    }
  };

  // Xoá bình luận
  const handleDeleteComment = async (commentId: number) => {
    if (!blog) return;
    if (!window.confirm("Bạn chắc chắn muốn xoá bình luận này?")) return;
    try {
      await axiosInstance.delete(`${API_BASE_URL}/blogs/${blog.id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
      if (editingCommentId === commentId) {
        setEditingCommentId(null);
        setEditContent('');
      }
    } catch {
      alert("Xoá bình luận thất bại.");
    }
  };

  // Chỉnh sửa bình luận
  const handleEditComment = (c: Comment) => {
    setEditingCommentId(c.id);
    setEditContent(c.content);
    setEditError('');
  };
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditContent('');
    setEditError('');
  };
  const handleSaveEdit = async (commentId: number) => {
    if (!editContent.trim()) {
      setEditError('Nội dung không được để trống.');
      return;
    }
    setEditLoading(true);
    setEditError('');
    try {
      const res = await axiosInstance.patch(
        `${API_BASE_URL}/blogs/${blog!.id}/comments/${commentId}`,
        { comment: { content: editContent } }
      );
      setComments(prev =>
        prev.map(c => (c.id === commentId ? res.data : c))
      );
      setEditingCommentId(null);
      setEditContent('');
    } catch {
      setEditError('Sửa bình luận thất bại.');
    } finally {
      setEditLoading(false);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }
  // Error
  if (error || !blog) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        {error || 'Bài viết không tồn tại'}
      </div>
    );
  }

  return (
    <div className="blog-show-page">
      <article className="article-card">
        {blog.thumbnail_url&& (
          <img
            src={blog.thumbnail_url}
            alt={blog.title}
            className="blog-cover"
            onError={(e) => (e.currentTarget.style.display = 'none')}
          />
        )}

        <div className="blog-title">{blog.title}</div>

        <div className="blog-author">
          <Link to={`/bloggers/${blog.blogger.id}`}>
            <img
              src={blog.blogger.avatar_url || DEFAULT_AVATAR}
              alt={blog.blogger.username}
              className="avatar"
              onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
            />
          </Link>
          <div className="author-meta">
            <Link
              to={`/bloggers/${blog.blogger.id}`}
              className="author-name hover:underline"
            >
              {blog.blogger.username}
            </Link>
            <div className="published-at">
              {new Date(blog.published_at).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        <div className="blog-content">{blog.content}</div>

        <div className="blog-meta">
          <span className="flex items-center gap-1">
            <FaEye /> {blog.view_count || 0} lượt xem
          </span>

          <div className="likes-box">
            <span className="flex items-center gap-1">
              <FaThumbsUp /> {blog.likes_count || 0} lượt thích
            </span>

            <button
              onClick={handleLike}
              className={`like-btn ${hasLiked ? 'liked' : ''} ${likeAnim ? 'like-anim' : ''}`}
            >
              <FaHeart />
              {hasLiked ? 'Đã thích' : 'Thích'}
            </button>
          </div>
        </div>
      </article>

      {/* BÌNH LUẬN */}
      <section className="comment-section">
        <h2>Bình luận</h2>
        <form onSubmit={handlePostComment} className="comment-form">
          <textarea
            rows={3}
            placeholder={user ? "Nhập bình luận của bạn..." : "Bạn cần đăng nhập để bình luận"}
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            disabled={!user || commentLoading}
          />
          {commentError && <div className="error-message">{commentError}</div>}
          <div className="form-actions">
            <button
              type="submit"
              disabled={!user || commentLoading || !commentContent.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {commentLoading ? "Đang gửi..." : "Gửi bình luận"}
            </button>
          </div>
        </form>
        <div className="comment-list">
          {comments.length === 0 && <div className="text-gray-500">Chưa có bình luận nào.</div>}
          {(showAllComments ? comments : comments.slice(0, 3)).map((c) => (
            <div key={c.id} className="comment-item">
              <img
                src={c.blogger.avatar_url || DEFAULT_AVATAR}
                alt={c.blogger.username}
                className="comment-avatar"
                onError={e => (e.currentTarget.src = DEFAULT_AVATAR)}
              />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="commenter-name">{c.blogger.username}</span>
                  <span className="comment-date">
                    {new Date(c.created_at).toLocaleString("vi-VN")}
                  </span>
                  {user?.id === c.blogger.id && editingCommentId !== c.id && (
                    <>
                      <button
                        onClick={() => handleEditComment(c)}
                        className="edit-btn"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c.id)}
                        className="delete-btn"
                      >
                        Xóa
                      </button>
                    </>
                  )}
                </div>
                {/* Nếu đang chỉnh sửa bình luận này */}
                {editingCommentId === c.id ? (
                  <form
                    className="edit-form"
                    onSubmit={e => {
                      e.preventDefault();
                      handleSaveEdit(c.id);
                    }}
                  >
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      disabled={editLoading}
                    />
                    {editError && <div className="edit-error">{editError}</div>}
                    <div className="edit-actions">
                      <button
                        type="submit"
                        className="save"
                        disabled={editLoading}
                      >
                        {editLoading ? "Đang lưu..." : "Lưu"}
                      </button>
                      <button
                        type="button"
                        className="cancel"
                        onClick={handleCancelEdit}
                        disabled={editLoading}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="comment-content">{c.content}</div>
                )}
              </div>
            </div>
          ))}
          {(comments.length > 3 && !showAllComments) && (
            <button
              className="view-all-btn"
              onClick={() => setShowAllComments(true)}
            >
              Xem tất cả bình luận ({comments.length})
            </button>
          )}
          {(showAllComments && comments.length > 3) && (
            <button
              className="collapse-btn"
              onClick={() => setShowAllComments(false)}
            >
              Thu gọn
            </button>
          )}
        </div>
      </section>

      <Link
        to="/blogs"
        className="back-link"
      >
        <FaArrowLeft className="mr-1" /> Quay lại danh sách bài viết
      </Link>

      {/* Modal yêu cầu đăng nhập */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-red-600 mb-3">Bạn chưa đăng nhập</h2>
            <p className="text-gray-700 mb-4">
              Bạn cần đăng nhập để thao tác với bài viết này.
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
