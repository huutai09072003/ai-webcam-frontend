import React, { useRef, useState } from 'react';

const CameraStream: React.FC = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = () => {
    if (imgRef.current) {
      // Gán URL mới để ép trình duyệt reload stream
      imgRef.current.src = "http://localhost:8000/video_feed?" + Date.now();
      setIsCameraOn(true);
    }
  };

  const stopCamera = async () => {
    if (imgRef.current) {
      imgRef.current.src = ""; // Tắt stream
      setIsCameraOn(false);
    }

    try {
      await fetch("http://localhost:8000/release_camera", { method: "POST" });
    } catch (err) {
      console.error("Không thể release camera:", err);
    }
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">
        📷 Nhận diện rác thời gian thực
      </h1>

      <div className="mb-4 flex flex-row justify-center gap-4 flex-wrap">
        <button
          onClick={startCamera}
          disabled={isCameraOn}
          className={`px-5 py-2 rounded ${
            isCameraOn
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Bắt đầu
        </button>
        <button
          onClick={stopCamera}
          disabled={!isCameraOn}
          className={`px-5 py-2 rounded ${
            !isCameraOn
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Kết thúc
        </button>
      </div>

      <div className="relative flex justify-center">
        <img
          ref={imgRef}
          alt="Luồng camera AI"
          width={640}
          height={480}
          className={`rounded shadow max-w-full border border-green-300 ${isCameraOn ? "" : "hidden"}`}
        />
        {!isCameraOn && (
          <div className="w-[640px] h-[480px] flex items-center justify-center bg-gray-100 rounded border border-green-300">
            <img
              src="https://static.vecteezy.com/system/resources/previews/007/225/019/non_2x/camera-off-icon-ui-interface-vector.jpg"
              alt="Camera Off"
              className="w-32 h-32 opacity-50"
            />
          </div>
        )}
      </div>

      <p className="text-sm text-gray-500 mt-4">
        {isCameraOn
          ? "Luồng camera đang chạy."
          : "Nhấn 'Bắt đầu' để xem luồng camera."}
      </p>
    </div>
  );
};

export default CameraStream;
