// src/components/MainApp.tsx
import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
import WebcamCapture from "../camera/WebcamCapture";
import ResultDisplay from "../result/ResultDisplay";
import ResultModal from "../result/ResultModal";
import StationLogoutModal from "../auth/StationLogoutModal";
import AppHeader from "../layout/AppHeader";
import { useNavigate } from "react-router-dom";

interface Detection {
  label: string;
  confidence: number;
  bbox: number[];
}

interface Station {
  id: number;
  name: string;
  location: string;
}

interface Props {
  onUserLogout: () => void;
  onStationLogout: () => void;
}

const MainApp: React.FC<Props> = ({ onUserLogout, onStationLogout }) => {
  const [station] = useState<Station | null>(() => {
    const stored = localStorage.getItem("station");
    return stored ? JSON.parse(stored) : null;
  });

  const [resultTypes, setResultTypes] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [detections, setDetections] = useState<Detection[]>([]);
  const [detectedImage, setDetectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showStationLogout, setShowStationLogout] = useState(false);

  const webcamRef = useRef<Webcam>(null);
  const navigate = useNavigate();

  const captureAndSend = async () => {
    if (!webcamRef.current || !station) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: JSON.stringify({ image: imageSrc }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      const types: string[] = data.types || [];
      const annotatedImage = data.image;

      setResultTypes(types);
      setDetections(data.detections || []);
      setDetectedImage(annotatedImage);
      setShowModal(true);

      if (types.length > 0 && !types.includes("Unknown")) {
        const blob = await fetch(annotatedImage).then((res) => res.blob());

        const formData = new FormData();
        formData.append("waste[image]", blob, "annotated.jpg");
        formData.append("waste[station_id]", station.id.toString());
        types.forEach((type) => formData.append("waste[waste_types][]", type));

        await fetch("http://localhost:3000/wastes", {
          method: "POST",
          body: formData,
          credentials: "include",
        });
      }
    } catch (err) {
      console.error("Lỗi khi nhận diện hoặc lưu dữ liệu:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogout = async () => {
    try {
      await fetch("http://localhost:3000/users/sign_out", {
        method: "DELETE",
        credentials: "include",
        headers: { Accept: "application/json" },
      });
    } catch (e) {
      console.error(e);
    } finally {
      onUserLogout();
      navigate("/login");
    }
  };

  const handleStationLogoutSuccess = () => {
    onStationLogout();
    navigate("/station");
  };

  if (!station) return null;

  return (
    <div className="min-h-screen bg-green-50 flex flex-col">
      {/* ✅ Header trạm */}
      <AppHeader
        station={station}
        onUserLogout={handleUserLogout}
        onStationLogout={() => setShowStationLogout(true)}
      />

      <main className="flex flex-col items-center flex-grow px-4 py-8">
        {/* ✅ Camera */}
        <WebcamCapture webcamRef={webcamRef} />

        {/* ✅ Nút nhận diện */}
        <button
          onClick={captureAndSend}
          disabled={isLoading}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow"
        >
          {isLoading ? "⏳ Đang xử lý..." : "📸 Nhận diện"}
        </button>

        {/* ✅ Hiển thị kết quả */}
        <ResultDisplay result={resultTypes.join(", ")} detectedImage={detectedImage} />

        {/* ✅ Modal hiển thị kết quả */}
        {showModal && (
          <ResultModal
            result={resultTypes.length > 0 ? resultTypes[0] : "Unknown"}
            onClose={() => setShowModal(false)}
            onLogout={handleUserLogout}
          />
        )}

        {/* ✅ Modal xác nhận đăng xuất trạm */}
        {showStationLogout && station && (
          <StationLogoutModal
            station={station}
            onClose={() => setShowStationLogout(false)}
            onSuccess={handleStationLogoutSuccess}
          />
        )}
      </main>

      <footer className="text-sm text-gray-500 text-center py-4">
        © {new Date().getFullYear()} Trạm nhận diện phế liệu
      </footer>
    </div>
  );
};

export default MainApp;
