import React from "react";

interface Station {
  id: number;
  name: string;
  location: string;
}

interface Props {
  station: Station;
  onUserLogout?: () => void;
  onStationLogout?: () => void;
  showUserLogout?: boolean;
  showStationLogout?: boolean;
}

const AppHeader: React.FC<Props> = ({
  station,
  onUserLogout,
  onStationLogout,
  showUserLogout = true,
  showStationLogout = true,
}) => {
  return (
    <header className="w-full px-6 flex justify-between items-center py-4 bg-white shadow-md">
      <div>
        <h1 className="text-2xl font-bold text-green-700">♻️ Nhận diện phế liệu</h1>
        <p className="text-sm text-gray-600">
          Trụ: <strong>{station.name}</strong> ({station.location})
        </p>
      </div>

      <div className="flex gap-2">
        {showUserLogout && onUserLogout && (
          <button
            onClick={onUserLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full"
          >
            👤 Đăng xuất người dùng
          </button>
        )}
        {showStationLogout && onStationLogout && (
          <button
            onClick={onStationLogout}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-full"
          >
            🏁 Đăng xuất trạm
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
