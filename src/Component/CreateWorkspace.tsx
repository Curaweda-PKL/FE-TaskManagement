import React from 'react';
import { X } from 'phosphor-react';
import createWork from '../assets/Media/createWork.svg';
import work from '../assets/Media/work.png';

const CreateWorkspaceModal = ({
  workspaceName,
  workspaceDescription,
  setWorkspaceName,
  setWorkspaceDescription,
  onClose,
}) => {

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white shadow-lg overflow-hidden w-full max-w-3xl max-h-[90vh] flex relative">
        <div className="w-full md:w-1/2 p-8 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">Let's Build a Workspace</h2>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-white border border-gray-300"
              placeholder="Workspace..."
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              This is the name of your team or your organization.
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workspace description
            </label>
            <textarea
              className="w-full px-3 py-2 bg-white border border-gray-300"
              rows="4"
              placeholder="Our workspace is..."
              value={workspaceDescription}
              onChange={(e) => setWorkspaceDescription(e.target.value)}
            ></textarea>
            <p className="text-xs text-gray-500 mt-1">
              Get your members on board with a few words about your Workspace.
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition duration-300 w-full"
          >
            Continue
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

export default CreateWorkspaceModal;
