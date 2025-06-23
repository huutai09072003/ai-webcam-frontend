import './BlogIndexPage.scss';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';

import { DEFAULT_AVATAR } from '../../assets/defaultAvatar';
import { API_BASE_URL } from '../../config/api';

type Blogger = {
  id: number;
  username: string;
  avatar_url: string;
};

type Blog = {
  id: number;
  title: string;
  content: string;
  view_count: number;
  likes_count: number;
  blogger: Blogger;
  thumbnail_url: string;
  published_at: string;
};

type Pagination = {
  current_page: number;
  total_pages: number;
  total_count: number;
  per_page: number;
};

const BlogIndexPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [topBloggers, setTopBloggers] = useState<Blogger[]>([]);
  const [topViews, setTopViews] = useState<Blog[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const perPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [blogsRes, topBloggersRes, topViewsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/blogs`, {
            params: {
              q: {
                title_or_blogger_username_cont: searchQuery
              },
              sort: sortOption,
              page,
              per_page: perPage,
            },
          }),
          axios.get(`${API_BASE_URL}/blogs/top_bloggers`),
          axios.get(`${API_BASE_URL}/blogs/top_views`),
        ]);

        setBlogs(blogsRes.data.blogs);
        setPagination(blogsRes.data.pagination);
        setTopBloggers(topBloggersRes.data);
        setTopViews(topViewsRes.data);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu blog:', err);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchQuery, sortOption, page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        {/* Left Sidebar - Top Bloggers */}
        <aside className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-3 text-green-700">🌟 Top Blogger</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {topBloggers.map(blogger => (
              <li key={blogger.id} className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
                <Link to={`/bloggers/${blogger.id}`} className="flex items-center gap-2">
                  <img
                    src={blogger.avatar_url || DEFAULT_AVATAR}
                    alt={blogger.username}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                  />
                  <span className="hover:text-green-700">{blogger.username}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Section */}
        <section className="md:col-span-4 space-y-8">
          {/* Filter & Sort Toolbar */}
          <div className="filter-toolbar">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              placeholder="🔍 Tìm theo tiêu đề hoặc tác giả..."
            />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="">Sắp xếp</option>
              <option value="title asc">Tiêu đề A → Z</option>
              <option value="title desc">Tiêu đề Z → A</option>
              <option value="published_at desc">Mới nhất</option>
              <option value="published_at asc">Cũ nhất</option>
            </select>
          </div>

          {/* Blog list */}
          <div className="blog-list space-y-6">
            {isLoading ? (
              <p className="text-center text-gray-500">Đang tải...</p>
            ) : blogs.length === 0 ? (
              <p className="text-center text-gray-500">Không tìm thấy bài viết phù hợp.</p>
            ) : (
              blogs.map(blog => (
                <article key={blog.id} className="blog-card">
                  <div className="blog-card__image-wrapper">
                    <Link to={`/blogs/${blog.id}`}>
                      <img
                        src={blog.thumbnail_url || DEFAULT_AVATAR}
                        alt={blog.title}
                        className="blog-card__image"
                        onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
                      />
                    </Link>
                  </div>

                  <div className="blog-card__content">
                    <Link to={`/blogs/${blog.id}`} className="blog-card__title">
                      {blog.title}
                    </Link>
                    <p className="blog-card__excerpt">{blog.content}</p>
                    <div className="blog-card__meta">
                      <span>{new Date(blog.published_at).toLocaleDateString('vi-VN')}</span>
                      <span> • </span>
                      <Link to={`/bloggers/${blog.blogger.id}`} className="text-green-700 hover:underline">
                        {blog.blogger.username}
                      </Link>
                    </div>
                    <div className="blog-card__footer">
                      <Link to={`/blogs/${blog.id}`} className="blog-card__read-more">
                        Đọc tiếp
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination && pagination.total_pages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`px-3 py-1 border rounded ${pagination.current_page === p
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-700 hover:bg-green-100'}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Right Sidebar - Top Viewed Blogs */}
        <aside className="md:col-span-1">
          <h2 className="text-lg font-semibold mb-3 text-green-700">🔥 Bài nổi bật</h2>
          <ul className="space-y-2 text-sm text-gray-700">
            {topViews.map(blog => (
              <li key={blog.id} className="hover:bg-gray-100 p-2 rounded">
                <Link to={`/blogs/${blog.id}`} className="hover:text-green-700">
                  {blog.title}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default BlogIndexPage;
