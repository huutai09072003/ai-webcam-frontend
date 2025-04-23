import React from "react";
import Webcam from "react-webcam";

interface WebcamCaptureProps {
  webcamRef: React.RefObject<Webcam | null>;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ webcamRef }) => {
  return (
    <div className="mb-8 flex justify-center">
      <div className="relative">
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={400}
          className="rounded-xl shadow-lg border-4 border-green-400 transform transition duration-300 hover:scale-105"
          videoConstraints={{
            facingMode: "environment",
          }}
        />
        <div className="absolute -top-4 -left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
          Webcam
        </div>
      </div>
    </div>
  );
};

export default WebcamCapture;