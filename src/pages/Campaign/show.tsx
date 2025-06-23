import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';

export interface Founder {
  id: number;
  name: string;
  email: string;
  wallet_address?: string;
  stripe_connected: boolean;
}

export interface Campaign {
  id: number;
  title: string;
  description: string;
  thumbnail_url: string;
  goal: string;
  location: string;
  status: string;
  is_get_donated: boolean;
  created_at: string;
  founder: Founder;
}

export interface Donation {
  id: number;
  full_name: string;
  amount: number;
  currency: string;
  created_at: string;
}

interface ContactPayload {
  to: 'founder' | 'admin';
  from_name: string;
  from_email: string;
  message: string;
}

const CampaignShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [verifyingDonation, setVerifyingDonation] = useState(false);

  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState<ContactPayload>({
    to: 'founder',
    from_name: '',
    from_email: '',
    message: '',
  });
  const [contactSending, setContactSending] = useState(false);
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('Không tìm thấy chiến dịch.');
      setLoading(false);
      return;
    }

    axios
      .get<Campaign>(`${API_BASE_URL}/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => setError('Không thể tải chiến dịch.'))
      .finally(() => setLoading(false));

    axios
      .get<Donation[]>(`${API_BASE_URL}/campaigns/${id}/donation`)
      .then((res) => setDonations(res.data))
      .catch(() => console.error('Không thể tải danh sách donation.'));
  }, [id]);

  useEffect(() => {
    const donationSuccess = searchParams.get('donation');
    const sessionId = searchParams.get('session_id');

    if (donationSuccess === 'success' && sessionId && id) {
      setVerifyingDonation(true);
      axios
        .post(`${API_BASE_URL}/campaigns/${id}/verify_donation`, {
          session_id: sessionId,
        })
        .then(() => {
          setThankYouMessage('🎉 Cảm ơn bạn đã ủng hộ chiến dịch!');
        })
        .catch(() => {
          setThankYouMessage('❌ Có lỗi xảy ra khi xác nhận giao dịch.');
        })
        .finally(() => setVerifyingDonation(false));
    }
  }, [searchParams, id]);

  const handleSendContact = async () => {
    if (!campaign) return;

    setContactSending(true);
    setContactStatus(null);

    try {
      const endpoint =
        contactForm.to === 'founder'
          ? `${API_BASE_URL}/campaigns/${campaign.id}/contact_founder`
          : `${API_BASE_URL}/campaigns/${campaign.id}/contact_to_admin`;

      await axios.post(endpoint, {
        from_name: contactForm.from_name,
        from_email: contactForm.from_email,
        message: contactForm.message,
      });

      setContactStatus('✅ Tin nhắn đã được gửi thành công!');
      setContactForm({ ...contactForm, message: '' });
    } catch {
      setContactStatus('❌ Gửi tin nhắn thất bại. Vui lòng thử lại.');
    } finally {
      setContactSending(false);
    }
  };

  if (loading) return <div className="text-gray-600">Đang tải chiến dịch...</div>;
  if (error || !campaign) return <div className="text-red-500">{error || 'Lỗi không xác định.'}</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-7 min-h-screen py-10 px-4 text-gray-800 bg-white">
      <div className="col-span-1 pr-4 text-sm">
        <h2 className="font-semibold text-green-700 mb-2">Người tổ chức</h2>
        <p><strong>👤</strong> {campaign.founder.name}</p>
        <p>{campaign.founder.email}</p>
        {campaign.founder.wallet_address && (
          <p><strong>💼</strong> {campaign.founder.wallet_address}</p>
        )}
        <button
          onClick={() => setShowContactModal(true)}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 mt-4 text-sm font-medium"
        >
          📩 Gửi tin nhắn
        </button>
      </div>

      <div className="col-span-5 border-l border-r border-gray-200 px-6">
        {thankYouMessage && (
          <div className="bg-green-50 border border-green-300 text-green-700 text-center font-medium p-4 rounded mb-6">
            {thankYouMessage}
          </div>
        )}
        <h1 className="text-2xl font-bold text-green-800 mb-4">{campaign.title}</h1>
        {campaign.thumbnail_url && (
          <img
            src={campaign.thumbnail_url}
            alt={campaign.title}
            className="w-full max-h-[400px] object-cover mb-6 rounded"
          />
        )}
        <div className="whitespace-pre-line text-base leading-relaxed">
          {campaign.description}
        </div>
      </div>

      <div className="col-span-1 pl-4 text-sm">
        {campaign.is_get_donated && campaign.founder.stripe_connected ? (
          <button
            onClick={() => navigate(`/campaigns/${campaign.id}/donate`)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 text-sm font-medium"
          >
            {verifyingDonation ? 'Xác nhận đang xử lý...' : 'Ủng hộ chiến dịch'}
          </button>
        ) : (
          <div className="text-gray-500 italic mb-4">
            Chiến dịch này hiện không nhận donate.
          </div>
        )}

        {donations.length > 0 && (
          <>
            <h4 className="font-semibold mb-2 text-green-700">Top nhà tài trợ</h4>
            <ul className="space-y-2">
              {donations.slice(0, 3).map((d) => (
                <li key={d.id} className="border-b pb-2 border-gray-100">
                  <strong>{d.full_name || 'Ẩn danh'}</strong><br />
                  💵 {d.amount} {d.currency.toUpperCase()}<br />
                  <span className="text-xs text-gray-400">
                    {new Date(d.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </li>
              ))}
            </ul>
            {donations.length > 3 && (
              <button
                onClick={() => navigate(`/campaigns/${campaign.id}/donors`)}
                className="mt-3 w-full bg-gray-100 text-green-700 py-2 rounded hover:bg-green-50 font-medium text-sm"
              >
                Xem tất cả nhà tài trợ
              </button>
            )}
          </>
        )}
      </div>

      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4 text-green-700">Gửi tin nhắn</h2>

            <label className="block mb-2 text-sm font-medium">
              Bạn cần liên lạc với?
              <select
                className="block w-full mt-1 border rounded p-2"
                value={contactForm.to}
                onChange={(e) =>
                  setContactForm({ ...contactForm, to: e.target.value as 'founder' | 'admin' })
                }
              >
                <option value="founder">Người sáng lập chiến dịch</option>
                <option value="admin">Quản trị viên của trang web</option>
              </select>
            </label>

            <label className="block mb-2 text-sm font-medium">
              Họ tên của bạn:
              <input
                type="text"
                className="block w-full mt-1 border rounded p-2"
                value={contactForm.from_name}
                onChange={(e) => setContactForm({ ...contactForm, from_name: e.target.value })}
              />
            </label>

            <label className="block mb-2 text-sm font-medium">
              Email của bạn:
              <input
                type="email"
                className="block w-full mt-1 border rounded p-2"
                value={contactForm.from_email}
                onChange={(e) => setContactForm({ ...contactForm, from_email: e.target.value })}
              />
            </label>

            <label className="block mb-2 text-sm font-medium">
              Nội dung:
              <textarea
                rows={4}
                className="block w-full mt-1 border rounded p-2"
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
              />
            </label>

            {contactStatus && (
              <p className="text-sm mt-2 text-center font-medium text-green-600">{contactStatus}</p>
            )}

            <div className="flex justify-between mt-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={() => setShowContactModal(false)}
              >
                Đóng
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                onClick={handleSendContact}
                disabled={contactSending}
              >
                {contactSending ? 'Đang gửi...' : 'Gửi tin nhắn'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignShowPage;