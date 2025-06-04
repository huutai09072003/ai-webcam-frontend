import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import axiosInstance from '../../../utils/axiosInstance';

interface Blogger {
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

const BloggerEdit: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Blogger>({
    username: "",
    email: "",
  });
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    axiosInstance.get(`/bloggers/${id}`).then((res) => {
      const { username, email } = res.data;
      setFormData({ username, email });
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.patch(`/bloggers/${id}`, formData);
      navigate(`/bloggers/${id}`);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors(["Đã xảy ra lỗi không xác định."]);
      }
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Chỉnh sửa thông tin</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block text-sm font-medium">Tên người dùng</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Mật khẩu mới</label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Xác nhận mật khẩu</label>
          <input
            type="password"
            name="password_confirmation"
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 mt-1"
          />
        </div>

        {errors.length > 0 && (
          <div className="text-red-500 space-y-1">
            {errors.map((err, i) => (
              <p key={i}>⚠️ {err}</p>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default BloggerEdit;
