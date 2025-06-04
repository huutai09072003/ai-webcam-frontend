import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';
import { useAuth } from '../../hooks/useAuth';

const BlogNewPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState({
    title: '',
    content: '',
    thumb_nail_url: '',
  });
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = localStorage.getItem('auth_token');

    if (!authToken || !user?.id) {
      setError('Bạn cần đăng nhập để đăng bài viết.');
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/blogs`,
        { blog: form },
        {
          headers: {
            Authorization: `${authToken}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      );

      navigate(`/bloggers/${user.id}`, {
        state: {
          message: '✅ Bài viết của bạn đã được gửi và đang chờ duyệt.',
        },
      });
    } catch (error: unknown) {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      console.error('Error creating blog post:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        📝 Viết bài Blog
      </h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Tiêu đề"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <textarea
          name="content"
          placeholder="Nội dung bài viết"
          rows={8}
          value={form.content}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="text"
          name="thumb_nail_url"
          placeholder="URL hình đại diện (tuỳ chọn)"
          value={form.thumb_nail_url}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <button
          type="submit"
          className="bg-green-600 text-white font-medium px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Đăng bài viết
        </button>
      </form>
    </div>
  );
};

export default BlogNewPage;
