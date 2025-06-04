import './index.scss';

import { Link } from 'react-router-dom';

const AIDemoIndex = () => {
  const modules = [
    {
      title: '♻️ Giới thiệu AI Rác thải',
      description: 'Tìm hiểu vai trò của trí tuệ nhân tạo trong việc nhận diện và phân loại rác, góp phần bảo vệ môi trường.',
      path: 'about',
    },
    {
      title: '📷 Camera thông minh',
      description: 'Trải nghiệm trực tiếp tính năng camera giúp nhận diện vật thể rác thải trong thời gian thực.',
      path: 'camera',
    },
    {
      title: '🎮 Trò chơi học rác',
      description: 'Thử thách vui nhộn giúp bạn phân biệt rác đúng cách thông qua trò chơi tương tác AI.',
      path: 'games',
    },
  ];

  return (
    <div className="ai-demo-index container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
        🤖 AI & Rác thải - Trải nghiệm tương tác
      </h1>
      <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
        Khám phá các ứng dụng của trí tuệ nhân tạo (AI) trong việc phân loại, theo dõi và giáo dục về rác thải – vì một hành tinh xanh hơn 🌍.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link
            to={module.path}
            key={module.path}
            className="block p-6 rounded-lg shadow bg-white hover:shadow-md transition hover:-translate-y-1 border border-green-100 section-card"
          >
            <h2 className="text-xl font-semibold text-green-800 mb-2">{module.title}</h2>
            <p className="text-gray-700 text-sm">{module.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AIDemoIndex;
