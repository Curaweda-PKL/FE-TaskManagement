import React from 'react';
import Wolf from '../assets/Media/wolf.png'
import SideTask from '../Component/SideTask';

const WorkspaceHighlights: React.FC = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-screen-xl mx-auto pt-32 pb-8 px-8">
        <div className="bg-white rounded-lg shadow-sm mr-80">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-full h-48">
              <img src={Wolf} alt="Workspace Highlight" className="w-full h-full object-cover rounded-t-lg"/>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Stay up to date</h2>
              <p className="text-gray-600 max-w-md">
                Invite people to boards and cards, leave comments, add due dates, and we'll show the most important activity here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SideTask />
    </div>
  );
};

export default WorkspaceHighlights;