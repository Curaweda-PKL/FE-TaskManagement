import React from 'react';

const AttachPopup = ({ isAttachPopupOpen, selectedCardList, handleCloseAttachPopup }) => {
  if (!isAttachPopupOpen || !selectedCardList) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
      <div className="relative bg-white text-black p-4 rounded-lg shadow-lg w-80">
        <button
          onClick={handleCloseAttachPopup}
          className="absolute top-2 right-2 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-center text-sm font-bold mb-4">Attach</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Attach a file from your computer
          </label>
          <div className="bg-gray-200 text-center text-sm p-4 rounded-lg cursor-pointer">
            Choose a file
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Search or paste a link
          </label>
          <div className="bg-gray-200 text-sm p-2 py-3 rounded-lg cursor-pointer"></div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Display text (optional)
          </label>
          <div className="bg-gray-200 text-sm p-2 py-3 rounded-lg cursor-pointer"></div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleCloseAttachPopup}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded">
            Insert
          </button>
        </div>
      </div>
    </div>
  );
};

export default AttachPopup;
