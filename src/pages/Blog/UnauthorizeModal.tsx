import React from 'react';
import { Dialog } from '@headlessui/react';

type Props = {
  show: boolean;
  onClose: () => void;
};

const UnauthorizedModal: React.FC<Props> = ({ show, onClose }) => {
  return (
    <Dialog open={show} onClose={onClose} className="fixed z-50 inset-0 flex items-center justify-center">
      <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-30" />
      <div className="bg-white p-6 rounded-lg shadow-lg z-10 max-w-sm w-full">
        <Dialog.Title className="text-lg font-bold text-red-600 mb-2">⚠ Cảnh báo</Dialog.Title>
        <Dialog.Description className="text-gray-700 mb-4">
          Bạn cần đăng nhập để thực hiện hành động này.
        </Dialog.Description>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
        >
          Đóng
        </button>
      </div>
    </Dialog>
  );
};

export default UnauthorizedModal;
