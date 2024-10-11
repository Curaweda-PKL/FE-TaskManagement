import React from "react";

interface SubmitPopupProps{
  isSubmitPopupOpen: any;
  selectedCardList: any;
  handleCloseSubmitPopup: any;
}

const SubmitPopup: React.FC<SubmitPopupProps> = ({ isSubmitPopupOpen, selectedCardList, handleCloseSubmitPopup }) => {
  if (!isSubmitPopupOpen || !selectedCardList) return null;

  return (
    <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
      <div className="relative bg-white text-black p-4 rounded-lg shadow-lg w-80">
        <button
          onClick={handleCloseSubmitPopup}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-center text-sm font-bold mb-4">Submit</h2>

        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-2">Your work</span>
          <div className="bg-gray-200 text-center text-gray-600 text-sm p-4 rounded-lg cursor-pointer">
            Add or create
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleCloseSubmitPopup}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded"
          >
            Complete Task
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitPopup;
