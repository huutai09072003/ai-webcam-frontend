import React, {
  useRef,
  useState,
} from 'react';

const CameraStreamCapture: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false); // Trạng thái xử lý
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Thông báo lỗi khi không phát hiện nhãn

  const startCamera = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error('Lỗi khi khởi tạo camera:', err));
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (canvasRef.current && videoRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      ctx?.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

      const base64Image = canvasRef.current.toDataURL();
      setCapturedImage(base64Image);
      setIsProcessing(true); // Bắt đầu quá trình xử lý
      setErrorMessage(null); // Reset thông báo lỗi

      sendToBackend(base64Image);
    }
  };

  const sendToBackend = (imageBase64: string) => {
    fetch('http://localhost:8000/analyze-captured-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image_base64: imageBase64 }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Kết quả nhận diện:', data);
        setIsProcessing(false); // Xử lý xong

        // Kiểm tra nếu không phát hiện nhãn nào
        if (data.predictions.length === 0) {
          setErrorMessage('Không phát hiện được bất kỳ loại rác nào.');
        } else {
          setPredictions(data.predictions);
          setCapturedImage(data.image_with_boxes);
        }
      })
      .catch((error) => {
        setIsProcessing(false); // Xử lý xong
        console.error('Lỗi khi gửi ảnh:', error);
        setErrorMessage('Có lỗi xảy ra khi xử lý ảnh.');
      });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">📸 Chụp ảnh và nhận diện</h1>

      <div className="flex justify-between mb-4">
        {/* Camera Section */}
        <div className="w-[48%]">
          <div className="mb-4 flex justify-center gap-2">
            <button onClick={startCamera} className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white">
              Bắt đầu
            </button>
            <button onClick={stopCamera} className="px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white">
              Kết thúc
            </button>
          </div>
          <div className="relative flex justify-center">
            <video ref={videoRef} width="100%" height="auto" autoPlay muted className="border border-green-300 rounded shadow" />
          </div>
          <div className="relative flex justify-center mt-4">
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
            <button
              onClick={captureImage}
              className={`px-4 py-2 mt-2 rounded ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
              disabled={isProcessing}
            >
              {isProcessing ? 'Đang xử lý...' : '📸 Chụp ảnh'}
            </button>
          </div>
        </div>

        {/* Image Results Section */}
        <div className="w-[48%] border-2 border-dashed border-gray-300 p-4 rounded-md">
          <h2 className="text-lg font-semibold text-green-700 mb-2">Kết quả nhận diện (Ảnh đã được xử lý)</h2>

          {/* Hiển thị chú thích */}
          <p className="text-sm text-gray-600 mb-4">
            Đây là khu vực hiển thị kết quả nhận diện của bạn. Ảnh đã được xử lý và các bounding boxes sẽ được hiển thị cùng với các nhãn.
          </p>

          {capturedImage && !errorMessage && (
            <div className="flex justify-center mb-4">
              <img src={capturedImage} alt="Captured" width="100%" height="auto" className="rounded shadow" />
            </div>
          )}

          {/* Hiển thị thông báo lỗi nếu không phát hiện nhãn */}
          {errorMessage && (
            <div className="text-red-600 font-semibold">
              <p>{errorMessage}</p>
            </div>
          )}

          {/* Hiển thị các nhãn và bounding boxes nếu có kết quả */}
          {predictions.length > 0 && !errorMessage && (
            <div className="mt-2">
              <h3 className="text-lg font-semibold text-green-700">Các nhãn và số lượng:</h3>
              <ul className="text-left">
                {predictions.map((prediction, idx) => (
                  <li key={idx} className="text-sm text-gray-700">
                    {prediction.label}: {Math.round(prediction.confidence * 100)}% (Vị trí: {prediction.box.join(', ')})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraStreamCapture;
