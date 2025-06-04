import {
  ChangeEvent,
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../../../config/api';

interface ImageData {
  id: string;
  url: string;
  name?: string;
}

interface GameData {
  id: number;
  name: string;
  images: ImageData[];
  description: string;
  featured_image_url?: string;
}

const Game1: React.FC = () => {
  const [game, setGame] = useState<GameData | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/games/1`);
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error('Lỗi khi tải game:', err);
      }
    };
    fetchGame();
  }, []);

  const handleStart = () => {
    if (selectedImage) {
      navigate(`/ai-demo/game/1/${selectedImage.id}`);
    }
  };

  const uploadFile = async (file: File) => {
    if (!game?.id) return;
    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/games/${game.id}/upload_image`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      setGame(prev => prev ? { ...prev, images: [...prev.images, data] } : prev);
    } catch (err) {
      alert('Lỗi khi tải ảnh lên');
    } finally {
      setUploading(false);
      setModalOpen(false);
    }
  };

  const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleUploadUrl = async () => {
    if (!game?.id) return;
    const url = prompt("Nhập URL hình ảnh:");
    if (!url) return;

    setUploading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/games/${game.id}/upload_image_from_url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setGame(prev => prev ? { ...prev, images: [...prev.images, data] } : prev);
    } catch (err) {
      alert('Lỗi khi tải ảnh từ URL');
    } finally {
      setUploading(false);
      setModalOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-green-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">{game?.name}</h1>
        <p className="text-gray-700 max-w-2xl mx-auto mt-2">{game?.description}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {game?.images.map((img) => (
          <div
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className={`cursor-pointer rounded overflow-hidden border-4 transition-all ${
              selectedImage?.id === img.id ? 'border-green-600' : 'border-transparent'
            }`}
          >
            <img
              src={img.url}
              alt={img.name || img.id}
              className="w-full h-40 object-cover"
            />
            <div className="bg-white text-center py-1 text-sm text-gray-700">
              {img.name || `Ảnh ${img.id}`}
            </div>
          </div>
        ))}

        {/* Nút thêm ảnh */}
        <div
          onClick={() => setModalOpen(true)}
          className="cursor-pointer border-4 border-dashed border-gray-400 flex items-center justify-center rounded h-40"
        >
          <span className="text-4xl text-gray-500">+</span>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleStart}
          disabled={!selectedImage}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${
            selectedImage
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Bắt đầu với hình ảnh này
        </button>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold mb-4">Thêm hình ảnh</h2>

            <label className="block bg-blue-600 text-white py-2 px-4 rounded cursor-pointer mb-3 hover:bg-blue-700">
              {uploading ? 'Đang tải...' : 'Tải từ máy'}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUploadFile}
              />
            </label>

            <button
              onClick={handleUploadUrl}
              disabled={uploading}
              className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 mb-2"
            >
              Nhập URL
            </button>

            <button
              onClick={() => setModalOpen(false)}
              className="text-gray-500 hover:text-gray-700 text-sm mt-2"
            >
              Hủy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Game1;
