import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

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
  thumb_nail_url: string;
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

const CampaignShowPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [thankYouMessage, setThankYouMessage] = useState('');
  const [verifyingDonation, setVerifyingDonation] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setError('Không tìm thấy chiến dịch.');
      setLoading(false);
      return;
    }

    axios
      .get<Campaign>(`http://localhost:3000/campaigns/${id}`)
      .then((res) => setCampaign(res.data))
      .catch(() => setError('Không thể tải chiến dịch.'))
      .finally(() => setLoading(false));

    axios
      .get<Donation[]>(`http://localhost:3000/campaigns/${id}/donation`)
      .then((res) => setDonations(res.data))
      .catch(() => console.error('Không thể tải danh sách donation.'));
  }, [id]);

  useEffect(() => {
    const donationSuccess = searchParams.get('donation');
    const sessionId = searchParams.get('session_id');

    if (donationSuccess === 'success' && sessionId && id) {
      setVerifyingDonation(true);
      axios
        .post(`http://localhost:3000/campaigns/${id}/verify_donation`, {
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

  if (loading) return <div className="text-gray-600">Đang tải chiến dịch...</div>;
  if (error || !campaign) return <div className="text-red-500">{error || 'Lỗi không xác định.'}</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-7 min-h-screen py-10 px-4 text-gray-800 bg-white">
      {/* Sidebar left - Founder info */}
      <div className="col-span-1 pr-4 text-sm">
        <h2 className="font-semibold text-green-700 mb-2">Người tổ chức</h2>
        <p><strong>👤</strong> {campaign.founder.name}</p>
        <p><strong>📧</strong> {campaign.founder.email}</p>
        {campaign.founder.wallet_address && (
          <p><strong>💼</strong> {campaign.founder.wallet_address}</p>
        )}
      </div>

      {/* Main content */}
      <div className="col-span-5 border-l border-r border-gray-200 px-6">
        {thankYouMessage && (
          <div className="bg-green-50 border border-green-300 text-green-700 text-center font-medium p-4 rounded mb-6">
            {thankYouMessage}
          </div>
        )}
        <h1 className="text-2xl font-bold text-green-800 mb-4">{campaign.title}</h1>
        {campaign.thumb_nail_url && (
          <img
            src={campaign.thumb_nail_url}
            alt={campaign.title}
            className="w-full max-h-[400px] object-cover mb-6 rounded"
          />
        )}
        <div className="whitespace-pre-line text-base leading-relaxed">
          {campaign.description}
        </div>
      </div>

      {/* Sidebar right - Donate & supporters */}
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
              {donations.map((d) => (
                <li key={d.id} className="border-b pb-2 border-gray-100">
                  <strong>{d.full_name || 'Ẩn danh'}</strong><br />
                  💵 {d.amount} {d.currency.toUpperCase()}<br />
                  <span className="text-xs text-gray-400">
                    {new Date(d.created_at).toLocaleDateString('vi-VN')}
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default CampaignShowPage;
