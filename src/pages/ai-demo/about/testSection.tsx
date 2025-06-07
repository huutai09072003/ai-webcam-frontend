import React, { useState } from 'react';

import axios from 'axios';

// Định nghĩa các nhãn có thể có trong đối tượng advice
type Label = "METAL" | "PAPER" | "GLASS" | "PLASTIC" | "BIODEGRADABLE" | "CARDBOARD";

// Dữ liệu lời khuyên cho mỗi nhãn
const advice: Record<Label, { title: string; description: string; action: string; extraInfo: string }> = {
  METAL: {
    title: "Metal (Kim loại)",
    description: "Kim loại như nhôm, thép có thể tái chế để giảm ô nhiễm và tiết kiệm năng lượng. Hãy chắc chắn rằng bạn đã tách chúng khỏi các vật liệu khác trước khi tái chế.",
    action: "Hãy đưa các vật liệu kim loại như lon nước, vỏ hộp vào thùng tái chế kim loại.",
    extraInfo: "Lưu ý: Kim loại không bị phân hủy tự nhiên, vì vậy việc tái chế kim loại sẽ giúp giảm thiểu tác động xấu đến môi trường và tiết kiệm năng lượng trong quá trình sản xuất mới."
  },
  PAPER: {
    title: "Paper (Giấy)",
    description: "Giấy có thể tái chế, nhưng cần phải sạch sẽ. Tránh các giấy bẩn hoặc có dầu mỡ như giấy ăn hay pizza.",
    action: "Hãy chắc chắn rằng bạn không bỏ giấy bị bẩn vào thùng giấy tái chế.",
    extraInfo: "Giấy tái chế có thể được sử dụng lại trong sản xuất giấy mới. Tuy nhiên, giấy có dầu mỡ (ví dụ giấy pizza) không thể tái chế vì chúng gây khó khăn cho quá trình xử lý."
  },
  GLASS: {
    title: "Glass (Kính)",
    description: "Kính là vật liệu có thể tái chế vô hạn mà không mất chất lượng. Tuy nhiên, kính cần phải được làm sạch trước khi tái chế.",
    action: "Hãy chắc chắn rằng các chai lọ thủy tinh không bị vỡ trước khi bỏ vào thùng tái chế.",
    extraInfo: "Kính có thể tái chế vô hạn mà không giảm chất lượng. Hãy tách kính thủy tinh khỏi các vật liệu khác như nhựa để quá trình tái chế được hiệu quả hơn."
  },
  PLASTIC: {
    title: "Plastic (Nhựa)",
    description: "Nhựa có thể tái chế, nhưng cần phân loại đúng loại nhựa và làm sạch chúng. Một số loại nhựa không thể tái chế.",
    action: "Hãy phân loại nhựa theo loại và làm sạch chúng trước khi bỏ vào thùng tái chế.",
    extraInfo: "Một số loại nhựa có thể tái chế như PET hoặc HDPE, nhưng các loại nhựa phức hợp (ví dụ nhựa bao bì thực phẩm) không thể tái chế và cần phải được xử lý đúng cách."
  },
  BIODEGRADABLE: {
    title: "Biodegradable (Phân hủy sinh học)",
    description: "Các vật liệu có thể phân hủy sinh học như thực phẩm và chất hữu cơ cần được bỏ vào thùng rác phân hủy sinh học.",
    action: "Hãy chắc chắn rằng các vật liệu hữu cơ không bị lẫn với các vật liệu không thể phân hủy.",
    extraInfo: "Các vật liệu phân hủy sinh học sẽ phân hủy tự nhiên theo thời gian. Hãy phân loại chúng vào thùng rác composting để tái chế thành phân bón hữu cơ."
  },
  CARDBOARD: {
    title: "Cardboard (Giấy các tông)",
    description: "Giấy các tông là một vật liệu tái chế rất tốt, nhưng cần phải làm sạch và loại bỏ mọi vật liệu khác như nhựa.",
    action: "Hãy gấp lại các thùng các tông và bỏ chúng vào thùng tái chế giấy các tông.",
    extraInfo: "Giấy các tông là một trong những vật liệu dễ tái chế nhất. Tuy nhiên, nếu có dơ bẩn (ví dụ như từ dầu mỡ), chúng sẽ không thể tái chế."
  }
};

