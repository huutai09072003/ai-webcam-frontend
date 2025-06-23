import React, {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import { useAuth } from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axiosInstance';

interface Blog {
  id: number;
  title: string;
  thumbnail_url?: string;
}

const BloggerActivity: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [likedBlogs, setLikedBlogs] = useState<Blog[]>([]);
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([]);
  const [commentedBlogs, setCommentedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.id.toString() !== id) {
      navigate('/blogs', { replace: true });
      return;
    }

    const fetchActivity = async () => {
      try {
        const [likes, saves, comments] = await Promise.all([
          axiosInstance.get(`/bloggers/${id}/liked_blogs`),
          axiosInstance.get(`/bloggers/${id}/saved_blogs`),
          axiosInstance.get(`/bloggers/${id}/commented_blogs`),
        ]);
        setLikedBlogs(likes.data);
        setSavedBlogs(saves.data);
        setCommentedBlogs(comments.data);
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [id, user, navigate]);

  const renderBlogList = (blogs: Blog[]) => (
    blogs.length === 0 ? (
      <p className="italic text-gray-500">Không có dữ liệu</p>
    ) : (
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.map(blog => (
          <li
            key={blog.id}
            onClick={() => navigate(`/blogs/${blog.id}`)}
            className="border rounded p-4 hover:shadow cursor-pointer flex items-start gap-4"
          >
            <img
              src={blog.thumbnail_url}
              alt={blog.title}
              className="w-20 h-20 object-cover border rounded"
              onError={(e) => (e.currentTarget.style.display = 'none')}
            />
            <div className="flex-1">
              <h4 className="text-green-800 font-semibold">{blog.title}</h4>
            </div>
          </li>
        ))}
      </ul>
    )
  );

  if (loading) {
    return <div className="text-center mt-20">Đang tải nhật ký hoạt động...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto mt-10 space-y-10">
      <h1 className="text-2xl font-bold text-green-700 text-center">📖 Nhật ký hoạt động</h1>

      <section>
        <h2 className="text-lg font-semibold mb-3">❤️ Bài viết đã thích</h2>
        {renderBlogList(likedBlogs)}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">💾 Bài viết đã lưu</h2>
        {renderBlogList(savedBlogs)}
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-3">💬 Bài viết đã bình luận</h2>
        {renderBlogList(commentedBlogs)}
      </section>
    </div>
  );
};

export default BloggerActivity;
