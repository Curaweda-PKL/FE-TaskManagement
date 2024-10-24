import React, { useState, useEffect } from 'react';
import { X } from 'phosphor-react';

interface CreateBoardProps {
  workspaceId: any;
  onClose: () => void;
  onCreateBoard: (workspaceId: any, name: string, description: any, boardId: any, backgroundColor: string) => void;
  initialData?: { id: string; name: string; description: string; backgroundColor?: string };
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
  const [selectedBackground, setSelectedBackground] = useState(initialData?.backgroundColor || '');

  const backgroundOptions = [
    'bg-red-800',
    'bg-blue-800',
    'bg-green-800',
    'bg-red-500',
  ];

  // Fungsi untuk mendapatkan background color random
  const getRandomBackground = () => {
    const randomIndex = Math.floor(Math.random() * backgroundOptions.length);
    return backgroundOptions[randomIndex];
  };

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      if (initialData.backgroundColor) {
        setSelectedBackground(initialData.backgroundColor);
      }
    }
  }, [initialData]);

  const handleSubmit = () => {
    // Jika user tidak memilih background, pilih random
    const finalBackground = selectedBackground || getRandomBackground();
    
    if (isEditing && initialData) {
      onCreateBoard(workspaceId, initialData.id, name, description, finalBackground);
    } else {
      onCreateBoard(workspaceId, name, description, finalBackground);
    }
    onClose();
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
            <div className={`h-32 rounded-lg mb-2 ${selectedBackground || 'bg-gray-100'}`}></div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Background</label>
            <div className="flex gap-2">
              {backgroundOptions.map((bg, index) => (
                <button
                  key={index}
                  className={`w-12 h-12 rounded-lg ${bg} hover:opacity-80 transition-opacity ${
                    selectedBackground === bg ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  onClick={() => setSelectedBackground(bg)}
                />
              ))}
            </div>
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