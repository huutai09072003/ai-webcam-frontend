import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="text-gray-800">
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4">
          ♻ AI Vì Môi Trường
        </h1>
        <p className="text-lg md:text-xl mb-8 text-gray-600">
          Cùng khám phá cách AI giúp phân loại rác, nâng cao nhận thức và xây dựng hành tinh xanh hơn.
        </p>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <Link
            to="/ai-demo"
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded shadow"
          >
            Bắt đầu AI Demo
          </Link>
          <Link
            to="/study"
            className="border border-green-600 text-green-700 hover:bg-green-50 font-medium px-6 py-3 rounded"
          >
            Học cách phân loại rác
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-10 text-left">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-2">📷 AI Camera</h3>
            <p>Trải nghiệm phân loại rác qua webcam thời gian thực bằng trí tuệ nhân tạo.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-2">🧠 Kiến Thức Môi Trường</h3>
            <p>Học về quy trình tái chế, vật liệu và cách sống xanh qua bài viết & quiz tương tác.</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-green-600 mb-2">🚀 Công Nghệ Xanh</h3>
            <p>Khám phá mô hình AI, cảm biến và ứng dụng thực tế trong xử lý rác thông minh.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
