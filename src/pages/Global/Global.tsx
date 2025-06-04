import './index.scss';

import React, { useState } from 'react';

// Interface cho dữ liệu biểu đồ
interface ChartData {
  title: string;
  description: string;
  iframe: string;
}

// Danh sách biểu đồ (cố định)
const charts: ChartData[] = [
  {
    title: 'Chất thải nguy hại bình quân đầu người',
    description: 'Chất thải nguy hại là chất thải có đặc tính khiến chúng trở nên nguy hiểm hoặc có khả năng gây tác động có hại đến sức khỏe con người hoặc môi trường. Chúng bao gồm từ chất thải trong quá trình sản xuất công nghiệp đến các mặt hàng gia dụng như pin, thuốc trừ sâu và hóa chất tẩy rửa. Số liệu thống kê cho thấy sự khác biệt đáng kể giữa các quốc gia, phản ánh các mức độ công nghiệp hóa khác nhau, cũng như các phương pháp quản lý và báo cáo chất thải khác nhau.',
    iframe: 'https://ourworldindata.org/grapher/hazardous-waste-generated-per-capita?region=Asia&tab=map'
  },
  {
    title: 'Chất thải thực phẩm bình quân đầu người',
    description: 'Biểu đồ hiển thị lượng chất thải thực phẩm bình quân đầu người trên toàn cầu. Chất thải thực phẩm là một vấn đề môi trường và kinh tế nghiêm trọng, đóng góp vào phát thải khí nhà kính và lãng phí tài nguyên. Ở các nước phát triển, phần lớn chất thải thực phẩm xảy ra ở cấp độ người tiêu dùng, trong khi ở các nước đang phát triển, phần lớn xảy ra trong quá trình thu hoạch, vận chuyển và lưu trữ. Việc giảm chất thải thực phẩm là mục tiêu quan trọng trong các Mục tiêu Phát triển Bền vững của Liên Hợp Quốc.',
    iframe: 'https://ourworldindata.org/grapher/food-waste-per-capita?tab=chart'
  },
  {
    title: 'Tỷ lệ chất thải đô thị được tái chế',
    description: 'Biểu đồ hiển thị tỷ lệ chất thải đô thị được tái chế ở các quốc gia. Tái chế chất thải đô thị là một chỉ số quan trọng về tính bền vững của một quốc gia và cam kết đối với kinh tế tuần hoàn. Các quốc gia có tỷ lệ tái chế cao thường có hệ thống thu gom chất thải phát triển, công nghệ xử lý tiên tiến và nhận thức cao của người dân về tầm quan trọng của việc tái chế. Sự khác biệt giữa các quốc gia cũng phản ánh các chính sách, khung pháp lý và đầu tư vào cơ sở hạ tầng quản lý chất thải.',
    iframe: 'https://ourworldindata.org/grapher/municipal-waste-recycled?tab=map'
  },
  {
    title: 'Tỷ lệ tái chế thủy tinh',
    description: 'Biểu đồ này hiển thị tỷ lệ tái chế thủy tinh ở các quốc gia. Thủy tinh là một trong những vật liệu có thể tái chế vô hạn lần mà không bị suy giảm chất lượng. Quá trình tái chế thủy tinh tiêu thụ ít năng lượng hơn đáng kể so với sản xuất thủy tinh mới, giúp giảm phát thải CO2 và bảo tồn nguyên liệu thô. Các quốc gia có tỷ lệ tái chế thủy tinh cao thường có hệ thống đặt cọc-hoàn trả hiệu quả, quy định về trách nhiệm mở rộng của nhà sản xuất và cơ sở hạ tầng phân loại chất thải phát triển.',
    iframe: 'https://ourworldindata.org/grapher/recycling-rates-glass?tab=map'
  },
  {
    title: 'Tỷ lệ tái chế giấy và bìa cứng',
    description: 'Biểu đồ hiển thị tỷ lệ tái chế giấy và bìa cứng ở các quốc gia. Tái chế giấy và bìa cứng có tầm quan trọng đặc biệt trong việc giảm chặt phá rừng, tiết kiệm năng lượng và giảm lượng chất thải chôn lấp. Mỗi tấn giấy tái chế có thể tiết kiệm khoảng 17 cây, 7.000 gallon nước và 4.100 kWh điện. Các yếu tố ảnh hưởng đến tỷ lệ tái chế bao gồm nhận thức của người tiêu dùng, cơ sở hạ tầng thu gom, công nghệ phân loại và nhu cầu thị trường đối với các sản phẩm giấy tái chế.',
    iframe: 'https://ourworldindata.org/grapher/recycling-rates-paper-and-cardboard?tab=map'
  },
];

const Global: React.FC = () => {
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  
  const goToNextChart = () => {
    setCurrentChartIndex((prevIndex) => 
      prevIndex === charts.length - 1 ? 0 : prevIndex + 1
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const goToPrevChart = () => {
    setCurrentChartIndex((prevIndex) => 
      prevIndex === 0 ? charts.length - 1 : prevIndex - 1
    );
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentChart = charts[currentChartIndex];

  return (
    <div className="global-container max-w-7xl mx-auto px-4 py-12">
      <div className="chart-section mb-16 pb-8 border-b border-gray-200">
        <h2 className="text-3xl font-bold text-green-700 text-center mb-6 font-sans">
          {currentChart.title}
        </h2>

        <div className={`content grid grid-cols-3 gap-8 p-6 rounded-xl ${
          currentChartIndex % 2 === 0 ? 'description-left' : 'description-right'
        }`}>
          <div className="analysis col-span-1 bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
            <h3 className="text-xl font-semibold text-green-700 mb-3 border-b pb-2">Tóm tắt</h3>
            <p className="text-lg leading-relaxed text-gray-700 mb-4">{currentChart.description}</p>
            <div className="flex items-center mt-4 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm italic">Nguồn: Our World in Data</span>
            </div>
          </div>

          <div className="iframe-container col-span-2 rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={currentChart.iframe}
              loading="lazy"
              className="w-full h-[600px] border-0"
              allow="web-share; clipboard-write"
              title={currentChart.title}
            />
          </div>
        </div>
        
        <div className="navigation flex justify-between mt-8 px-4">
          <button 
            onClick={goToPrevChart}
            className="prev-button bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center shadow-md transition-all duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Biểu đồ trước
          </button>
          
          <div className="chart-indicator flex items-center">
            {charts.map((_, index) => (
              <span 
                key={index} 
                className={`h-3 w-3 mx-1 rounded-full ${currentChartIndex === index ? 'bg-green-600' : 'bg-gray-300'}`}
                onClick={() => {
                  setCurrentChartIndex(index);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          
          <button 
            onClick={goToNextChart}
            className="next-button bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center shadow-md transition-all duration-300"
          >
            Biểu đồ kế tiếp
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="upcoming-notice mt-8 text-center p-6 bg-green-50 rounded-xl shadow-md">
        <div className="flex items-center justify-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-green-700 mb-3">Cập nhật liên tục</h3>
        <p className="text-lg text-gray-700">
          Hệ thống sẽ cập nhật thêm số liệu và biểu đồ mới vào thời gian sớm nhất có thể
        </p>
      </div>
    </div>
  );
};

export default Global;
