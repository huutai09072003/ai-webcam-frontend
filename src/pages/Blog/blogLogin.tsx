// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';

import axios from 'axios';
import { useDispatch } from 'react-redux';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';
import { setUser } from '../../store/authSlice';

const BlogLoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const location = useLocation();
  const message = location.state?.message;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/bloggers/sign_in`, {
        blogger: {
          email: form.email,
          password: form.password,
        }
      });
      console.log('Login response:', res);
      

      const userData = {
        id: res.data.id,
        username: res.data.username || res.data.name,
        email: res.data.email,
        token: res.headers['authorization'],
      };

      dispatch(setUser(userData));

      localStorage.setItem('auth_token', userData.token);

      navigate('/blogs');
    } catch {
      setError('Email hoặc mật khẩu không đúng.');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Đăng nhập Blogger</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {message && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-2 mb-4 rounded">
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default BlogLoginPage;
