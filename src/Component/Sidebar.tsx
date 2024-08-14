import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, SquaresFour, Heart, ChartBar, Users, Gear, CaretDown, Plus } from 'phosphor-react';

const Sidebar: React.FC = () => {
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);
  const location = useLocation();

  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";
  const activeClass = "bg-gray-100 text-purple-600";

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-80 bg-white pl-12 py-32 h-screen p-4">
      <div className="mb-4">
        <Link to="/boards" className={`text-gray-600 p-2 mb-2 flex items-center ${hoverClass} ${isActive('/boards') ? activeClass : ''}`}>
          <SquaresFour size={20} className="mr-2" />
          <span>Boards</span>
        </Link>
        <Link to="/home" className={`bg-white text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/home') ? activeClass : ''}`}>
          <House size={20} className="mr-2" />
          <span>Home</span>
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">Workspaces</h2>
        <div className="bg-white rounded-md p-2">
          <div 
            className={`flex items-center justify-between ${hoverClass}`}
            onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
          >
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
              <span className="text-black font-medium">Kelompok 1 Workspace</span>
            </div>
            <CaretDown 
              size={16} 
              className={`text-gray-600 transform transition-transform ${isWorkspaceExpanded ? 'rotate-180' : ''}`}
            />
          </div>
          {isWorkspaceExpanded && (
            <div className="mt-2 ml-6 space-y-2 text-gray-600">
              <Link to="/workspace/boards" className={`flex items-center p-1 ${hoverClass} ${isActive('/workspace/boards') ? activeClass : ''}`}>
                <SquaresFour size={16} className="mr-2" />
                <span>Boards</span>
              </Link>
              <Link to="/workspace/highlights" className={`flex items-center p-1 ${hoverClass} ${isActive('/workspace/highlights') ? activeClass : ''}`}>
                <Heart size={16} className="mr-2" />
                <span>Highlights</span>
              </Link>
              <Link to="/workspace/reports" className={`flex items-center p-1 ${hoverClass} ${isActive('/workspace/reports') ? activeClass : ''}`}>
                <ChartBar size={16} className="mr-2" />
                <span>Reports</span>
              </Link>
              <Link to="/workspace/members" className={`flex items-center justify-between p-1 ${hoverClass} ${isActive('/workspace/members') ? activeClass : ''}`}>
                <div className="flex items-center">
                  <Users size={16} className="mr-2" />
                  <span>Member</span>
                </div>
                <div className="flex items-center">
                  <Plus size={16} className="mr-1" />
                  <CaretDown size={16} />
                </div>
              </Link>
              <Link to="/workspace/settings" className={`flex items-center justify-between p-1 ${hoverClass} ${isActive('/workspace/settings') ? activeClass : ''}`}>
                <div className="flex items-center">
                  <Gear size={16} className="mr-2" />
                  <span>Settings</span>
                </div>
                <CaretDown size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;