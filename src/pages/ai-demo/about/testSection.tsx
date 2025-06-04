import React, { useState } from 'react';

import axios from 'axios';

const AboutTestSection: React.FC = () => {
  const [imageInput, setImageInput] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [resultImg, setResultImg] = useState<string>('');
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isUrlInput, setIsUrlInput] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

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
              <ul className="list-disc list-inside">
                {Object.entries(counts).map(([label, count]) => (
                  <li key={label}>
                    {label}: <strong>{count}</strong>
                  </li>
                ))}
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
