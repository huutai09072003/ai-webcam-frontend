import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { useParams } from 'react-router-dom';

import {
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import {
  API_BASE_URL,
  STRIPE_KEY,
} from '../../config/api';

const stripePromise = loadStripe(STRIPE_KEY!);

interface Founder {
  name: string;
  email: string;
}

interface Campaign {
  id: number;
  title: string;
  founder: Founder;
}

const CampaignDonationForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const stripe = useStripe();
  const elements = useElements();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [amount, setAmount] = useState<number>(5);
  const [fullName, setFullName] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP'>('USD');
  const [includeName, setIncludeName] = useState(false);
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const frequency = 'once'; // mặc định donate một lần

  useEffect(() => {
    if (!id) return;
    axios
      .get(`${API_BASE_URL}/campaigns/${id}`)
      .then((res) => {
        setCampaign(res.data);
      })
      .catch(() => {
        setError('Không thể tải thông tin chiến dịch.');
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !stripe || !elements) return;

    if (!fullName || !amount) {
      setError('Vui lòng nhập đầy đủ tên và số tiền.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/campaigns/${id}/donate`, {
        amount: amount * 100,
        currency,
        frequency,
        full_name: fullName,
        include_name: includeName,
        subscribe_newsletter: subscribeNewsletter
      });

      window.location.href = response.data.url;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 
                 (err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Không thể khởi tạo donate.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) {
    return <div className="text-center text-gray-600">Đang tải chiến dịch...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-green-700">Ủng hộ chiến dịch</h2>

      <div className="bg-gray-100 p-4 rounded-md text-sm text-gray-800">
        <p><strong>Chiến dịch:</strong> {campaign.title}</p>
        <p><strong>Người nhận:</strong> {campaign.founder.name} – {campaign.founder.email}</p>
      </div>

      {/* Số tiền */}
      <div>
        <label className="block text-sm font-medium">Số tiền (theo tiền tệ bạn chọn)</label>
        <input
          type="number"
          min={1}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Tiền tệ */}
      <div>
        <label className="block text-sm font-medium">Chọn tiền tệ</label>
        <div className="flex gap-3 mt-1">
          {(['USD', 'EUR', 'GBP'] as const).map((curr) => (
            <button
              key={curr}
              type="button"
              className={`px-4 py-2 rounded-md border text-sm ${
                currency === curr
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setCurrency(curr)}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Họ tên */}
      <div>
        <label className="block text-sm font-medium">Họ và tên người ủng hộ</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2"
        />
      </div>

      {/* Tùy chọn */}
      <div className="space-y-2 text-sm">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={subscribeNewsletter}
            onChange={(e) => setSubscribeNewsletter(e.target.checked)}
            className="mr-2"
          />
          Đăng ký nhận bản tin cho nhà tài trợ
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={includeName}
            onChange={(e) => setIncludeName(e.target.checked)}
            className="mr-2"
          />
          Hiển thị tên tôi công khai
        </label>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {loading ? 'Đang xử lý...' : 'Ủng hộ ngay'}
      </button>
    </form>
  );
};

const CampaignNewDonation: React.FC = () => (
  <div className="py-10 px-4 min-h-screen bg-gray-50">
    <Elements stripe={stripePromise}>
      <CampaignDonationForm />
    </Elements>
  </div>
);

export default CampaignNewDonation;
