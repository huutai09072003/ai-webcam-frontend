import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../../../config/api';

interface GameData {
  id: number;
  name: string;
  featured_image_url: string;
}

const GameList: React.FC = () => {
  const [games, setGames] = useState<GameData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/games`);
        const data = await res.json();
        setGames(data);
      } catch (err) {
        console.error('Lỗi khi tải games:', err);
      }
    };
    fetchGames();
  }, []);

  return (
    <div className="container mx-auto p-6 bg-green-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-10 text-center text-green-700">
        🌿 Danh Sách Trò Chơi
      </h1>

      <div className="flex flex-col gap-8 max-w-3xl mx-auto">
        {games.map((game) => (
          <div
            key={game.id}
            onClick={() => navigate(`/ai-demo/game/${game.id}`)}
            className="cursor-pointer bg-white shadow hover:shadow-md transition-all border rounded-lg overflow-hidden"
          >
            {game.id && (
              <div className="w-full bg-gray-100 flex justify-center items-center" style={{ minHeight: '300px' }}>
                <img
                  src={`/src/assets/game${game.id}thumnail.png`}
                  alt={game.name}
                  className="max-h-[300px] w-full object-contain"
                />
              </div>
            )}
            <div className="p-4 text-center">
              <h2 className="text-2xl font-semibold text-green-700">{game.name}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameList;
