import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import createWork from '../assets/Media/createWork.svg';
import work from '../assets/Media/work.png';

interface CreateWorkspaceProps {
  workspaceName: string;
  workspaceDescription: string;
  workspaceColor: string;
  setWorkspaceName: (name: string) => void;
  setWorkspaceDescription: (description: string) => void;
  setWorkspaceColor: (color: string) => void;
  onClose: () => void;
  onCreate: (name: string, description: string, color: string) => Promise<void>;
  isEditMode: boolean;
}

const DEFAULT_COLOR = '#EF4444';

const CreateWorkspace: React.FC<CreateWorkspaceProps> = ({
  workspaceName,
  workspaceDescription,
  workspaceColor,
  setWorkspaceName,
  setWorkspaceDescription,
  setWorkspaceColor,
  onClose,
  onCreate,
  isEditMode,
}) => {
  const [error, setError] = useState<string | null>(null);

  // Set warna default hanya jika tidak dalam mode edit dan tidak ada warna yang dipilih
  useEffect(() => {
    if (!isEditMode && (!workspaceColor || workspaceColor === '#ffffff' || workspaceColor === '#FFFFFF')) {
      setWorkspaceColor(DEFAULT_COLOR);
    }
  }, []);

  const handleSubmit = async () => {
    if (!workspaceName.trim()) {
      setError('Workspace name is required.');
      return;
    }

    try {
      setError(null);
      // Gunakan warna yang ada jika dalam mode edit
      const finalColor = isEditMode 
        ? workspaceColor 
        : (!workspaceColor || workspaceColor === '#ffffff' || workspaceColor === '#FFFFFF') 
          ? DEFAULT_COLOR 
          : workspaceColor;
        
      await onCreate(workspaceName, workspaceDescription, finalColor);
      onClose();
    } catch (error) {
      console.error('Failed to create or edit workspace:', error);
    }
  };

  // Tampilkan warna yang ada jika dalam mode edit
  const displayColor = isEditMode 
    ? workspaceColor 
    : (!workspaceColor || workspaceColor === '#ffffff' || workspaceColor === '#FFFFFF') 
      ? DEFAULT_COLOR 
      : workspaceColor;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg overflow-hidden w-full max-w-3xl max-h-[90vh] flex relative">
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">
              {isEditMode ? 'Edit Workspace' : "Let's Build a Workspace"}
            </h2>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace name
            </label>
            <input
              type="text"
              className={`w-full px-3 py-2 bg-white text-black border ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Workspace..."
              value={workspaceName}
              onChange={(e) => {
                const capitalizeWords = (str: string) =>
                  str.replace(/\b\w/g, (char: string) => char.toUpperCase());
                setWorkspaceName(capitalizeWords(e.target.value));
              }}

            />
            {error && (
              <p className="text-xs text-red-500 mt-1">{error}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              This is the name of your team or your organization.
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace description
            </label>
            <textarea
              className="w-full h-24 px-3 py-2 bg-white text-black border border-gray-300"
              rows={4}
              placeholder="Our workspace is..."
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Get your members on board with a few words about your Workspace.
            </p>
          </div>
          <div className="mb-5">
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Select color workspace
            </label>
            <div className="flex items-center gap-3 w-full">
              <input
              type="color"
              className="h-10 border-gray-300 rounded w-1/2"
              value={displayColor}
              onChange={(e) => {
                const newColor = e.target.value;
                setWorkspaceColor(isEditMode ? newColor : (newColor === '#ffffff' || newColor === '#FFFFFF' ? DEFAULT_COLOR : newColor));
              }}
              style={{ backgroundColor: displayColor, border: 'none' }}
            />
            <input
              type="text"
              className="w-20 rounded px-3 py-2 text-sm bg-white border-gray-300 border text-black"
              value={displayColor}
              onChange={(e) => {
                const newColor = e.target.value;
                setWorkspaceColor(isEditMode ? newColor : (newColor === '#ffffff' || newColor === '#FFFFFF' ? DEFAULT_COLOR : newColor));
              }}
              placeholder="#hexcode"
            />
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition duration-300 w-full"
          >
            {isEditMode ? 'Save Changes' : 'Continue'}
          </button>
        </div>
        <div className="hidden md:flex w-1/2 items-center justify-center relative">
          <button
            onClick={onClose}
            className="absolute top-0 right-0 m-4 z-20 text-black hover:text-gray-600"
          >
            <X size={24} />
          </button>
          <img src={createWork} alt="Background" className="w-full h-full object-cover" />
          <div className="absolute w-64 h-48 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <img src={work} alt="Work" className="w-full h-full object-cover z-10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspace;