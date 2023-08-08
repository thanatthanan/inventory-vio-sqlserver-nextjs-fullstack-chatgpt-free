// components/ConfirmationModal.tsx
import React from "react";

type ConfirmationModalProps = {
  actionType: "รับเข้า" | "จ่ายออก";
  onConfirm: () => void;
  onCancel: () => void;
};

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  actionType,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-opacity-50 bg-gray-900">
      <div className="bg-white p-4 rounded-lg">
        <p>คุณต้องการ{actionType}ใช่หรือไม่?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={onCancel}
            className="mr-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            ยกเลิก
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
