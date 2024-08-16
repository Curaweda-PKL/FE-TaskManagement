import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faStar } from '@fortawesome/free-regular-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const SideTask: React.FC = () => {
  return (
    <div className="fixed right-0 top-14 bottom-0 w-80 bg-white overflow-y-auto shadow-md z-0">
      <div className="py-20 pr-16 flex flex-col gap-6">
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold px-4 py-3 text-gray-600">Recently viewed</h2>
          <div className="flex flex-col">
            <div className="flex items-center px-4 py-3 hover:bg-gray-100">
              <div className="w-8 h-8 rounded bg-red-500 mr-4"></div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-sm font-semibold">Project 1</h3>
                <p className="text-xs text-gray-500">Kelompok 1's workspace</p>
              </div>
              <FontAwesomeIcon icon={faStar} className="text-gray-400" />
            </div>
            <div className="flex items-center px-4 py-3 hover:bg-gray-100">
              <div className="w-8 h-8 rounded bg-blue-500 mr-4"></div>
              <div className="flex flex-col flex-grow">
                <h3 className="text-sm font-semibold">Project 2</h3>
                <p className="text-xs text-gray-500">Kelompok 1's workspace</p>
              </div>
              <FontAwesomeIcon icon={faStar} className="text-gray-400" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <h2 className="text-sm font-semibold px-4 py-3 text-gray-600">Links</h2>
          <button className="flex items-center text-sm text-gray-700 px-4 py-3 w-full hover:bg-gray-100">
            <FontAwesomeIcon icon={faPlus} className="text-gray-400 mr-3" />
            Create a Workspace board
          </button>
        </div>
      </div>
    </div>
  );
};

export default SideTask;