const AboutTestSection: React.FC = () => {
  const [imageInput, setImageInput] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [resultImg, setResultImg] = useState<string>('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isUrlInput, setIsUrlInput] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  // Hàm xử lý khi người dùng tải ảnh lên
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImageInput(result);
      setPreviewImage(result);
      setIsUrlInput(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value.trim();
    setImageInput(url);
    setPreviewImage(url);
    setIsUrlInput(true);
    setFile(null); // reset file name nếu dùng URL
  };

  const handleSubmit = async () => {
    if (!file && (!imageInput || imageInput.trim() === '')) {
      alert('Vui lòng chọn file hoặc nhập URL ảnh hợp lệ!');
      return;
    }

    try {
      const formData = new FormData();

      if (file) {
        formData.append('file', file);
      } else if (isUrlInput && imageInput) {
        if (!imageInput.match(/^https?:\/\/.+/)) {
          alert('URL ảnh không hợp lệ! Vui lòng nhập URL bắt đầu bằng http:// hoặc https://');
          return;
        }
        formData.append('image_url', imageInput);
      } else if (imageInput) {
        if (!imageInput.startsWith('data:image/')) {
          alert('Dữ liệu base64 không hợp lệ!');
          return;
        }
        formData.append('image_base64', imageInput);
      }

      const res = await axios.post('http://localhost:8000/ai/predict-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setResultImg(res.data.image_with_boxes);
      setCounts(res.data.counts);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.detail || 'Không thể xử lý ảnh. Vui lòng thử lại!'
        : 'Không thể xử lý ảnh. Vui lòng thử lại!';
      console.error('Lỗi:', message);
      alert(message);
    }
  };

  return (
    <section className="mt-10 animate-fade-in bg-green-50 p-6 rounded shadow">
      <h2 className="text-xl font-bold text-green-700 mb-3">🧪 Thử nghiệm AI với ảnh của bạn</h2>
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn file ảnh</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-100 file:text-green-700 hover:file:bg-green-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hoặc nhập URL ảnh</label>
          <input
            type="text"
            placeholder="Dán URL ảnh..."
            value={isUrlInput ? imageInput : ''}
            onChange={handleUrlChange}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {previewImage && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700">Xem trước ảnh:</p>
            <img
              src={previewImage}
              alt="Ảnh xem trước"
              className="mt-2 max-w-xs border border-gray-300 rounded"
              onError={() => {
                setPreviewImage(null);
                alert('Không thể tải ảnh từ URL này. Vui lòng kiểm tra!');
              }}
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          Nhận diện ảnh
        </button>
      </div>

      {previewImage && resultImg && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-600 mb-1">📷 Trước</p>
              <img src={previewImage} alt="Ảnh gốc" className="max-w-full rounded border" />
            </div>
            <div className="flex flex-col items-center">
              <p className="text-sm font-semibold text-gray-600 mb-1">🤖 Sau</p>
              <img src={resultImg} alt="Kết quả" className="max-w-full rounded border" />
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-700">
            <h4 className="font-semibold">📦 Kết quả phân loại:</h4>
            {Object.keys(counts).length > 0 ? (
              <ul className="list-disc list-inside space-y-4">
                {Object.entries(counts).map(([label, count]) => {
                  const adviceData = advice[label as Label]; // Đảm bảo label là một key hợp lệ trong advice
                  return (
                    <li key={label} className="p-5 bg-white border border-green-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform">
                      <div className="flex justify-between items-center border-b border-green-100 pb-3 mb-4">
                        <span className="text-green-800 font-semibold text-lg flex items-center">
                          <span className="bg-green-100 rounded-full p-1.5 mr-2 text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                          </span>
                          {label}
                        </span>
                        <strong className="text-xl bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-md">{count}</strong>
                      </div>
                      {adviceData && (
                        <div className="space-y-3">
                          <h5 className="font-semibold text-green-700 text-lg flex items-center">
                            <span className="mr-2">🌱</span>
                            {adviceData.title}
                          </h5>
                          <p className="text-gray-600 pl-2 border-l-4 border-green-300 ml-2">{adviceData.description}</p>
                          <div className="bg-green-50 p-4 rounded-md border-l-4 border-green-500 mt-4 shadow-md">
                            <p className="font-bold text-green-800">{adviceData.action}</p>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-md border-l-4 border-blue-400 mt-3 shadow-md">
                            <p className="text-blue-800 text-sm"><span className="font-medium">Lưu ý:</span> {adviceData.extraInfo}</p>
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-red-600 mt-2">⚠️ Không phát hiện được rác trong ảnh.</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default AboutTestSection;
