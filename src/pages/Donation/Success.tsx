import './Success.scss';

import React, {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { useLocation } from 'react-router-dom';

import { API_BASE_URL } from '../../config/api';

interface PaymentDetails {
  amount: number;
  currency: string;
  payment_id?: string;
  subscription_id?: string;
  frequency: string;
  full_name: string;
  subscribe_newsletter: boolean;
  include_name: boolean;
}

const Success: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');
    if (sessionId) {
      axios
        .get(`${API_BASE_URL}/donations/success?session_id=${sessionId}`, {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000,
        })
        .then((response) => {
          setPaymentDetails(response.data);
        })
        .catch((err) => {
          console.error('Error fetching payment details:', err);
          setError(
            axios.isAxiosError(err)
              ? err.response?.data?.error || 'Không thể tải thông tin quyên góp. Vui lòng thử lại.'
              : 'Đã xảy ra lỗi không xác định.'
          );
        });
    } else {
      setError('Không tìm thấy session_id. Vui lòng kiểm tra lại.');
    }
  }, [location]);

  return (
    <div className="bg-gray-100 flex items-center justify-center p-10">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-6 md:p-8 success-container">
        <h1 className="text-3xl font-bold text-center text-green-600 mb-4 animate-fadeIn">
          Cảm ơn bạn đã quyên góp!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Sự đóng góp của bạn giúp chúng tôi tiếp tục cung cấp dữ liệu và nghiên cứu miễn phí cho mọi người. Chúng tôi rất trân trọng sự hỗ trợ của bạn!
        </p>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
            <p>{error}</p>
          </div>
        )}

        {paymentDetails && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Thông tin quyên góp</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ và tên:</p>
                  <p className="font-medium">{paymentDetails.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số tiền:</p>
                  <p className="font-medium">
                    {paymentDetails.amount.toFixed(2)} {paymentDetails.currency.toUpperCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tần suất:</p>
                  <p className="font-medium">
                    {paymentDetails.frequency === 'once'
                      ? 'Một lần'
                      : paymentDetails.frequency === 'monthly'
                      ? 'Hàng tháng'
                      : 'Hàng năm'}
                  </p>
                </div>
                {paymentDetails.payment_id && (
                  <div>
                    <p className="text-sm text-gray-600">ID Thanh toán:</p>
                    <p className="font-medium">{paymentDetails.payment_id}</p>
                  </div>
                )}
                {paymentDetails.subscription_id && (
                  <div>
                    <p className="text-sm text-gray-600">ID Đăng ký:</p>
                    <p className="font-medium">{paymentDetails.subscription_id}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Đăng ký bản tin:</p>
                  <p className="font-medium">{paymentDetails.subscribe_newsletter ? 'Có' : 'Không'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hiển thị tên công khai:</p>
                  <p className="font-medium">{paymentDetails.include_name ? 'Có' : 'Không'}</p>
                </div>
              </div>
            </div>
            <div className="text-center">
              <a
                href="/"
                className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-200"
              >
                Quay lại trang chủ
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Success;