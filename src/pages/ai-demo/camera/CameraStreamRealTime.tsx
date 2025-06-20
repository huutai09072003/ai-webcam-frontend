import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

const CameraStreamRealTime: React.FC = () => {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [detectionResults, setDetectionResults] = useState<any[]>([]);

  const startCamera = () => {
    const ws = new WebSocket('ws://localhost:8000/ws');
    ws.onopen = () => {
      console.log('✅ WebSocket connected');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setDetectionResults(data);
      } catch {
        console.warn('Invalid detection message:', event.data);
      }
    };

    ws.onclose = () => {
      console.log('🛑 WebSocket closed');
    };

    socketRef.current = ws;

    if (imgRef.current) {
      imgRef.current.src = `http://localhost:8000/video-feed?${Date.now()}`;
      setIsCameraOn(true);
    }
  };

  const stopCamera = () => {
    if (imgRef.current) {
      imgRef.current.src = '';
    }

    setIsCameraOn(false);
    setDetectionResults([]);

    if (socketRef.current) {
      socketRef.current.send('stop'); // gửi yêu cầu tắt
      socketRef.current.close(); // đóng luôn websocket
      socketRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopCamera(); // đảm bảo cleanup khi rời component
    };
  }, []);

  return (
    <div className="text-center p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        📷 Nhận diện rác thời gian thực
      </h1>

      <div className="mb-4 flex justify-center gap-2">
        <button
          onClick={startCamera}
          disabled={isCameraOn}
          className={`px-4 py-2 rounded ${isCameraOn ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600 text-white'}`}
        >
          Bắt đầu
        </button>
        <button
          onClick={stopCamera}
          disabled={!isCameraOn}
          className={`px-4 py-2 rounded ${!isCameraOn ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600 text-white'}`}
        >
          Kết thúc
        </button>
      </div>

      <div className="relative flex justify-center">
        <img
          ref={imgRef}
          alt="AI camera feed"
          width={640}
          height={480}
          className={`rounded shadow max-w-full border border-green-300 ${isCameraOn ? '' : 'hidden'}`}
        />
      </div>

      {isCameraOn && detectionResults.length > 0 && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-green-700">Kết quả nhận diện:</h2>
          <ul className="text-sm text-left">
            {detectionResults.map((res, idx) => (
              <li key={idx}>
                {res.label}: {(res.confidence * 100).toFixed(0)}% tại [{res.box.join(', ')}]
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CameraStreamRealTime;
