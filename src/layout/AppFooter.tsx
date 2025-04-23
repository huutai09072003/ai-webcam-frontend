import React from "react";

const AppFooter: React.FC = () => {
  return (
    <footer className="text-center py-4 text-sm text-gray-500">
      © {new Date().getFullYear()} Trạm nhận diện phế liệu – Hệ thống thử nghiệm
    </footer>
  );
};

export default AppFooter;
