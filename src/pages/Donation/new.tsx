import React, { useState } from 'react';

import axios from 'axios';

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

const DonationForm: React.FC = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [frequency, setFrequency] = useState<'once' | 'monthly' | 'annually'>('once');
  const [currency, setCurrency] = useState<'GBP' | 'EUR' | 'USD'>('USD');
  const [fullName, setFullName] = useState('');
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [includeName, setIncludeName] = useState(false);

  const presetAmounts = [20, 50, 100, 500, 1000];

    const handleSubmit = async (e: React.FormEvent) => {
        console.log('handleSubmit called');
        
    e.preventDefault();
    if (!stripe || !elements || !amount || !fullName) {
        setError('Vui lòng điền đầy đủ các trường bắt buộc.');
        return;
    }

    setLoading(true);
    try {
        const response = await axios.post(`${API_BASE_URL}/donations`, {
        amount: amount * 100,
        currency,
        frequency,
        full_name: fullName,
        subscribe_newsletter: subscribeNewsletter,
        include_name: includeName,
        });
        const { sessionId } = response.data;

        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
        setError(error.message || 'Đã xảy ra lỗi, vui lòng thử lại.');
        }
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        setError(error.response?.data?.error || 'Không thể xử lý quyên góp.');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 flex flex-col md:flex-row gap-8">
      <div className="md:w-1/2 text-gray-800 space-y-4">
        <h1 className="text-3xl font-bold mb-2">Hãy giúp chúng tôi làm nhiều hơn</h1>
        <p className="text-base">
          Để mang lại một tương lai tốt đẹp hơn, chúng tôi cần dữ liệu và nghiên cứu để hiểu rõ các vấn đề lớn mà thế giới đang đối mặt và cách tiến bộ trong việc giải quyết chúng. Đó là lý do chúng tôi cung cấp tất cả công việc của mình miễn phí và dễ tiếp cận cho mọi người.
        </p>
        <p className="text-base">
          Chúng tôi là một tổ chức phi lợi nhuận. Điều này có nghĩa là chúng tôi phụ thuộc vào sự quyên góp và hỗ trợ để tiếp tục hoạt động. Sự đóng góp của bạn đọc rất quan trọng, giúp chúng tôi duy trì sự ổn định và độc lập, để tập trung vào việc cung cấp dữ liệu và bằng chứng mà mọi người cần biết.
        </p>
        <p className="text-base">
          Quyên góp cũng là cách để thể hiện rằng bạn thấy công việc của chúng tôi hữu ích và có giá trị. Điều này là nguồn cảm hứng lớn lao cho đội ngũ của chúng tôi.
        </p>
        <p className="text-base">
          Nếu bạn muốn giúp chúng tôi làm nhiều hơn, hãy quyên góp ngay hôm nay – điều này sẽ tạo ra sự khác biệt thực sự.
        </p>
        <p className="text-sm">
          Cảm ơn bạn, <br />
          Nhóm Global Change Data Lab và Our World in Data
        </p>
        <p className="text-sm mt-2">
          <a href="#" className="text-blue-600 hover:underline">Tìm hiểu thêm về quyên góp trong phần Câu hỏi thường gặp</a>
        </p>
      </div>

      {/* Phần form quyên góp bên phải */}
      <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tần suất */}
          <div>
            <label className="block text-sm font-medium text-gray-700">TẦN SUẤT</label>
            <div className="flex space-x-2">
              {['once', 'monthly', 'annually'].map((freq) => (
                <button
                  key={freq}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm ${
                    frequency === freq
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-200`}
                  onClick={() => setFrequency(freq as 'once' | 'monthly' | 'annually')}
                >
                  {freq === 'once' ? 'Một lần' : freq === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                </button>
              ))}
            </div>
          </div>

          {/* Tiền tệ */}
          <div>
            <label className="block text-sm font-medium text-gray-700">TIỀN TỆ</label>
            <div className="flex space-x-2">
              {['GBP', 'EUR', 'USD'].map((curr) => (
                <button
                  key={curr}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm ${
                    currency === curr
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-200`}
                  onClick={() => setCurrency(curr as 'GBP' | 'EUR' | 'USD')}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          {/* Số tiền */}
          <div>
            <label className="block text-sm font-medium text-gray-700">SỐ TIỀN</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`px-4 py-2 rounded-md text-sm ${
                    amount === amt
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } transition-colors duration-200`}
                  onClick={() => setAmount(amt)}
                >
                  {currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$'}{amt}
                </button>
              ))}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                min="1"
                step="0.01"
                className="w-24 px-2 py-1 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Khác"
              />
            </div>
          </div>

          {/* Họ và tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700">HỌ VÀ TÊN (BẮT BUỘC NẾU CHỌN)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Họ và tên của bạn"
            />
          </div>

          {/* Checkbox */}
          <div className="space-y-2">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={subscribeNewsletter}
                onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                className="mr-2"
              />
              Đăng ký nhận bản tin cho nhà tài trợ (gửi tối đa 2 lần/năm)
            </label>
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={includeName}
                onChange={(e) => setIncludeName(e.target.checked)}
                className="mr-2"
              />
              Hiển thị tên tôi trong danh sách nhà tài trợ công khai
            </label>
          </div>

          {/* Lỗi và nút gửi */}
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={!stripe || loading}
            className={`w-full py-3 rounded-md text-white font-semibold ${
              loading ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
            } transition-colors duration-200`}
          >
            {loading ? 'Đang xử lý...' : 'Quyên góp ngay'}
          </button>
        </form>
      </div>
    </div>
  );
};

const DonationWrapper: React.FC = () => (
  <Elements stripe={stripePromise}>
    <DonationForm />
  </Elements>
);

export default DonationWrapper;