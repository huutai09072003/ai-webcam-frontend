import './AboutTestSection.scss';

import React, { useState } from 'react';

import axios from 'axios';

interface AdviceData {
  concept: string;
  advice: string;
  references: string;
}

interface Prediction {
  trash_type: string;
  confidence: number;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const AboutTestSection: React.FC = () => {
  const [imageInput, setImageInput] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [resultImg, setResultImg] = useState('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isUrlInput, setIsUrlInput] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adviceMap, setAdviceMap] = useState<Record<string, AdviceData>>({});
  const [showAdvice, setShowAdvice] = useState(false);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const resetState = () => {
    setAdviceMap({});
    setShowAdvice(false);
    setResultImg('');
    setCounts({});
    setPredictions([]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    resetState();
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
    resetState();
    setImageInput(url);
    setPreviewImage(url);
    setIsUrlInput(true);
    setFile(null);
  };

  const handleSubmit = async () => {
    if (!file && (!imageInput || imageInput.trim() === '')) {
      alert('Vui lòng chọn file hoặc nhập URL ảnh hợp lệ!');
      return;
    }

    setIsLoading(true);
    setAdviceMap({});
    setShowAdvice(false);

    try {
      const formData = new FormData();
      if (file) formData.append('file', file);
      else if (isUrlInput && imageInput) formData.append('image_url', imageInput);
      else if (imageInput) formData.append('image_base64', imageInput);

      const res = await axios.post('http://localhost:8000/ai/predict-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setCounts(res.data.counts);
      setResultImg(res.data.image_with_boxes);
      setPredictions(res.data.predictions);
    } catch {
      alert('❌ Không thể xử lý ảnh. Vui lòng thử lại!');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdvice = async () => {
    setIsLoadingAdvice(true);
    try {
      const labels = Object.keys(counts);
      const res = await axios.post('http://localhost:8000/chatbot/advice', { labels });
      setAdviceMap(res.data);
      setShowAdvice(true);
    } catch {
      alert('Không thể lấy dữ liệu từ chatbot.');
    } finally {
      setIsLoadingAdvice(false);
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
                alert('Không thể tải ảnh từ URL này.');
              }}
            />
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? '⏳ Đang phân tích...' : 'Nhận diện ảnh'}
        </button>
      </div>

      {resultImg && previewImage && (
        <div className="mt-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">📷 Trước</p>
              <img src={previewImage} alt="Ảnh gốc" className="rounded border" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">🤖 Sau</p>
              <img src={resultImg} alt="Kết quả" className="rounded border" />
            </div>
          </div>

          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-2">📊 Thông tin nhận diện:</h4>
            <ul className="text-sm list-disc list-inside space-y-1">
              {predictions.map((item, idx) => (
                <li key={idx}>
                  <strong>{item.trash_type}</strong> - độ chính xác {(item.confidence * 100).toFixed(1)}%
                </li>
              ))}
            </ul>
          </div>

          {!showAdvice && (
            <div className="mb-6">
              <button
                onClick={fetchAdvice}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
                disabled={isLoadingAdvice}
              >
                {isLoadingAdvice ? '💬 Đang lấy lời khuyên...' : '💬 Nhận lời khuyên từ chatbot'}
              </button>
            </div>
          )}

          {isLoadingAdvice && (
            <div className="spinner-container">
              <div className="spinner" />
              <p className="text-sm mt-2 text-gray-600">Đang tải lời khuyên từ AI...</p>
            </div>
          )}

          {showAdvice && Object.entries(adviceMap).length > 0 && (
            <div className="space-y-6">
              {Object.entries(adviceMap).map(([label, data]) => (
                <div key={label} className="bg-white p-5 rounded-lg border border-green-100 shadow">
                  <h3 className="text-lg font-bold text-green-700 mb-3">♻️ {label}</h3>
                  <div className="mb-2">
                    <h4 className="font-semibold">✅ Khái niệm</h4>
                    <p className="whitespace-pre-line text-gray-700">{data.concept}</p>
                  </div>
                  <div className="mb-2">
                    <h4 className="font-semibold">💡 Lời khuyên</h4>
                    <p className="whitespace-pre-line text-gray-700">{data.advice}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">🔗 Tham khảo</h4>
                    <p className="whitespace-pre-line text-blue-700 text-sm">{data.references}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default AboutTestSection;
