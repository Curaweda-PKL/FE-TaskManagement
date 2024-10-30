import React, { useState, useEffect } from 'react';
import { X } from 'phosphor-react';

interface CreateCardProps {
  workspaceId: any;
  boardId: any;
  onClose: () => void;
  onCreateCard: (name: string, boardId: any) => void;
  onUpdateCard: (cardId: any, name: string) => void;
  initialData?: { id: any, name: string };
  isEditing?: boolean;
}

const CreateCard: React.FC<CreateCardProps> = ({
  boardId,
  onClose,
  onCreateCard,
  onUpdateCard,
  initialData,
  isEditing = false,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('Card title is required.');
      return;
    }
    if (isEditing && initialData) {
      onUpdateCard(initialData.id, name);
    } else {
      onCreateCard(name, boardId);
    }
    onClose();
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const capitalizeWords = (str: string) =>
      str.replace(/\b\w/g, (char: string) => char.toUpperCase());
    setName(capitalizeWords(e.target.value));
    setError(''); // Clear error when user starts typing
  };

  return (
    <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Card' : 'Create Card'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Card Title*</label>
            <input
              type="text"
              className="w-full bg-white px-3 py-2 border rounded-md"
              placeholder="Input your title"
              value={name}
              onChange={handleNameChange}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            <p className="text-xs text-gray-500 mt-1">* Card title is required</p>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition duration-300 w-full"
            onClick={handleSubmit}
            disabled={!name.trim()}
          >
            {isEditing ? 'Edit Card' : 'Create Card'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCard;
