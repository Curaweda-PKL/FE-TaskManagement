import React, { useState } from 'react';
import { X } from 'phosphor-react';

const CreateBoard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [workspace, setWorkspace] = useState('Kelompok 1');
  const [visibility, setVisibility] = useState('Public');

  const closeModal = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Create board</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <div className="bg-gray-200 h-32 rounded-lg mb-2"></div>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-red-500 rounded"></div>
              <div className="w-8 h-8 bg-blue-500 rounded"></div>
              <div className="w-8 h-8 bg-green-500 rounded"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-red-500 rounded"></div>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Board title*
            </label>
            <input
              type="text"
              className="w-full bg-white px-3 py-2 border rounded-md"
              placeholder="Input your title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">* board title is required</p>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Workspace
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-white"
              value={workspace}
              onChange={(e) => setWorkspace(e.target.value)}
            >
              <option>Kelompok 1</option>
              <option>Kelompok 2</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Visibility
            </label>
            <select
              className="w-full px-3 py-2 border rounded-md bg-white"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option>Public</option>
              <option>Private</option>
              <option>Workspace</option>
            </select>
          </div>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-blue-700 transition duration-300 w-full">
            Create Board
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateBoard;