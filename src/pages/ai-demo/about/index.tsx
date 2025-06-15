import './about.scss';
import 'react-lazy-load-image-component/src/effects/blur.css';

import React from 'react';

import { motion } from 'framer-motion';
import {
  FaBrain,
  FaCamera,
  FaLeaf,
  FaRecycle,
  FaRocket,
} from 'react-icons/fa';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import AboutTestSection from './testSection';

const About: React.FC = () => {
  return (
    <div className="about-ai-container space-y-12 text-gray-800 px-4 md:px-10 lg:px-20 py-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8 shadow-lg"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 mb-4 flex items-center justify-center">
          <FaRecycle className="mr-2 text-green-600" /> AI Rác thải – Tương lai tái chế thông minh
        </h1>
        <p className="text-lg leading-relaxed max-w-3xl mx-auto">
          Dự án kết hợp <strong>trí tuệ nhân tạo</strong> với giáo dục môi trường, giúp <strong>học sinh, sinh viên</strong> học phân loại rác qua <strong>trải nghiệm thực tế</strong>. Hệ thống AI nhận diện rác qua camera, mang đến trải nghiệm trực quan, xây dựng <strong>ý thức phân loại rác đúng cách</strong> từ sớm.
        </p>
        <LazyLoadImage
          src="https://images.unsplash.com/photo-1628510011657-8ddfd787d0db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          alt="AI-powered recycling system"
          effect="blur"
          className="mt-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto"
        />
      </motion.section>

      {/* How AI Works */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-3 flex items-center">
          <FaBrain className="mr-2" /> AI hoạt động như thế nào?
        </h2>
        <p className="text-base mb-4">
          Hệ thống sử dụng công nghệ AI tiên tiến để nhận diện và phân loại rác thải một cách chính xác:
        </p>
        <ul className="list-none space-y-3 text-base">
          <li className="flex items-start">
            <FaCamera className="text-green-600 mr-2 mt-1" />
            Sử dụng mô hình <code className="bg-gray-100 px-1 rounded">YOLOv11</code> được huấn luyện trên bộ dữ liệu rác thải đa dạng (nhựa, giấy, kim loại, hữu cơ).
          </li>
          <li className="flex items-start">
            <FaCamera className="text-green-600 mr-2 mt-1" />
            Phân tích hình ảnh trực tiếp từ camera, chỉ kích hoạt nhận diện khi khung hình ổn định.
          </li>
          <li className="flex items-start">
            <FaCamera className="text-green-600 mr-2 mt-1" />
            <>
              Hiển thị bounding box với nhãn loại rác và độ chính xác.
            </>
          </li>
          <li className="flex items-start">
            <FaCamera className="text-green-600 mr-2 mt-1" />
            Tích hợp chế độ học tập tương tác để kiểm tra kiến thức phân loại.
          </li>
        </ul>
        <LazyLoadImage
          src="https://images.unsplash.com/photo-1516321318423-24c44a6e64c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="AI camera detecting waste"
          effect="blur"
          className="mt-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-3 flex items-center">
          <FaBrain className="mr-2" /> Quy trình huấn luyện AI
        </h2>
        <p className="text-base mb-4">
          Mô hình AI được huấn luyện qua quy trình nghiêm ngặt để đảm bảo độ chính xác:
        </p>
        <ul className="list-none space-y-3 text-base">
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Thu thập bộ dữ liệu với hàng ngàn hình ảnh rác thải ở nhiều điều kiện.
          </li>
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Gán nhãn thủ công bởi các chuyên gia để đảm bảo tính chính xác.
          </li>
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Huấn luyện trên GPU với hàng trăm epoch để tối ưu hóa mô hình.
          </li>
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Đánh giá trên bộ dữ liệu thử nghiệm để cải thiện hiệu suất.
          </li>
        </ul>
        <LazyLoadImage
          src="https://images.unsplash.com/photo-1516321165247-7b368e2b4e1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="AI training process visualization"
          effect="blur"
          className="mt-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        />
      </motion.section>

      {/* Education & Social Impact */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-3 flex items-center">
          <FaLeaf className="mr-2" /> Giáo dục & Tác động xã hội
        </h2>
        <p className="text-base mb-4">
          Dự án mang công nghệ AI đến giáo dục, tạo tác động tích cực đến cộng đồng:
        </p>
        <ul className="list-none space-y-3">
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Tích hợp AI vào giáo dục, giúp học sinh trải nghiệm thực tế.
          </li>
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Nâng cao ý thức phân loại rác, giảm thiểu ô nhiễm môi trường.
          </li>
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Khuyến khích lối sống xanh qua các hoạt động tương tác.
          </li>
          <li className="flex items-start">
            <FaLeaf className="text-green-600 mr-2 mt-1" />
            Tạo nền tảng cho các sáng kiến cộng đồng về tái chế.
          </li>
        </ul>
      </motion.section>

      {/* Vision & Development */}
      <motion.section
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-3 flex items-center">
          <FaRocket className="mr-2" /> Tầm nhìn & Phát triển
        </h2>
        <p className="text-base mb-4">
          Chúng tôi hướng tới mở rộng ứng dụng AI trong tái chế và bảo vệ môi trường:
        </p>
        <ul className="list-none space-y-3">
          <li className="flex items-start">
            <FaRocket className="text-green-600 mr-2 mt-1" />
            Tối ưu hóa AI với transfer learning và active learning.
          </li>
          <li className="flex items-start">
            <FaRocket className="text-green-600 mr-2 mt-1" />
            Tích hợp vào kiosk trường học, thùng rác thông minh, hoặc robot phân loại.
          </li>
          <li className="flex items-start">
            <FaRocket className="text-green-600 mr-2 mt-1" />
            Ứng dụng trong công nghiệp và nông nghiệp để quản lý chất thải.
          </li>
          <li className="flex items-start">
            <FaRocket className="text-green-600 mr-2 mt-1" />
            Phát triển hệ thống phản hồi để cải thiện mô hình AI.
          </li>
        </ul>
        <p className="mt-4 italic text-sm text-gray-600">
          AI là công cụ để xây dựng một tương lai bền vững hơn.
        </p>
      </motion.section>

      {/* Gallery Section */}
      {/* <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-3 flex items-center">
          <FaGlobe className="mr-2" /> Hành trình của chúng tôi
        </h2>
        <p className="text-base mb-4">
          Xem những khoảnh khắc nổi bật trong hành trình ứng dụng AI vào tái chế và giáo dục:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative group">
            <LazyLoadImage
              src="https://images.unsplash.com/photo-1581091877018-4b6e3f297e7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Students using AI recycling system"
              effect="blur"
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 flex items-center justify-center">
              <p className="text-white text-sm opacity-0 group-hover:opacity-100">Học sinh trải nghiệm AI</p>
            </div>
          </div>
          <div className="relative group">
            <LazyLoadImage
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Smart recycling bin"
              effect="blur"
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 flex items-center justify-center">
              <p className="text-white text-sm opacity-0 group-hover:opacity-100">Thùng rác thông minh</p>
            </div>
          </div>
          <div className="relative group">
            <LazyLoadImage
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="AI in environmental education"
              effect="blur"
              className="rounded-lg shadow-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition duration-300 flex items-center justify-center">
              <p className="text-white text-sm opacity-0 group-hover:opacity-100">Giáo dục môi trường</p>
            </div>
          </div>
        </div>
      </motion.section> */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-green-600 mb-3 flex items-center">
          <FaCamera className="mr-2" /> Demo tương tác
        </h2>
        <p className="mb-4 text-base">
          Trải nghiệm công nghệ AI tại mục <strong>Camera AI</strong>:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-base">
          <li>Mở camera trên thiết bị của bạn.</li>
          <li>Đưa một vật phẩm rác trước ống kính.</li>
          <li>Chờ 1–2 giây để hệ thống phân tích.</li>
          <li>Xem kết quả phân loại với nhãn và độ chính xác.</li>
        </ol>
        <LazyLoadImage
          src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
          alt="Interactive AI demo"
          effect="blur"
          className="mt-6 rounded-lg shadow-lg w-full max-w-md mx-auto"
        />
        <AboutTestSection />
      </motion.section>
    </div>
  );
};

export default About;