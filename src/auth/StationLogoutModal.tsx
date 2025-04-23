import React, { useState } from "react";

interface Station {
  id: number;
  name: string;
  location: string;
}

interface Props {
  station: Station;
  onClose: () => void;
  onSuccess: () => void;
}

const StationLogoutModal: React.FC<Props> = ({ station, onClose, onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = async () => {
    try {
      const res = await fetch("http://localhost:3000/stations/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: station.name, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onSuccess();
      } else {
        setError("❌ Sai mật khẩu trụ. Vui lòng thử lại.");
      }
    } catch {
      setError("⚠️ Lỗi khi xác thực. Kiểm tra kết nối.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm border border-gray-200">
        <h2 className="text-xl font-bold text-center text-red-600 mb-2">
          🏁 Đăng xuất trạm: {station.name}
        </h2>
        <p className="text-center text-gray-600 text-sm mb-4">
          Vui lòng nhập mật khẩu trạm để xác nhận
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm mb-3 text-center">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="🔐 Mật khẩu trạm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleConfirm}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationLogoutModal;
