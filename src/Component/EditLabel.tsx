import React from 'react';

interface EditLabelProps {
  labelName: string;
  labelColor: string;
  labelPercentage: number;
  onSave: () => void;
  onCancel: () => void;
}

const EditLabel: React.FC<EditLabelProps> = ({ labelName, labelColor, labelPercentage, onSave, onCancel }) => {
  return (
    <div className="flex justify-center z-20 items-center fixed inset-0 bg-black bg-opacity-50" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full">
        <div className="flex justify-end">
          <i className="fas fa-times cursor-pointer" onClick={onCancel} />
        </div>
        <h2 className="text-center text-lg font-semibold text-gray-900 mb-4">Edit Label</h2>
        <div className="bg-red-500 text-white text-center py-2 rounded mb-4">
          {labelName}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Title</label>
          <input
            type="text"
            defaultValue={labelName}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-1">Select a color</label>
          <div className="flex items-center">
            <input
              type="color"
              defaultValue={labelColor}
              className="w-10 h-10 border border-gray-300 rounded mr-2"
            />
            <input
              type="text"
              defaultValue={labelColor}
              className="w-20 border border-gray-300 rounded px-3 py-2 text-sm mr-2"
            />
            <input
              type="number"
              defaultValue={labelPercentage}
              className="w-16 border border-gray-300 rounded px-3 py-2 text-sm"
              min="0"
              max="100"
            />
            <span className="ml-2 text-sm">%</span>
          </div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={onSave}
            className="bg-purple-600 text-sm text-white font-medium py-1 px-10 rounded-lg hover:bg-purple-700"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-300 text-sm text-gray-700 font-medium py-1 px-10 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLabel;
