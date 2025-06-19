import React, {
  useRef,
  useState,
} from 'react';

const CameraStream: React.FC = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const startCamera = () => {
    if (imgRef.current) {
      imgRef.current.src = "http://localhost:8000/video-feed?" + Date.now();
      setIsCameraOn(true);
      setCapturedImage(null);
    }
  };

  const stopCamera = () => {
    if (imgRef.current) {
      imgRef.current.src = "";
      setIsCameraOn(false);
    }
  };

  const captureImage = async () => {
    stopCamera();
    setIsCapturing(true);
    try {
      const res = await fetch("http://localhost:8000/capture");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setCapturedImage(url);
    } catch {
      alert("Chụp ảnh thất bại!");
    } finally {
      setIsCapturing(false);
    }
  };

  const downloadImage = () => {
    if (!capturedImage) return;
    const link = document.createElement('a');
    link.href = capturedImage;
    link.download = 'captured.jpg';
    link.click();
  };

  const retake = () => {
    setCapturedImage(null);
    setIsCapturing(false);
    startCamera();
  };

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        📷 Nhận diện rác thời gian thực
      </h1>

      {/* Hiển thị trong khi đang tải ảnh chụp */}
      {isCapturing ? (
        <div className="flex flex-col items-center mt-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-500 border-solid mb-4"></div>
          <span className="text-lg font-semibold text-green-700">Đang tải lên ảnh đã chụp...</span>
        </div>
      ) : capturedImage ? (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <span className="block text-green-700 font-semibold text-lg mb-2">🖼 Hình ảnh bạn đã chụp</span>
            <img
              src={capturedImage}
              alt="Ảnh đã chụp"
              width={320}
              height={240}
              className="rounded border shadow mb-2"
            />
            <div className="flex gap-3 mt-3 justify-center">
              <button
                onClick={downloadImage}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Tải về
              </button>
              <button
                onClick={retake}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Chụp lại
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-row justify-center gap-2">
            <button
              onClick={startCamera}
              disabled={isCameraOn}
              className={`px-4 py-2 rounded ${
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
              className={`px-4 py-2 rounded ${
                !isCameraOn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              Kết thúc
            </button>
            <button
              onClick={captureImage}
              disabled={!isCameraOn}
              className={`px-4 py-2 rounded ${
                !isCameraOn
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Chụp ảnh
            </button>
          </div>
          <div className="relative flex justify-center">
            <img
              ref={imgRef}
              alt="AI camera feed"
              width={640}
              height={480}
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
            {isCameraOn
              ? "Luồng camera đang chạy."
              : "Nhấn 'Bắt đầu' để xem luồng camera."}
          </p>
        </>
      )}
    </div>
  );
};

export default CameraStream;
