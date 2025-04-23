import React from "react";
import axios from "axios";

interface ResultModalProps {
  result: string | null;
  onClose: () => void;
  onLogout: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({
  result,
  onClose,
  onLogout,
}) => {
  const isSuccess = result && result !== "Unknown";

  const handleLogout = async () => {
    try {
      await axios.delete("http://localhost:3000/users/sign_out", {
        withCredentials: true,
        headers: {
          Accept: "application/json",
        },
      });
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    } finally {
      localStorage.removeItem("user");
      onLogout();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-xl p-6 shadow-xl text-center w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
          {isSuccess ? "🎉 Đã lưu thành công!" : "🤔 Không nhận diện được"}
        </h2>

        <p className="text-gray-600 mb-6">
          {isSuccess
            ? `Phân loại: ${result}`
            : "Vui lòng thử lại với ảnh rõ hơn."}
        </p>

        <div className="flex justify-between gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full w-full"
          >
            🚪 Đăng xuất
          </button>
          <button
            onClick={onClose}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full w-full"
          >
            ✅ Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
