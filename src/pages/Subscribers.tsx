import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

interface Subscriber {
  id: number;
  full_name: string;
  created_at: string;
}

const Subscribers = () => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    nickname: '',
    phone_number: '',
  });
  const [errors, setErrors] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      await axios.post(`${API_BASE_URL}/subscribers`, { subscriber: form });
      setSuccess(true);
      setErrors(null);
      setForm({ full_name: '', email: '', nickname: '', phone_number: '' });
      fetchSubscribers();
    } catch (err: unknown) {
      setSuccess(false);
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setErrors(err.response.data.error);
      } else {
        setErrors('Đăng ký thất bại');
      }
    }
  };

  const fetchSubscribers = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
      const res = await axios.get(`${API_BASE_URL}/subscribers`);
      setSubscribers(res.data);
    } catch {
      console.error('Không thể tải danh sách người đăng ký');
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-green-700 mb-4 text-center">Đăng ký nhận thông báo</h2>
      <p className="text-gray-700 mb-6 text-center">
        Hãy đăng ký để nhận thông báo mới nhất từ chúng tôi về:
        <ul className="list-disc list-inside mt-2 text-left">
          <li>Từ vựng về rác được cập nhật</li>
          <li>Các chiến dịch tình nguyện mới</li>
          <li>Các quỹ đang được gây</li>
          <li>Blogs mới từ cộng đồng</li>
        </ul>
      </p>

      {success && <p className="text-green-600 mb-4">✅ Đăng ký thành công! Vui lòng kiểm tra email.</p>}
      {errors && <p className="text-red-600 mb-4">❌ {errors}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="full_name"
          placeholder="Họ và tên"
          value={form.full_name}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          required
        />
        <input
          type="text"
          name="nickname"
          placeholder="Tên gọi thân mật (nếu có)"
          value={form.nickname}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
          required
        />
        <input
          type="tel"
          name="phone_number"
          placeholder="Số điện thoại"
          value={form.phone_number}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors"
        >
          Gửi đăng ký
        </button>
      </form>

      {subscribers.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Danh sách người đã đăng ký</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead>
                <tr className="bg-green-100">
                  <th className="px-4 py-2 text-left border">Họ và tên</th>
                  <th className="px-4 py-2 text-left border">Thời gian đăng ký</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{sub.full_name}</td>
                    <td className="px-4 py-2 border">
                      {new Date(sub.created_at).toLocaleString('vi-VN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscribers;
