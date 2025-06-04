import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Stage, Layer, Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';

interface TrashPrediction {
  trash_type: string;
  confidence: number;
  bounding_box: { x: number; y: number; width: number; height: number };
}

interface UserSelection {
  x: number;
  y: number;
  trash_type: string;
}

interface ImageData {
  id: string;
  url: string;
}

const GamePlayPage: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [imageWithBoxes, setImageWithBoxes] = useState<string | null>(null);
  const [aiPredictions, setAiPredictions] = useState<TrashPrediction[]>([]);
  const [selections, setSelections] = useState<UserSelection[]>([]);
  const [result, setResult] = useState<{ correct: number; incorrect: number } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [questionType, setQuestionType] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSelection, setPendingSelection] = useState<UserSelection | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [image] = useImage(imageUrl ?? '', 'anonymous');

  useEffect(() => {
    const fetchImageAndPredict = async () => {
      try {
        const res = await fetch(`http://localhost:3000/images/${imageId}`);
        if (!res.ok) throw new Error('Không thể tải hình ảnh');
        const data: ImageData = await res.json();
        setImageUrl(data.url);

        const imgRes = await fetch(data.url);
        const blob = await imgRes.blob();
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64data = reader.result as string;
          const detectRes = await fetch('http://localhost:8000/game1/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: base64data, selections: [], question_type: '' }),
          });
          const detectData = await detectRes.json();
          setAiPredictions(detectData.predictions);
          const uniqueTypes = [...new Set(detectData.predictions.map((p: any) => p.trash_type))];
          const randomType = uniqueTypes[Math.floor(Math.random() * uniqueTypes.length)];
          setQuestionType(randomType);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error('Lỗi tải hoặc predict hình ảnh:', error);
        alert('Không thể xử lý hình ảnh. Quay lại.');
        navigate('/ai-demo/game/1');
      }
    };

    if (imageId) fetchImageAndPredict();
  }, [imageId, navigate]);

  useEffect(() => {
    if (!image) return;
    const maxWidth = window.innerWidth * 0.9;
    const maxHeight = window.innerHeight * 0.6;
    let width = image.width;
    let height = image.height;

    if (width > maxWidth) {
      height = (maxWidth / width) * height;
      width = maxWidth;
    }
    if (height > maxHeight) {
      width = (maxHeight / height) * width;
      height = maxHeight;
    }

    setStageSize({ width, height });
  }, [image]);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const handleClick = (e: KonvaEventObject<MouseEvent>) => {
    if (!isPlaying || selections.length >= 1 || hasSubmitted) return;
    const stage = e.target.getStage();
    const pointer = stage?.getPointerPosition();
    if (pointer) {
      setPendingSelection({ x: pointer.x, y: pointer.y, trash_type: questionType });
      setShowConfirm(true);
    }
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    if (!pendingSelection || !image) return;
    setSelections([pendingSelection]);
    setIsPlaying(false); // Dừng đếm thời gian
    setHasSubmitted(true);

    try {
      const canvas = document.querySelector('canvas');
      const base64 = canvas?.toDataURL('image/jpeg') || '';

      const res = await fetch('http://localhost:8000/game1/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: base64,
          question_type: questionType,
          selections: [{
            x_ratio: pendingSelection.x / stageSize.width,
            y_ratio: pendingSelection.y / stageSize.height,
            trash_type: questionType,
          }],
        }),
      });

      const data = await res.json();
      setImageWithBoxes(data.image_with_boxes || null);
      setResult({ correct: data.correct, incorrect: data.incorrect });
    } catch (error) {
      console.error('Lỗi gửi bài:', error);
    }
  };

  return (
    <div className="container mx-auto p-6 bg-green-50 min-h-screen text-center">
      {!isPlaying && !hasSubmitted ? (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
          <h1 className="text-2xl font-bold text-green-700 mb-4">Chọn độ khó</h1>
          <div className="space-y-2">
            <button onClick={() => { setTimeLeft(60); setIsPlaying(true); }} className="w-full bg-green-600 text-white py-2 rounded">Dễ (60s)</button>
            <button onClick={() => { setTimeLeft(45); setIsPlaying(true); }} className="w-full bg-yellow-500 text-white py-2 rounded">Trung Bình (45s)</button>
            <button onClick={() => { setTimeLeft(30); setIsPlaying(true); }} className="w-full bg-red-500 text-white py-2 rounded">Khó (30s)</button>
          </div>
        </div>
      ) : hasSubmitted && result ? (
        <div className="mt-6 bg-white p-4 rounded shadow max-w-lg mx-auto">
          <h2 className="text-xl font-semibold text-green-700">📊 Kết quả</h2>
          <p>✅ Đúng: {result.correct}</p>
          <p>❌ Sai: {result.incorrect}</p>
          {imageWithBoxes && (
            <img src={imageWithBoxes} alt="Kết quả" className="mt-4 rounded border" />
          )}
          <div className="mt-4">
            <button
              onClick={() => alert("🚩 Cảm ơn bạn! Chúng tôi đã ghi nhận phản hồi.")}
              className="text-sm text-red-500 underline hover:text-red-700"
            >
              Báo cáo kết quả không chính xác
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 text-center">
            <p className="text-lg font-semibold text-gray-700">⏰ Thời gian còn lại: {timeLeft}s</p>
            <p className="text-xl font-bold text-green-700 mt-2">🎯 Hãy chọn vị trí loại rác: <span className="text-red-600">{questionType}</span></p>
          </div>

          <div className="flex justify-center mb-6">
            <Stage width={stageSize.width} height={stageSize.height} onClick={handleClick} className="border border-green-600 rounded-lg shadow">
              <Layer>
                {image && <KonvaImage image={image} width={stageSize.width} height={stageSize.height} />}
              </Layer>
            </Stage>
          </div>
        </>
      )}

      {/* Modal xác nhận */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
            <p className="text-lg font-semibold mb-4">Bạn có chắc muốn chọn vị trí này không?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Có
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlayPage;
