import { BsTrash } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import React from 'react';

const DeleteConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  isDeleting,
  title = "Delete Recording",
  message = "Are you sure you want to delete this recording? This action cannot be undone."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left shadow-xl transition-all">
        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-100"
        >
          <IoClose className="h-5 w-5 text-gray-500" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center">
          {/* Icon */}
          {/* <div className="mb-4 rounded-full bg-red-100 p-3">
            <BsTrash className="h-6 w-6 text-red-600" />
          </div> */}

          {/* Title */}
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {title}
          </h3>

          {/* Message */}
          <p className="mb-6 text-center text-sm text-gray-500">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navy_blue focus:ring-offset-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isDeleting ? 'Processing...' : 'Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal; 