import React, { useState } from 'react';

import CameraStreamCapture from './CameraStreamCapture';
import CameraStreamRealTime from './CameraStreamRealTime';

const CameraTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'realTime' | 'capture'>('realTime');

  return (
    <div>
      <div className="tabs mb-4">
        <button
          onClick={() => setActiveTab('realTime')}
          className={`px-4 py-2 ${activeTab === 'realTime' ? 'bg-green-500' : 'bg-gray-300'} rounded`}
        >
          Nhận diện thời gian thực
        </button>
        <button
          onClick={() => setActiveTab('capture')}
          className={`px-4 py-2 ${activeTab === 'capture' ? 'bg-green-500' : 'bg-gray-300'} rounded`}
        >
          Chụp ảnh và nhận diện
        </button>
      </div>

      {activeTab === 'realTime' && <CameraStreamRealTime />}
      {activeTab === 'capture' && <CameraStreamCapture />}
    </div>
  );
};

export default CameraTabs;
