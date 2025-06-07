import React, {
  useRef,
  useState,
} from 'react';

const CameraStream: React.FC = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  const startCamera = () => {
    if (imgRef.current) {
      imgRef.current.src = "http://localhost:8000/video-feed";
      setIsCameraOn(true);
    }
  };

  const stopCamera = () => {
    if (imgRef.current) {
      imgRef.current.src = "";
      setIsCameraOn(false);
    }
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">📷 Nhận diện rác thời gian thực</h1>
      <div className="mb-4">
        <button
          onClick={startCamera}
          disabled={isCameraOn}
          className={`px-4 py-2 mr-2 rounded ${
            isCameraOn ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          Bắt đầu
        </button>
        <button
          onClick={stopCamera}
          disabled={!isCameraOn}
          className={`px-4 py-2 rounded ${
            !isCameraOn ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          Kết thúc
        </button>
      </div>
      <div className="relative flex justify-center">
        <img
          ref={imgRef}
          alt="AI camera feed"
          className={`rounded shadow max-w-full border border-green-300 ${
        isCameraOn ? "" : "hidden"
          }`}
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
        {isCameraOn ? "Luồng camera đang chạy." : "Nhấn 'Bắt đầu' để xem luồng camera."}
      </p>
    </div>
  );
};

export default CameraStream;