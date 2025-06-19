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
    thumbnail: null as File | null,
  });
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setForm(prev => ({ ...prev, thumbnail: file }));

      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const authToken = localStorage.getItem('auth_token');

    if (!authToken || !user?.id) {
      setError('Bạn cần đăng nhập để đăng bài viết.');
      return;
    }

    const formData = new FormData();
    formData.append('blog[title]', form.title);
    formData.append('blog[content]', form.content);
    if (form.thumbnail) {
      formData.append('blog[thumbnail]', form.thumbnail);
    }

    try {
      await axios.post(`${API_BASE_URL}/blogs`, formData, {
        headers: {
          Authorization: `${authToken}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

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
    <div className="max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        📝 Viết bài Blog
      </h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Tiêu đề
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Nội dung
          </label>
          <textarea
            name="content"
            rows={8}
            value={form.content}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Ảnh đại diện
          </label>
          <div className="relative cursor-pointer bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
            <span className="text-gray-700">📁 Chọn ảnh từ thiết bị</span>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
          {imagePreview && (
            <div className="mt-4">
              <span className="block text-sm text-gray-600 mb-1">
                Xem trước ảnh:
              </span>
              <img
                src={imagePreview}
                alt="Thumbnail preview"
                className="rounded-lg border shadow-md max-h-64 object-contain"
              />
            </div>
          )}
        </div>

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
