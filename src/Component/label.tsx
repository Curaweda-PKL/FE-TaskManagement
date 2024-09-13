import React from 'react';

const LabelsPopup = ({ isOpen, onClose, labels, onCreateNewLabel }) => {
  if (!isOpen) return null;

  return (
    <div className="containerPopup fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg h-fit w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <i className="fas fa-times"></i>
        </button>

        <h2 className="text-lg font-bold mb-4 text-center">Label</h2>
        <ul className="space-y-2">
          {labels.map((label, index) => (
            <li key={index} className="flex items-center justify-between">
              <div className="flex items-center w-full">
                <input type="checkbox" className="mr-2 accent-gray-500" />
                <div className={`w-full h-8 rounded-md ${label.color} flex items-center px-2`}>
                  <span className="text-white font-semibold">{label.name}</span>
                </div>
              </div>
              <button className="ml-2 text-gray-400 hover:text-gray-600">
                <i className="fas fa-pencil-alt"></i>
              </button>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 w-full py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-gray-800 font-semibold"
          onClick={onCreateNewLabel}
        >
          Create new label
        </button>
      </div>
    </div>
  );
};

export default LabelsPopup;
