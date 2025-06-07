import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

const CoreGame: React.FC = () => {
  const { level } = useParams<{ level: 'easy' | 'medium' | 'hard' }>();
  const [countdown, setCountdown] = useState<number>(3); // Đếm ngược từ 3
  const [gameStarted, setGameStarted] = useState(false); // Kiểm tra khi game bắt đầu
  const [draggedImage, setDraggedImage] = useState<string | null>(null); // Ảnh đã được kéo
  const [correctCount, setCorrectCount] = useState<number>(0); // Số lượng phân loại đúng
  const navigate = useNavigate();

  const trashBins = ['METAL', 'PAPER', 'GLASS', 'PLASTIC', 'BIODEGRADABLE', 'CARDBOARD']; // Các loại thùng rác
  const imagesToClassify = ['image1.jpg', 'image2.jpg', 'image3.jpg', 'image4.jpg']; // Các ảnh cần phân loại (có thể được thay bằng ảnh thực tế từ backend)

  // Xử lý đếm ngược
  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);

      if (countdown === 0) {
        clearInterval(timer);
        setGameStarted(true); // Trò chơi bắt đầu khi đếm ngược xong
      }

      return () => clearInterval(timer); // Cleanup interval khi component unmount hoặc countdown thay đổi
    }
  }, [countdown]);

  // Hàm kiểm tra phân loại đúng/sai
  const handleDrop = (image: string, bin: string) => {
    // Giả sử bạn có logic để kiểm tra xem ảnh đã được phân loại đúng chưa
    if (image === bin) {
      setCorrectCount(prev => prev + 1);
      alert('Bạn đã phân loại đúng!');
    } else {
      alert('Bạn phân loại sai! Hãy thử lại.');
    }
  };

  // Chuyển sang trang kết quả sau khi hoàn thành trò chơi
  const handleFinishGame = () => {
    alert(`Trò chơi kết thúc! Bạn đã phân loại đúng ${correctCount} trong tổng số ${imagesToClassify.length} ảnh.`);
    navigate('/game-completed');
  };

  return (
    <div className="container mx-auto p-6 bg-green-50 min-h-screen">
      {/* Phần đếm ngược */}
      {!gameStarted ? (
        <div className="text-center">
          <h2 className="text-4xl font-bold text-green-700">{countdown}</h2>
          <p className="text-xl text-gray-700 mt-4">Trò chơi sẽ bắt đầu sau...</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold text-green-700 mb-4">Mức độ: {level}</h2>

          {/* Phần phân loại */}
          <div className="grid grid-cols-3 gap-6">
            {trashBins.map((bin) => (
              <div key={bin} className="border-4 border-gray-300 p-4 rounded-lg text-center">
                <h3 className="font-semibold text-lg text-gray-700">{bin}</h3>
                <div
                  className="border-2 border-dashed border-gray-400 h-40 flex justify-center items-center"
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedImage) {
                      handleDrop(draggedImage, bin);
                    }
                  }}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {draggedImage ? <img src={draggedImage} alt="Dragged" className="w-20 h-20 object-contain" /> : <p>Kéo ảnh vào đây</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Các ảnh cần phân loại */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {imagesToClassify.map((image, index) => (
              <div key={index} className="cursor-pointer border p-2 rounded-lg hover:shadow-md" onDragStart={() => setDraggedImage(image)} draggable>
                <img src={image} alt={`Ảnh ${index + 1}`} className="w-full h-32 object-cover" />
              </div>
            ))}
          </div>

          {/* Kết thúc trò chơi */}
          <button
            onClick={handleFinishGame}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Kết thúc trò chơi
          </button>
        </div>
      )}
    </div>
  );
};

export default CoreGame;
