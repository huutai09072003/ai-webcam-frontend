// src/pages/blogs/BlogIndexPage.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';
import { Link } from 'react-router-dom';
import './BlogIndexPage.scss';
import { DEFAULT_AVATAR } from '../../assets/defaultAvatar';

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
  thumbnail_url?: string;
  thumbnail_url: string;
  published_at: string;
};

const BlogIndexPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [topBloggers, setTopBloggers] = useState<Blogger[]>([]);
  const [topViews, setTopViews] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [blogsResponse, topBloggersResponse, topViewsResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/blogs`),
          axios.get(`${API_BASE_URL}/blogs/top_bloggers`),
          axios.get(`${API_BASE_URL}/blogs/top_views`)
        ]);
        
        setBlogs(blogsResponse.data);
        setTopBloggers(topBloggersResponse.data);
        setTopViews(topViewsResponse.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10 text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
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

        <section className="md:col-span-4 space-y-8 blog-list">
          {blogs.map(blog => (
            <article key={blog.id} className="blog-card">
              <div className="blog-card__image-wrapper">
                <Link to={`/blogs/${blog.id}`}>
                  <img
                    src={blog.thumbnail_url || blog.thumbnail_url || 'https://scdi.org.vn/upload/images/6.%20Tin%20t%E1%BB%A9c/Tin%20t%E1%BB%A9c%20CHUNG/Ho%E1%BA%A1t%20%C4%91%E1%BB%99ng%20c%E1%BB%A7a%20SCDI/b%E1%BA%A3n%20tin%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng/B%E1%BA%A3n%20tin%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng%20Thumbnail.png'}
                    alt={blog.title}
                    className="blog-card__image"
                    onError={(e) => (e.currentTarget.src = 'https://scdi.org.vn/upload/images/6.%20Tin%20t%E1%BB%A9c/Tin%20t%E1%BB%A9c%20CHUNG/Ho%E1%BA%A1t%20%C4%91%E1%BB%99ng%20c%E1%BB%A7a%20SCDI/b%E1%BA%A3n%20tin%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng/B%E1%BA%A3n%20tin%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng%20Thumbnail.png')}
                  />
                </Link>
              </div>

              <div className="blog-card__content">
                <Link to={`/blogs/${blog.id}`} className="blog-card__title">
                  {blog.title}
                </Link>

                <p className="blog-card__excerpt">{blog.content}</p>

                <div className="blog-card__meta">
                  <span>{new Date(blog.published_at).toLocaleDateString('vi-VN', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })}</span>
                  <span>• BLOG</span>
                </div>

                <div className="blog-card__footer">
                  <Link to={`/blogs/${blog.id}`} className="blog-card__read-more">
                    READ MORE
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </section>

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