import React from "react";

interface ChecklistPopupProps {
  isOpen: any;
  onClose: any;
  selectedCardList: any;
}

const ChecklistPopup: React.FC<ChecklistPopupProps> = ({ isOpen, onClose, selectedCardList }) => {
  if (!isOpen || !selectedCardList) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
      <div className="relative bg-white text-black p-4 rounded-lg shadow-lg w-80">
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-center text-sm font-bold mb-4">Add Checklist</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input 
            type="text" 
            placeholder="Checklist" 
            className="w-full p-1 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button 
            onClick={onClose} 
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPopup;
