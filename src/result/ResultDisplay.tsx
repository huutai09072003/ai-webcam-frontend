import React from "react";

interface ResultDisplayProps {
  result: string | null;
  detectedImage: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, detectedImage }) => {
  if (!result) return null;

  return (
    <div className="mt-8 p-6 bg-green-50 rounded-xl shadow-lg border border-green-200 animate-fade-in">
      <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
        <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
        Kết quả nhận diện: <span className="text-green-600">{result}</span>
      </h3>
      {detectedImage && (
        <img
          src={detectedImage}
          alt="Kết quả"
          className="mt-4 rounded-lg shadow-md border-2 border-green-300 max-w-sm mx-auto transform transition duration-300 hover:scale-105"
        />
      )}
    </div>
  );
};

export default ResultDisplay;