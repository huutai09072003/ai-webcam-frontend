import './home.scss';

import {
  useEffect,
  useState,
} from 'react';

import axios from 'axios';
import { motion } from 'framer-motion';
import {
  FaBook,
  FaBullhorn,
  FaChartLine,
  FaHandHoldingHeart,
  FaNewspaper,
  FaRecycle,
} from 'react-icons/fa';
import { Parallax } from 'react-parallax';
import { Link } from 'react-router-dom';

const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL;

interface Blogger {
  id: number;
  name: string;
  avatar_url: string;
}

interface Blog {
  id: number;
  title: string;
  thumb_nail_url?: string;
  blogger: Blogger;
}

interface Campaign {
  id: number;
  title: string;
  location: string;
  thumb_nail_url?: string;
  description: string;
  goal: string;
}

interface Item {
  id: number;
  name: string;
  description: string;
  image_url: string;
}

interface Donation {
  id: number;
  full_name: string;
  amount: number;
  currency: string;
  frequency: string;
  created_at: string;
}

const statChart = {
  title: 'Chất thải nguy hại bình quân đầu người',
  description:
    'Chất thải nguy hại là chất thải có đặc tính khiến chúng trở nên nguy hiểm hoặc có khả năng gây tác động có hại đến sức khỏe con người hoặc môi trường. Chúng bao gồm từ chất thải trong quá trình sản xuất công nghiệp đến các mặt hàng gia dụng như pin, thuốc trừ sâu và hóa chất tẩy rửa. Số liệu thống kê cho thấy sự khác biệt đáng kể giữa các quốc gia, phản ánh các mức độ công nghiệp hóa khác nhau, cũng như các phương pháp quản lý và báo cáo chất thải khác nhau.',
  iframe: 'https://ourworldindata.org/grapher/hazardous-waste-generated-per-capita?region=Asia&tab=map',
};

const Home: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/blogs`).then((res) => setBlogs(res.data.slice(0, 3)));
    axios.get(`${API_BASE_URL}/campaigns`).then((res) => setCampaigns(res.data.slice(0, 3)));
    axios.get(`${API_BASE_URL}/items`, { params: { per_page: 8 } }).then((res) => setItems(res.data.items));
    axios.get(`${API_BASE_URL}/donations`).then((res) => setDonations(res.data.slice(0, 5)));
  }, []);

  return (
    <section className="home-wrapper text-gray-900">
      <Parallax bgImage="https://scdi.org.vn/upload/images/6.%20Tin%20t%E1%BB%A9c/Tin%20t%E1%BB%A9c%20CHUNG/Ho%E1%BA%A1t%20%C4%91%E1%BB%99ng%20c%E1%BB%A7a%20SCDI/b%E1%BA%A3n%20tin%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng/B%E1%BA%A3n%20tin%20m%C3%B4i%20tr%C6%B0%E1%BB%9Dng%20Thumbnail.png" strength={300}>
        <div className="container mx-auto max-w-7xl px-4 py-16">
          <motion.header
            className="text-center mb-12"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-4 flex items-center justify-center gap-2">
              <FaRecycle /> AI Vì Môi Trường
            </h1>
            <p className="text-lg text-n-600 max-w-2xl mx-auto">
              Cùng khám phá cách AI giúp phân loại rác, nâng cao nhận thức và xây dựng hành tinh xanh hơn.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
              <Link to="/ai-demo" className="btn btn-primary flex items-center gap-2">
                <FaRecycle /> Bắt đầu AI Demo
              </Link>
              <Link to="/recyclepedia" className="btn btn-outline flex items-center gap-2">
                <FaBook /> Từ điển rác thải
              </Link>
            </div>
          </motion.header>
        </div>
      </Parallax>

      <div className="container mx-auto max-w-7xl px-4 py-12 flex flex-col md:flex-row gap-6">
        <div className="md:w-5/6">
          <motion.section
            className="card mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h2 className="card-title flex items-center gap-2">
              <FaBook /> Từ điển rác thải
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="rounded overflow-hidden shadow hover:shadow-lg bg-white text-center p-3"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded mb-3"
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                  <p className="font-medium text-green-700 text-sm hover:underline cursor-pointer">
                    {item.name}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/recyclepedia" className="link flex items-center gap-2 justify-center">
                <FaBook /> Xem tất cả mục
              </Link>
            </div>
          </motion.section>

          <motion.section
            className="card mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="card-title flex items-center gap-2">
              <FaNewspaper /> Bài viết mới
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  className="bg-white rounded shadow hover:shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {blog.thumb_nail_url && (
                    <img
                      src={blog.thumb_nail_url}
                      alt={blog.title}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <Link to={`/blogs/${blog.id}`} className="text-green-700 font-semibold block mb-2 hover:underline">
                      {blog.title}
                    </Link>
                    <p className="text-xs text-gray-600">Tác giả: {blog.blogger?.name}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/blogs" className="link flex items-center gap-2 justify-center">
                <FaNewspaper /> Xem thêm bài viết →
              </Link>
            </div>
          </motion.section>

          <motion.section
            className="card mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="card-title flex items-center gap-2">
              <FaBullhorn /> Chiến dịch đang diễn ra
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {campaigns.map((c, index) => (
                <motion.div
                  key={c.id}
                  className="bg-white rounded shadow hover:shadow-lg overflow-hidden"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {c.thumb_nail_url && (
                    <img
                      src={c.thumb_nail_url}
                      alt={c.title}
                      className="w-full h-36 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <Link to={`/campaigns/${c.id}`} className="text-green-700 font-semibold block mb-2 hover:underline">
                      {c.title}
                    </Link>
                    <p className="text-xs text-gray-600">{c.location}</p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">{c.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link to="/campaigns" className="link flex items-center gap-2 justify-center">
                <FaBullhorn /> Xem tất cả chiến dịch →
              </Link>
            </div>
          </motion.section>

          <motion.section
            className="card mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h2 className="card-title text-center flex items-center gap-2 justify-center">
              <FaChartLine /> {statChart.title}
            </h2>
            <div className="flex flex-col gap-6">
              <div className="bg-gray-50 p-4 rounded">
                <p className="text-sm text-gray-700 whitespace-pre-line">{statChart.description}</p>
                <p className="text-xs text-gray-600 italic mt-2">Nguồn: Our World in Data</p>
              </div>
              <div className="w-full">
                <iframe
                  src={statChart.iframe}
                  title="Hazardous Waste Chart"
                  className="w-full h-[500px] rounded border"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </motion.section>
        </div>

        <motion.aside
          className="md:w-1/6 donations-sidebar sticky top-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          <div className="card">
            <h3 className="text-green-700 font-semibold mb-4 text-center flex items-center gap-2 justify-center">
              <FaHandHoldingHeart /> Người ủng hộ công khai
            </h3>
            <ul className="text-sm space-y-3">
              {donations.map((d, index) => (
                <motion.li
                  key={d.id}
                  className="text-gray-700"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 }}
                >
                  <span className="font-medium">• {d.full_name}</span>
                  <span className="block text-xs text-gray-600">{d.amount} {d.currency}</span>
                </motion.li>
              ))}
            </ul>
            <Link to="/donate" className="btn btn-outline btn-sm mt-6 block text-center flex items-center gap-2 justify-center">
              <FaHandHoldingHeart /> Góp sức cùng cộng đồng
            </Link>
          </div>
        </motion.aside>
      </div>
    </section>
  );
};

export default Home;