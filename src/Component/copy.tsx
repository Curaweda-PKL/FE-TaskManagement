import React from 'react';

const CopyPopup = ({ isCopyPopupOpen, selectedCardList, handleCloseCopyPopup }) => {
  if (!isCopyPopupOpen || !selectedCardList) return null;

  return (
    <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-center text-sm font-bold mb-4">Card Copy</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            className="block w-full text-sm text-gray-500 bg-gray-200 rounded-lg focus:outline-none"
            placeholder="Akhson"
            disabled
          />
        </div>

        <div className="mb-4">
          <span className="block text-sm font-medium text-gray-700 mb-2">Keep...</span>
          <div className="space-y-2">
            <div className="flex items-center">
              <input type="checkbox" checked className="form-checkbox h-4 w-4 text-purple-600 rounded" />
              <label className="ml-2 text-sm text-gray-700">Members</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked className="form-checkbox h-4 w-4 text-purple-600 rounded" />
              <label className="ml-2 text-sm text-gray-700">Attachments</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" checked className="form-checkbox h-4 w-4 text-purple-600 rounded" />
              <label className="ml-2 text-sm text-gray-700">Comments</label>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Copy to...</label>
          <input
            type="text"
            className="block w-full text-sm text-gray-500 bg-gray-200 rounded-lg focus:outline-none mb-4"
            placeholder="Project 1"
            disabled
          />
          <div className="flex justify-between space-x-2">
            <select className="block w-1/2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none">
              <option>Team</option>
            </select>
            <select className="block w-1/2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none">
              <option>1</option>
            </select>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleCloseCopyPopup}
            className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CopyPopup;
