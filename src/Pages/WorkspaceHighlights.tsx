import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons';
import Wolf from '../assets/Media/wolf.png'

const WorkspaceHighlights: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen py-20 flex justify-center">
      <div className="max-w-screen-xl flex gap-10">
        <div className="w-1/2 flex flex-col gap-5">
          <div className="bg-white p-6 rounded-md shadow-md ml-10 flex flex-col items-center">
            <div className="relative w-full h-40 rounded-md overflow-hidden mb-4">
              <img src={Wolf} alt="Workspace Highlight Background" className="w-full h-full object-cover"/>
            </div>
            <h2 className="text-xl font-bold mb-2">Stay up to date</h2>
            <p className="text-gray-700 text-center">
              Invite people to boards and cards, leave comments, add due dates, and we'll show the most important activity here.
            </p>
          </div>
        </div>
        <div className="w-1/2 flex flex-col gap-2">
          <div className="bg-white p-6 rounded-md shadow-md">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
              <h2 className="text-xl font-bold">Recently viewed</h2>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-red-500"></div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">Project 1</h3>
                  <p className="text-gray-700">Kelompok 1's workspace</p>
                </div>
                <span className="text-gray-500 font-bold">☆</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-md bg-blue-500"></div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold">Project 2</h3>
                  <p className="text-gray-700">Kelompok 1's workspace</p>
                </div>
                <span className="text-gray-500 font-bold">☆</span>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-md shadow-md">
            <h2 className="text-xl font-bold mb-2">Links</h2>
            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
              Create a Workspace board
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceHighlights;