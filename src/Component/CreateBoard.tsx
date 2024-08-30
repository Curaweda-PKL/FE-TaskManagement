import React, { useState, useEffect } from 'react';
import { X } from 'phosphor-react';

interface CreateBoardProps {
  workspaceId: any;
  onClose: () => void;
  onCreateBoard: (workspaceId: any, name: string, description: string, boardId: any,) => void; // Updated signature
  initialData?: { id: string; name: string; description: string };
  isEditing?: boolean;
}

const CreateBoard: React.FC<CreateBoardProps> = ({
  workspaceId,
  onClose,
  onCreateBoard,
  initialData,
  isEditing = false,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (isEditing && initialData) {
      onCreateBoard(workspaceId, initialData.id, name, description);
    } else {
      onCreateBoard(workspaceId, name, description, null); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Board' : 'Create Board'}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Board Title*</label>
            <input
              type="text"
              className="w-full bg-white px-3 py-2 border rounded-md"
              placeholder="Input your title"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">* Board title is required</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Board Description*</label>
            <input
              type="text"
              className="w-full bg-white px-3 py-2 border rounded-md"
              placeholder="Input your description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition duration-300 w-full"
            onClick={handleSubmit}
          >
            {isEditing ? 'Edit Board' : 'Create Board'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;
