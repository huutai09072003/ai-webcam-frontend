import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { useParams } from 'react-router-dom';

import { API_BASE_URL } from '../../../../config/api';

// Thùng rác với màu & icon
const trashBins = [
  {
    name: 'METAL',
    label: 'Kim loại',
    color: 'bg-gray-400 border-gray-400',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="7" y="5" width="10" height="14" rx="3" fill="#9CA3AF" />
        <rect x="9" y="3" width="6" height="2" rx="1" fill="#6B7280" />
      </svg>
    ),
  },
  {
    name: 'PAPER',
    label: 'Giấy',
    color: 'bg-blue-300 border-blue-400',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="6" y="4" width="12" height="16" rx="2" fill="#60A5FA" />
        <rect x="8" y="7" width="8" height="1.5" fill="#DBEAFE" />
        <rect x="8" y="10" width="6" height="1.2" fill="#DBEAFE" />
      </svg>
    ),
  },
  {
    name: 'GLASS',
    label: 'Thủy tinh',
    color: 'bg-green-400 border-green-500',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="10" y="3" width="4" height="7" rx="2" fill="#34D399" />
        <rect x="9" y="10" width="6" height="9" rx="3" fill="#6EE7B7" />
      </svg>
    ),
  },
  {
    name: 'PLASTIC',
    label: 'Nhựa',
    color: 'bg-red-300 border-red-400',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="11" y="2" width="2" height="3" rx="1" fill="#F87171" />
        <rect x="9" y="5" width="6" height="13" rx="3" fill="#FCA5A5" />
      </svg>
    ),
  },
  {
    name: 'BIODEGRADABLE',
    label: 'Hữu cơ',
    color: 'bg-yellow-800 border-yellow-800',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <path d="M5 19C7 12 13 7 19 5C17 11 11 17 5 19Z" fill="#B45309" />
        <path d="M12 14L14 17" stroke="#FDE68A" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: 'CARDBOARD',
    label: 'Các-tông',
    color: 'bg-yellow-300 border-yellow-400',
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="8" width="14" height="8" rx="2" fill="#FBBF24" />
        <rect x="7" y="6" width="10" height="3" rx="1" fill="#FDE68A" />
      </svg>
    ),
  },
];

// Helper: random N ảnh

interface ImageItem {
  id: number;
  url: string;
}
function getRandomImages(arr: ImageItem[], n: number) {
  return [...arr].sort(() => 0.5 - Math.random()).slice(0, n);
}

const API_AI_BASE_URL = "http://localhost:8000";

