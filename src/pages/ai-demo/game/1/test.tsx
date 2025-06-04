import {
  useEffect,
  useState,
} from 'react';

import {
  Image as KonvaImage,
  Layer,
  Stage,
} from 'react-konva';
import {
  useNavigate,
  useParams,
} from 'react-router-dom';
import useImage from 'use-image';

import { API_BASE_URL } from '../../../../config/api';

interface ImageData {
  id: string;
  url: string;
}

const ImageCanvasViewer: React.FC = () => {
  const { imageId } = useParams<{ imageId: string }>();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  const [image] = useImage(imageUrl ?? '', 'anonymous');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/images/${imageId}`);
        const data: ImageData = await res.json();
        setImageUrl(data.url);
      } catch (err) {
        console.error('Lỗi khi tải ảnh:', err);
        navigate('/ai-demo/games');
      }
    };

    if (imageId) fetchImage();
  }, [imageId, navigate]);

  useEffect(() => {
    if (!image) return;

    const maxWidth = window.innerWidth * 0.8;
    const maxHeight = window.innerHeight * 0.7;

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

  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Xem Ảnh Trên Canvas (Konva)</h1>

      {image ? (
        <Stage
          width={stageSize.width}
          height={stageSize.height}
          className="mx-auto border border-gray-300 rounded shadow"
        >
          <Layer>
            <KonvaImage
              image={image}
              width={stageSize.width}
              height={stageSize.height}
            />
          </Layer>
        </Stage>
      ) : (
        <p className="text-gray-500">Đang tải ảnh...</p>
      )}
    </div>
  );
};

export default ImageCanvasViewer;