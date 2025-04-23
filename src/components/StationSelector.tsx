import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Station {
  id: number;
  name: string;
  location: string;
}

interface Props {
  onStart: () => void;
}

const StationSelector: React.FC<Props> = ({ onStart }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/stations")
      .then((res) => res.json())
      .then((data) => setStations(data))
      .catch(() => setError("❌ Không thể tải danh sách trụ."));
  }, []);

  const handleSubmit = async () => {
    const station = stations.find((s) => s.id === selectedId);
    if (!station) return;

    try {
      const res = await fetch("http://localhost:3000/stations/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: station.name, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        localStorage.setItem("station", JSON.stringify(data.station));
        onStart();
        navigate("/login");
      } else {
        setError(data.error || "❌ Xác thực thất bại.");
      }
    } catch {
      setError("⚠️ Có lỗi xảy ra khi gửi yêu cầu.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
      <div className="bg-gray-900 border border-green-700 p-6 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center tracking-wider">💻 Kích hoạt trạm</h2>

        {error && (
          <div className="bg-red-900 text-red-400 px-4 py-2 rounded mb-4 text-sm animate-pulse">
            {error}
          </div>
        )}

        <select
          className="w-full bg-black text-green-400 border border-green-600 px-4 py-2 rounded mb-4 focus:outline-none"
          value={selectedId ?? ""}
          onChange={(e) => setSelectedId(Number(e.target.value))}
        >
          <option value="" disabled>
            -- chọn một trạm --
          </option>
          {stations.map((station) => (
            <option key={station.id} value={station.id}>
              {station.name} - {station.location}
            </option>
          ))}
        </select>

        <input
          type="password"
          placeholder="🔐 mật khẩu trạm"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black text-green-300 border border-green-600 px-4 py-2 rounded mb-4 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={!selectedId || !password}
          className="w-full bg-green-600 hover:bg-green-700 text-black font-bold py-2 rounded transition"
        >
          🚀 KÍCH HOẠT
        </button>
      </div>
    </div>
  );
};

export default StationSelector;
