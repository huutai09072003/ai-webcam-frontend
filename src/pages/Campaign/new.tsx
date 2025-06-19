import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const NewCampaignPage: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    location: '',
    email: '',
    is_get_donated: false,
    thumbnail: null as File | null,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stripePrompt, setStripePrompt] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setError('');
    setSuccessMessage('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm(prev => ({ ...prev, thumbnail: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', form.email);
      formData.append('campaign[title]', form.title);
      formData.append('campaign[description]', form.description);
      formData.append('campaign[goal]', form.goal);
      formData.append('campaign[location]', form.location);
      formData.append('is_get_donated', String(form.is_get_donated));

      if (form.thumbnail) {
        formData.append('campaign[thumbnail]', form.thumbnail);
      }

      const response = await axios.post(`${API_BASE_URL}/campaigns`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        setSuccessMessage("✅ Chiến dịch của bạn đã được gửi...");
        setForm({ title: '', description: '', goal: '', location: '', email: '', is_get_donated: false, thumbnail: null });
        setImagePreview(null);
        setStripePrompt(false);
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.errors) {
        const errorMsgs = err.response.data.errors;
        setError(errorMsgs.join(', '));
        setStripePrompt(errorMsgs.includes("Bạn cần đăng ký tài khoản Stripe để có thể nhận donate từ cộng đồng."));
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        setStripePrompt(false);
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Tạo chiến dịch mới</h1>

      {error && <div className="text-red-600 mb-4 font-medium">{error}</div>}
      {successMessage && <div className="text-green-600 mb-4 font-medium">{successMessage}</div>}

      {stripePrompt && (
        <div className="my-4">
          <button
            onClick={async () => {
              try {
                const accRes = await axios.post(`${API_BASE_URL}/stripe_accounts`, { email: form.email });
                const linkRes = await axios.post(`${API_BASE_URL}/stripe_accounts/link`, { account: accRes.data.account_id });
                window.location.href = linkRes.data.url;
              } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data) {
                  setError(err.response.data.error || 'Failed to register Stripe account');
                } else {
                  setError('An unexpected error occurred');
                }
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Đăng ký tài khoản Stripe để nhận donate
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
        <input
          name="email"
          type="email"
          placeholder="Email của bạn"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          name="title"
          placeholder="Tiêu đề chiến dịch"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <textarea
          name="description"
          placeholder="Mô tả chi tiết"
          rows={4}
          value={form.description}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          name="goal"
          placeholder="Mục tiêu chiến dịch"
          value={form.goal}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          name="location"
          placeholder="Địa điểm diễn ra"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        <label className="block">
          <span className="block mb-1 font-medium">Ảnh đại diện chiến dịch</span>
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
        </label>

        {imagePreview && (
          <div className="mt-2">
            <span className="block text-sm text-gray-600 mb-1">Xem trước:</span>
            <img
              src={imagePreview}
              alt="Thumbnail Preview"
              className="rounded border shadow max-h-64 object-contain"
            />
          </div>
        )}

        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="is_get_donated"
            checked={form.is_get_donated}
            onChange={(e) => setForm({ ...form, is_get_donated: e.target.checked })}
          />
          <span>Cho phép nhận donate từ cộng đồng</span>
        </label>

        <button
          type="submit"
          className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
        >
          Gửi duyệt chiến dịch
        </button>
      </form>
    </div>
  );
};

export default NewCampaignPage;
