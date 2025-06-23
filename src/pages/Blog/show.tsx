import './blog-show-page.scss';

import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  FaArrowLeft,
  FaBookmark,
  FaEllipsisV,
  FaEye,
  FaHeart,
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
  const { user } = useAuth();

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [likeAnim, setLikeAnim] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const didFetch = useRef(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [showAllComments, setShowAllComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentError, setCommentError] = useState('');

  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (didFetch.current) return;
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/blogs/${id}`);
        setBlog(response.data);
        if (response.data.blog_likes && user?.id) {
          setHasLiked(response.data.blog_likes.some((like: BlogLike) => like.blogger_id === user.id));
        }
      } catch {
        setError('Không thể tải bài viết.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
    didFetch.current = true;
  }, [id, user?.id]);

  useEffect(() => {
    if (!blog) return;
    axiosInstance
      .get(`${API_BASE_URL}/blogs/${blog.id}/comments`)
      .then(res => setComments(res.data))
      .catch(() => setComments([]));
  }, [blog?.id]);

  const handleLike = async () => {
    if (!user) return setShowLoginModal(true);
    if (!blog) return;
    try {
      const res = await axiosInstance.post(`/blogs/${blog.id}/like`);
      setHasLiked(res.data.liked);
      setBlog({ ...blog, likes_count: res.data.likes_count });
      setLikeAnim(true);
      setTimeout(() => setLikeAnim(false), 300);
    } catch {
      setError('Không thể thích bài viết.');
    }
  };

  const handleSave = async () => {
    if (!user) return setShowLoginModal(true);
    if (!blog) return;

    try {
      const res = await axiosInstance.post(`/blogs/${blog.id}/save`);
      setHasSaved(res.data.saved);
    } catch {
      setError('Không thể lưu bài viết.');
    } finally {
      setShowMenu(false);
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setShowLoginModal(true);
    if (!commentContent.trim()) return;

    setCommentLoading(true);
    try {
      const res = await axiosInstance.post(`${API_BASE_URL}/blogs/${blog!.id}/comments`, { comment: { content: commentContent } });
      setComments(prev => [...prev, res.data]);
      setCommentContent('');
      setShowAllComments(true);
    } catch {
      setCommentError('Không thể gửi bình luận.');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!blog || !window.confirm("Xoá bình luận?")) return;
    try {
      await axiosInstance.delete(`${API_BASE_URL}/blogs/${blog.id}/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch {
      alert("Xoá thất bại.");
    }
  };

  const handleEditComment = (c: Comment) => {
    setEditingCommentId(c.id);
    setEditContent(c.content);
  };

  const handleSaveEdit = async (commentId: number) => {
    if (!editContent.trim()) return setEditError('Không được trống');
    setEditLoading(true);
    try {
      const res = await axiosInstance.patch(`${API_BASE_URL}/blogs/${blog!.id}/comments/${commentId}`, { comment: { content: editContent } });
      setComments(prev => prev.map(c => (c.id === commentId ? res.data : c)));
      setEditingCommentId(null);
    } catch {
      setEditError('Lỗi khi lưu.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blog) return;
    try {
      await axiosInstance.delete(`/blogs/${blog.id}`);
      navigate('/blogs', { state: { message: 'Đã xoá bài viết.' } });
    } catch {
      alert('Xoá bài viết thất bại.');
    }
  };

  if (isLoading) return <div className="text-center py-10">Đang tải...</div>;
  if (error || !blog) return <div className="text-center py-10 text-red-600">{error || 'Không tìm thấy.'}</div>;

  return (
    <div className="blog-container">
      <div className="blog-card">
        {user?.id === blog.blogger.id && (
          <div className="menu-container">
            <button onClick={() => setShowMenu(!showMenu)} className="menu-btn">
              <FaEllipsisV />
            </button>
            {showMenu && (
              <div className="menu-dropdown">
                <button onClick={() => navigate(`/blogs/${blog.id}/edit`)} className="menu-item">
                  ✏️ Chỉnh sửa
                </button>
                <button onClick={() => setShowDeleteModal(true)} className="menu-item delete">
                  🗑️ Xoá bài viết
                </button>
              </div>
            )}
          </div>
        )}

        {blog.thumbnail_url && (
          <img src={blog.thumbnail_url} alt={blog.title} className="blog-image" />
        )}

        <div className="blog-header">
          <h1 className="blog-title">{blog.title}</h1>
          <div className="blog-meta">
            <div className="author-info">
              <img src={blog.blogger.avatar_url || DEFAULT_AVATAR} alt="Avatar" className="author-avatar" />
              <div>
                <Link to={`/bloggers/${blog.blogger.id}`} className="author-name">{blog.blogger.username}</Link>
                <span className="publish-date">{new Date(blog.published_at).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
            <div className="interaction-stats">
              <span><FaEye /> {blog.view_count} lượt xem</span>
              <span><FaHeart /> {blog.likes_count} thích</span>
            </div>
          </div>
        </div>

        <div className="blog-content" dangerouslySetInnerHTML={{ __html: blog.content }} />

        <div className="action-buttons">
          <button
            onClick={handleLike}
            className={`action-btn like-btn ${hasLiked ? 'liked' : ''} ${likeAnim ? 'like-anim' : ''}`}
          >
            <FaHeart /> {hasLiked ? 'Đã thích' : 'Thích'}
          </button>
          <button
            onClick={handleSave}
            className={`action-btn save-btn ${hasSaved ? 'saved' : ''}`}
          >
            <FaBookmark /> {hasSaved ? 'Đã lưu' : 'Lưu'}
          </button>
        </div>
      </div>

      <section className="comment-section">
        <h2>Bình luận</h2>
        <form onSubmit={handlePostComment} className="comment-form">
          <textarea
            placeholder={user ? 'Viết bình luận...' : 'Đăng nhập để bình luận'}
            value={commentContent}
            onChange={e => setCommentContent(e.target.value)}
            disabled={!user || commentLoading}
          />
          {commentError && <div className="error-message">{commentError}</div>}
          <button type="submit" disabled={!user || commentLoading || !commentContent.trim()} className="submit-btn">
            Gửi
          </button>
        </form>

        <div className="comment-list">
          {comments.length === 0 && <p className="no-comments">Chưa có bình luận.</p>}
          {(showAllComments ? comments : comments.slice(0, 3)).map(c => (
            <div key={c.id} className="comment-item">
              <img src={c.blogger.avatar_url || DEFAULT_AVATAR} alt="Avatar" className="comment-avatar" />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="commenter-name">{c.blogger.username}</span>
                  <span className="comment-date">{new Date(c.created_at).toLocaleString('vi-VN')}</span>
                  {user?.id === c.blogger.id && (
                    <div className="comment-actions">
                      <button onClick={() => handleEditComment(c)} className="edit-btn">Sửa</button>
                      <button onClick={() => handleDeleteComment(c.id)} className="delete-btn">Xoá</button>
                    </div>
                  )}
                </div>
                {editingCommentId === c.id ? (
                  <form onSubmit={e => { e.preventDefault(); handleSaveEdit(c.id); }} className="edit-form">
                    <textarea
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      disabled={editLoading}
                    />
                    {editError && <div className="edit-error">{editError}</div>}
                    <div className="edit-actions">
                      <button type="submit" className="save-btn" disabled={editLoading}>Lưu</button>
                      <button type="button" className="cancel-btn" onClick={() => setEditingCommentId(null)}>Huỷ</button>
                    </div>
                  </form>
                ) : (
                  <p className="comment-content">{c.content}</p>
                )}
              </div>
            </div>
          ))}
          {comments.length > 3 && (
            <button
              onClick={() => setShowAllComments(!showAllComments)}
              className="view-toggle-btn"
            >
              {showAllComments ? 'Thu gọn' : `Xem tất cả (${comments.length})`}
            </button>
          )}
        </div>
      </section>

      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Cần đăng nhập</h2>
            <p>Bạn cần đăng nhập để thực hiện hành động này.</p>
            <div className="modal-actions">
              <button onClick={() => setShowLoginModal(false)}>Huỷ</button>
              <button onClick={() => navigate('/blogs/login')}>Đăng nhập</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Xác nhận xoá</h2>
            <p>Bạn có chắc muốn xoá bài viết này không?</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)}>Huỷ</button>
              <button onClick={handleDeleteBlog} className="delete">Xoá ngay</button>
            </div>
          </div>
        </div>
      )}

      <Link to="/blogs" className="back-link">
        <FaArrowLeft /> Quay lại danh sách
      </Link>
    </div>
  );
};

export default BlogShowPage;