const CoreGame: React.FC = () => {
  const { level } = useParams<{ level: 'easy' | 'medium' | 'hard' }>();
  // Nếu gameId động: const { gameId } = useParams<{ gameId: string }>();
  const gameId = 2; // Hoặc lấy từ params/router nếu cần

  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [timer, setTimer] = useState(30);

  const [allImages, setAllImages] = useState<ImageItem[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [droppedItems, setDroppedItems] = useState<{ img: ImageItem; selected_bin: string }[]>([]);
  const [gameEnded, setGameEnded] = useState(false);

  const [resultFromBE, setResultFromBE] = useState<null | {
    results: {
      selected_bin: string;
      predicted_bin: string | null;
      is_correct: boolean;
      image_with_boxes: string;
      predictions: any[];
    }[];
    score: { correct: number; incorrect: number; total: number };
  }>(null);

  const [loadingAI, setLoadingAI] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);

  // 1. Lấy ảnh từ backend Rails
  useEffect(() => {
    setLoadingImages(true);
    axios
      .get(`${API_BASE_URL}/games/${gameId}/images`)
      .then((res) => {
        setAllImages(res.data || []);
        setLoadingImages(false);
      })
      .catch(() => {
        setAllImages([]);
        setLoadingImages(false);
      });
  }, [gameId]);

  // 2. Chọn ngẫu nhiên ảnh khi đổi mode (khi allImages thay đổi hoặc mode thay đổi)
  useEffect(() => {
    let num = 4;
    if (level === 'medium') num = 8;
    else if (level === 'hard') num = 12;
    if (allImages.length) {
      const randImages = getRandomImages(allImages, Math.min(num, allImages.length));
      setImages(randImages);
      setDroppedItems([]);
      setGameEnded(false);
      setResultFromBE(null);
      setTimer(30);
      setDraggedIndex(null);
      setCountdown(3);
      setGameStarted(false);
      setLoadingAI(false);
    }
  }, [level, allImages]);

  // 3. Countdown
  useEffect(() => {
    if (countdown > 0) {
      const timerId = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setGameStarted(true);
    }
  }, [countdown]);

  // 4. Timer 30s
  useEffect(() => {
    if (!gameStarted || gameEnded) return;
    if (timer === 0 || images.length === 0) {
      setGameEnded(true);
    }
    if (timer > 0 && images.length > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer, gameStarted, gameEnded, images]);

  // 5. Gửi lên backend khi kết thúc
  useEffect(() => {
    if (gameEnded && droppedItems.length > 0 && !resultFromBE) {
      submitToBackend();
    }
    // eslint-disable-next-line
  }, [gameEnded]);

  function getBase64FromImageUrl(url: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx!.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/png');
        resolve(dataURL);
      };
      img.src = url;
    });
  }

  async function submitToBackend() {
    setLoadingAI(true);
    const items = await Promise.all(
      droppedItems.map(async (item) => ({
        selected_bin: item.selected_bin,
        image_base64: await getBase64FromImageUrl(item.img.url),
      }))
    );
    try {
      const res = await axios.post(`${API_AI_BASE_URL}/game2/submit`, { items });
      setResultFromBE(res.data);
    } catch {
      alert('Lỗi khi gửi dữ liệu lên AI backend!');
    } finally {
      setLoadingAI(false);
    }
  }

  const handleDrop = (binName: string) => {
    if (draggedIndex === null) return;
    const image = images[draggedIndex];
    if (!image) return;
    setDroppedItems((prev) => [...prev, { img: image, selected_bin: binName }]);
    setImages((prev) => prev.filter((_, idx) => idx !== draggedIndex));
    setDraggedIndex(null);
  };

  const handleRestart = () => {
    let num = 4;
    if (level === 'medium') num = 8;
    else if (level === 'hard') num = 12;
    if (allImages.length) {
      const randImages = getRandomImages(allImages, Math.min(num, allImages.length));
      setImages(randImages);
      setDroppedItems([]);
      setGameEnded(false);
      setResultFromBE(null);
      setTimer(30);
      setDraggedIndex(null);
      setCountdown(3);
      setGameStarted(false);
      setLoadingAI(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-green-50 min-h-screen">
      {loadingImages ? (
        <div className="text-center mt-12">
          <svg className="animate-spin h-10 w-10 text-green-600 mb-3 mx-auto" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="#10b981" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <div className="text-green-700 font-semibold text-lg">Đang tải ảnh trò chơi...</div>
        </div>
      ) : !gameStarted ? (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-green-700">{countdown}</h2>
          <p className="text-xl text-gray-700 mt-4">Trò chơi sẽ bắt đầu sau...</p>
        </div>
      ) : (
        <div>
          <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-green-700 mb-2 sm:mb-0">
              Mức độ: {level === 'easy' ? 'Dễ' : level === 'medium' ? 'Trung bình' : 'Khó'}
            </h2>
            <div className="text-lg font-mono flex items-center gap-2">
              <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="2" fill="#D1FAE5" />
                <path d="M12 7v5l4 2" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className={timer <= 5 ? 'text-red-600 font-bold' : 'text-green-700'}>
                {timer}s
              </span>
            </div>
          </div>
          <div className="mb-4 text-gray-600">
            Kéo từng ảnh rác vào đúng thùng phân loại!
            <div>
              <span className="text-green-700 font-semibold">
                Đã thả: {droppedItems.length}/{droppedItems.length + images.length}
              </span>
            </div>
          </div>

          {gameEnded ? (
            <div className="text-center my-8">
              <h3 className="text-2xl font-bold text-green-700 mb-3">⏰ Kết quả trò chơi</h3>
              {loadingAI && (
                <div className="flex flex-col items-center my-10">
                  <svg className="animate-spin h-10 w-10 text-green-600 mb-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="#10b981" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <div className="text-green-700 font-semibold text-lg">Đang chấm điểm bằng AI...</div>
                </div>
              )}
              {resultFromBE && (
                <>
                  <div className="mb-4">
                    <span className="font-semibold text-green-700">Đúng: {resultFromBE.score.correct}</span>
                    &nbsp;&nbsp;
                    <span className="font-semibold text-red-600">Sai: {resultFromBE.score.incorrect}</span>
                  </div>
                  <div className="mb-6">
                    <h4 className="font-semibold text-green-800 mb-2">Kết quả từng ảnh:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {resultFromBE.results.map((item, idx) => (
                        <div
                          key={idx}
                          className={`border p-4 rounded-xl shadow-md ${
                            item.is_correct ? 'border-green-400 bg-green-50' : 'border-red-300 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center mb-2 gap-2">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                item.is_correct ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                              }`}
                            >
                              {item.is_correct ? 'ĐÚNG' : 'SAI'}
                            </span>
                            <span className="text-gray-700 text-sm">
                              <strong>Bạn chọn:</strong> {trashBins.find(tb => tb.name === item.selected_bin)?.label || item.selected_bin}
                            </span>
                            <span className="text-gray-700 text-sm">
                              <strong>AI nhận:</strong>{' '}
                              {item.predicted_bin
                                ? trashBins.find(tb => tb.name === item.predicted_bin)?.label
                                : <span className="text-red-600">Không nhận diện được</span>}
                            </span>
                          </div>
                          <div>
                            <img
                              src={item.image_with_boxes}
                              alt="Kết quả AI"
                              className="w-full rounded"
                              style={{ maxHeight: 200, objectFit: 'contain' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
              <button
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold"
                onClick={handleRestart}
                disabled={loadingAI}
              >
                Chơi lại
              </button>
            </div>
          ) : (
            <>
              {/* 6 thùng rác luôn căn đều, 1 hàng, responsive và căn giữa */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8 w-full max-w-5xl mx-auto">
                {trashBins.map((bin) => (
                  <div
                    key={bin.name}
                    className={`border-4 ${bin.color} p-4 rounded-xl text-center flex flex-col items-center shadow-lg`}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(bin.name)}
                  >
                    <div className="mb-2">{bin.icon}</div>
                    <h3 className="font-bold text-lg text-white drop-shadow-sm mb-1">{bin.label}</h3>
                    <div className="flex-1 w-full flex items-center justify-center">
                      <div className="border-2 border-dashed border-white h-16 w-full rounded bg-white bg-opacity-30 text-emerald-900 flex items-center justify-center">
                        <span className="text-xs font-medium">Kéo vào đây</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Danh sách ảnh: 4 ảnh 1 hàng, responsive */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-4xl mx-auto">
                {images.map((img, idx) => (
                  <div
                    key={img.id}
                    className="cursor-grab border p-2 rounded-lg hover:shadow-lg bg-white transition flex items-center justify-center"
                    draggable
                    onDragStart={() => setDraggedIndex(idx)}
                  >
                    <img src={img.url} alt={`Rác ${idx + 1}`} className="w-full h-28 object-contain" />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CoreGame;
