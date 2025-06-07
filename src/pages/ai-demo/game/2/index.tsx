import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../../../config/api';

interface GameData {
  id: number;
  name: string;
  description: string;
  featured_image_url?: string;
}

const Game2: React.FC = () => {
  const [game, setGame] = useState<GameData | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<'easy' | 'medium' | 'hard' | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/games/2`);
        const data = await res.json();
        setGame(data);
      } catch (err) {
        console.error('Lỗi khi tải game:', err);
      }
    };
    fetchGame();
  }, []);

  const handleLevelChange = (level: 'easy' | 'medium' | 'hard') => {
    setSelectedLevel(level);
  };

  const handleStart = () => {
    if (selectedLevel) {
      // Chuyển hướng đến trang coreGame với mức độ
      navigate(`/ai-demo/game/2/coregame/${selectedLevel}`);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-green-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-700">{game?.name}</h1>
        <p className="text-gray-700 max-w-2xl mx-auto mt-2">{game?.description}</p>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-xl font-semibold text-green-700 mb-4">Chọn mức độ:</h2>
        <div className="flex justify-center gap-6">
          <button
            onClick={() => handleLevelChange('easy')}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${
              selectedLevel === 'easy' ? 'bg-green-600' : 'bg-gray-400'
            }`}
          >
            Dễ
          </button>
          <button
            onClick={() => handleLevelChange('medium')}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${
              selectedLevel === 'medium' ? 'bg-green-600' : 'bg-gray-400'
            }`}
          >
            Trung Bình
          </button>
          <button
            onClick={() => handleLevelChange('hard')}
            className={`px-6 py-2 rounded-lg text-white font-semibold ${
              selectedLevel === 'hard' ? 'bg-green-600' : 'bg-gray-400'
            }`}
          >
            Khó
          </button>
        </div>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={handleStart}
          disabled={!selectedLevel}
          className={`px-6 py-2 rounded-lg text-white font-semibold ${
            selectedLevel ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Sẵn sàng
        </button>
      </div>
    </div>
  );
};

export default Game2;
