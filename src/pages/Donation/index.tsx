import './Donate.scss';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';

import { API_BASE_URL } from '../../config/api';

interface Donor {
  id: number;
  full_name: string;
  amount: number;
  currency: string;
  frequency: string;
  created_at: string;
}

const Donate: React.FC = () => {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/donations`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        });
        setDonors(response.data);
      } catch (err) {
        console.error('Error fetching donors:', err);
        setError(
          axios.isAxiosError(err)
            ? err.response?.data?.error || 'Không thể tải danh sách nhà tài trợ. Vui lòng thử lại.'
            : 'Đã xảy ra lỗi không xác định.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8 donors-container">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-4 animate-fadeIn">
          Danh sách nhà tài trợ
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Chúng tôi xin cảm ơn tất cả các nhà tài trợ đã đóng góp để hỗ trợ sứ mệnh của chúng tôi. Dưới đây là danh sách những người đã cho phép hiển thị tên công khai.
        </p>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-600">Đang tải...</div>
        ) : donors.length === 0 ? (
          <div className="text-center text-gray-600">Chưa có nhà tài trợ nào được hiển thị công khai.</div>
        ) : (
          <div className="space-y-4">
            {donors.map((donor) => (
              <div
                key={donor.id}
                className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Họ và tên:</p>
                    <p className="font-medium">{donor.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số tiền:</p>
                    <p className="font-medium">
                      {donor.amount} {donor.currency.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tần suất:</p>
                    <p className="font-medium">
                      {donor.frequency === 'once'
                        ? 'Một lần'
                        : donor.frequency === 'monthly'
                        ? 'Hàng tháng'
                        : 'Hàng năm'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Thời gian:</p>
                    <p className="font-medium">{donor.created_at}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-6">
          <a
            href="/"
            className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
          >
            Quay lại trang chủ
          </a>
        </div>
      </div>
    </div>
  );
};

export default Donate;