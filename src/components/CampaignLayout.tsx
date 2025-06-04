import React from 'react';

import {
  Outlet,
  useNavigate,
} from 'react-router-dom';

const CampaignLayout: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-4 space-y-4">
      <div className="flex justify-between items-center border-b pb-4">
        <div className="cursor-pointer hover:opacity-80" onClick={() => navigate("/campaigns")}>
          <h1 className="text-2xl font-bold text-green-700">🌱 Chiến dịch cộng đồng</h1>
          <p className="text-sm text-gray-500">
            Cùng nhau khởi xướng, kết nối và lan tỏa tác động tích cực đến môi trường và xã hội
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate("/campaigns/new")}
            className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 shadow-sm transition"
          >
            ➕ Tạo chiến dịch mới
          </button>
        </div>
      </div>

      <Outlet />
    </div>
  );
};

export default CampaignLayout;
