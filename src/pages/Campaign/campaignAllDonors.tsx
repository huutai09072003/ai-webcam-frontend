import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { API_BASE_URL } from '../../config/api';

interface Donation {
  id: number;
  full_name: string;
  amount: number;
  currency: string;
  created_at: string;
}

const CampaignDonorsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axios
      .get<Donation[]>(`${API_BASE_URL}/campaigns/${id}/all_donations`) // <-- endpoint mới/all
      .then((res) => setDonations(res.data))
      .catch(() => setError('Không thể tải danh sách nhà tài trợ.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-gray-600">Đang tải danh sách nhà tài trợ...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Tổng số tiền donate
  const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const currency = donations[0]?.currency?.toUpperCase() || '';

  // Top 5 nhà tài trợ
  const topDonors = [...donations]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Thống kê donation theo ngày
  const donationByDate: Record<string, number> = {};
  donations.forEach((d) => {
    const date = new Date(d.created_at).toLocaleDateString('vi-VN');
    donationByDate[date] = (donationByDate[date] || 0) + d.amount;
  });
  const chartData = Object.entries(donationByDate)
    .map(([date, amount]) => ({ date, amount }));

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-blue-600 hover:underline"
      >
        ← Quay lại chiến dịch
      </button>
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">Nhà tài trợ chiến dịch</h1>
      <div className="mb-8 flex flex-wrap gap-8 justify-center">
        <div className="bg-green-50 border border-green-200 rounded p-4 w-60 text-center">
          <div className="text-xl font-semibold text-green-800 mb-1">Tổng số lượt donate</div>
          <div className="text-3xl font-bold">{donations.length}</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded p-4 w-60 text-center">
          <div className="text-xl font-semibold text-green-800 mb-1">Tổng số tiền</div>
          <div className="text-3xl font-bold">{totalAmount.toLocaleString('vi-VN')} {currency}</div>
        </div>
      </div>
      <div className="bg-white shadow rounded p-6 mb-10">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Top 5 nhà tài trợ</h2>
        <ul className="space-y-2">
          {topDonors.map((d, idx) => (
            <li key={d.id} className="border-b pb-2 border-gray-100 flex items-center gap-2">
              <span className="w-8 text-xl font-bold text-green-600">{idx + 1}</span>
              <div className="flex-1">
                <strong>{d.full_name || 'Ẩn danh'}</strong>
                <div className="text-gray-500 text-sm">
                  {new Date(d.created_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <div className="text-green-700 font-semibold text-base">
                +{d.amount.toLocaleString('vi-VN')} {d.currency.toUpperCase()}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white shadow rounded p-6 mb-10">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Biểu đồ đóng góp theo ngày</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="amount" fill="#16a34a" name="Số tiền" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-lg font-semibold text-green-700 mb-4">Danh sách tất cả nhà tài trợ</h2>
        <table className="w-full text-left border">
          <thead>
            <tr className="bg-green-50 text-green-800">
              <th className="py-2 px-2">#</th>
              <th className="py-2 px-2">Tên</th>
              <th className="py-2 px-2">Số tiền</th>
              <th className="py-2 px-2">Ngày</th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d, idx) => (
              <tr key={d.id} className="border-t">
                <td className="py-2 px-2">{idx + 1}</td>
                <td className="py-2 px-2">{d.full_name || 'Ẩn danh'}</td>
                <td className="py-2 px-2 font-semibold text-green-700">
                  {d.amount.toLocaleString('vi-VN')} {d.currency.toUpperCase()}
                </td>
                <td className="py-2 px-2">{new Date(d.created_at).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CampaignDonorsPage;
