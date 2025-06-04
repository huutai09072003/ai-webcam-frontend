import React, { useState } from 'react';

import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';

const BlogSignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    password_confirmation: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_BASE_URL}/bloggers`, {
      blogger: form
      }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
      });

      // ✅ Sau khi đăng ký thành công, chuyển sang trang đăng nhập
      navigate('/blogs/login', {
        state: {
          message: '🎉 Tài khoản đã được tạo thành công! Vui lòng đăng nhập.'
        }
      });
    } catch {
      setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Đăng ký Blogger</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="username"
          placeholder="Tên hiển thị"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Nhập lại mật khẩu"
          value={form.password_confirmation}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-medium py-2 rounded hover:bg-green-700"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
};

export default BlogSignupPage;
