import React, { useState } from 'react';

import axios from 'axios';

const NewCampaignPage: React.FC = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    goal: '',
    location: '',
    thumb_nail_url: '',
    email: '',
    is_get_donated: false,
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stripePrompt, setStripePrompt] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccessMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      try {
        const response = await axios.post('http://localhost:3000/campaigns', form);

        if (response.data.success) {
          setSuccessMessage("✅ Chiến dịch của bạn đã được gửi...");
          setForm({ email: '', title: '', description: '', goal: '', location: '', thumb_nail_url: '', is_get_donated: false });
          setStripePrompt(false);
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response?.data?.errors) {
          const errorMsgs = err.response.data.errors;
          setError(errorMsgs.join(', '));

          if (errorMsgs.includes("Bạn cần đăng ký tài khoản Stripe để có thể nhận donate từ cộng đồng.")) {
            setStripePrompt(true);
          } else {
            setStripePrompt(false);
          }
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
                const accRes = await axios.post('http://localhost:3000/stripe_accounts', { email: form.email });
                const accountId = accRes.data.account_id;

                const linkRes = await axios.post('http://localhost:3000/stripe_accounts/link', { account: accountId });
                window.location.href = linkRes.data.url;
              } catch (err: unknown) {
                if (axios.isAxiosError(err) && err.response?.data) {
                  setError(err.response.data.error || 'Failed to register Stripe account');
                } else {
                  setError('An unexpected error occurred');
                  console.error(err);
                }
              }
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Đăng ký tài khoản Stripe để nhận donate
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="email"
          placeholder="Email của bạn"
          type="email"
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
        <input
          name="thumb_nail_url"
          placeholder="URL hình đại diện"
          value={form.thumb_nail_url}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />
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
