import React from 'react';

interface DeleteConfirmationProps {
  onDelete: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onDelete, onCancel }) => {
  return (
    <div className="flex justify-center" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full text-center">
        <div className="flex justify-end right-0">
          <i className="fas fa-times cursor-pointer" onClick={onCancel} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delete this workspace?</h2>
        <p className="text-sm text-gray-700 mb-6">
          Are you sure you want to delete this workspace permanently? This can't be undone.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onDelete}
            className="bg-[#FF0000] text-sm text-white font-medium py-1 px-10 rounded-lg hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;