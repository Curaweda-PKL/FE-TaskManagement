import React from 'react';

interface DeleteConfirmationProps {
  onDelete: () => void;
  onCancel: () => void;
  itemType: 'workspace' | 'board' | 'member' | 'card' | 'cardlist' | 'attachment' | 'checklist' | 'customfield';
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onDelete, onCancel, itemType }) => {
  const title =
    itemType === 'workspace'
      ? 'Delete this Workspace?'
      : itemType === 'board'
      ? 'Delete this board?'
      : itemType === 'member'
      ? 'Remove this member?'
      : itemType === 'cardlist'
      ? 'Remove this card list?'
      : itemType === 'attachment'
      ? 'Delete this attachment?'
      : itemType === 'checklist'
      ? 'Delete this checklist?'
      : itemType === 'customfield'
      ? 'Delete this custom field'
      : 'Remove this card?';

  const description =
    itemType === 'member'
      ? 'Are you sure you want to remove this member?'
      : itemType === 'cardlist'
      ? 'Are you sure you want to delete this card list permanently? This can\'t be undone.'
      : itemType === 'attachment'
      ? 'Are you sure you want to delete this attachment permanently? This can\'t be undone.'
      : `Are you sure you want to delete this ${itemType} permanently? This can't be undone.`;

  return (
    <div className="absolute z-[200] flex justify-center" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full text-center">
        <div className="flex justify-end">
          <button className="text-gray-500 hover:text-gray-700" onClick={onCancel}>
            <i className="fas fa-times" />
          </button>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-sm text-gray-700 mb-6">
          {description}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onDelete}
            className={`text-sm text-white font-medium py-1 px-10 rounded-lg ${
              itemType === 'member' ? 'bg-red-500 hover:bg-red-600' : 'bg-[#FF0000] hover:bg-red-600'
            }`}
          >
            {itemType === 'member' ? 'Remove' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;