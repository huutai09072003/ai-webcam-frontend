import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../layout/AppHeader";

interface Station {
  id: number;
  name: string;
  location: string;
}

interface Props {
  station: Station;
  onLoginSuccess: (user: { name: string }) => void;
  onStationLogout: () => void;
  redirectTo: string;
}

const LoginScreen: React.FC<Props> = ({
  station,
  onLoginSuccess,
  onStationLogout,
  redirectTo,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:3000/users/sign_in", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: { email, password },
          webcam: true,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        onLoginSuccess({ name: data.name || email });
        navigate(redirectTo);
      } else {
        setError("❌ Sai email hoặc mật khẩu");
      }
    } catch {
      setError("⚠️ Có lỗi xảy ra, vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* Header chung với nút đăng xuất trạm */}
      <AppHeader
        station={station}
        onStationLogout={onStationLogout}
        showUserLogout={false}
        showStationLogout={true}
      />

      <main className="flex flex-col flex-grow justify-center items-center px-4">
        <div className="bg-white shadow-md rounded-xl p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-green-700 mb-6">
            🔐 Đăng nhập người dùng
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              placeholder="📧 Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="password"
              placeholder="🔑 Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />

            <button
              onClick={handleLogin}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700 transition"
            >
              🚪 Đăng nhập
            </button>
          </div>
        </div>
      </main>

      <footer className="text-sm text-gray-500 text-center py-4">
        © {new Date().getFullYear()} Trạm nhận diện phế liệu
      </footer>
    </div>
  );
};

export default LoginScreen;
