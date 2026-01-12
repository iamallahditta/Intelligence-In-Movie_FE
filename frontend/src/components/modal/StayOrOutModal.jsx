import { IoClose } from "react-icons/io5";
import React from "react";

const StayOrOutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false,
  title = "You are currently recording.",
  message = "Are you sure you want to leave and stop the recording?",
  stayLabel = "Stay",
  leaveLabel = "Leave",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isProcessing}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
        >
          <IoClose className="h-5 w-5 text-gray-500" />
        </button>

      {/* Title */}
          <h3 className="mb-2 text-lg font-medium text-gray-900 text-center">
            {title}
          </h3>

          {/* Message */}
          <p className="mb-6 text-center text-sm text-gray-500">
            {message}
          </p>

        {/* Actions */}
        <div className="flex justify-center mt-6 space-x-3">
          <button
            onClick={onClose}
            disabled={isProcessing} // Optional: disable this too if needed
            className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navy_blue focus:ring-offset-2 disabled:opacity-50"
          >
            {stayLabel}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : leaveLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StayOrOutModal;
