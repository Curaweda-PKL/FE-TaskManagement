import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, SquaresFour, Heart, ChartBar, Users, Gear, CaretDown, Plus } from 'phosphor-react';
import ChevronRight from '../assets/Media/ChevronRight.svg'

const Sidebar: React.FC = () => {
  const [isWorkspaceExpanded, setIsWorkspaceExpanded] = useState(true);
  const location = useLocation();

  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";
  const activeClass = "bg-gray-100 text-purple-600";

  const isActive = (path: string) => location.pathname === path;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <aside className={`w-[25%] min-w-56 bg-white pl-[4%] py-32 h-screen p-4 max768:w-[230px] max768:min-w-0 ${isSidebarOpen ? 'max768:ml-0' : 'max768:ml-[-230px]'} max768:fixed transition-all duration-300 z-20`}>
      <div
        className={`fixed top-20 ${isSidebarOpen ? 'left-[-1.5rem] max768:left-[195px]' : 'left-[-1.5rem] max768:left-1'} max768:inline bg-white rounded-full p-1 shadow-2xl cursor-pointer transition-all duration-300`}
        onClick={toggleSidebar}
      >
        <img src={ChevronRight} alt="" className={` ${isSidebarOpen ? 'transform rotate-180' : ''}`} />
      </div>
      <div className="mb-4">
        <Link to="/boards" className={`text-gray-600 p-2 mb-2 flex items-center ${hoverClass} ${isActive('/boards') ? activeClass : ''}`}>
          <SquaresFour size={20} className="mr-2" /><span>Boards</span>
        </Link>
        <Link to="/home" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/home') ? activeClass : ''}`}>
          <House size={20} className="mr-2" /><span>Home</span>
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">Workspaces</h2>
        <div className="bg-white rounded-md p-2">
          <div
            className={`flex items-center justify-between ${hoverClass}`}
            onClick={() => setIsWorkspaceExpanded(!isWorkspaceExpanded)}
          >
            <div className="flex items-center overflow-hidden">
              <div className="w-4 h-4 bg-red-500 rounded-sm mr-2"></div>
              <span className="text-black font-medium overflow-hidden text-ellipsis whitespace-nowrap">Kelompok 1 Workspace</span>
            </div>
            <CaretDown
              size={16}
              className={`text-gray-600 transform transition-transform ${isWorkspaceExpanded ? 'rotate-180' : ''}`}
            />
          </div>

          {isWorkspaceExpanded && (
            <div className="mt-2 ml-6 space-y-2 text-gray-600">
              <Link to="/workspace/boards" className={`flex items-center p-1 ${hoverClass} ${isActive('/workspace/boards') ? activeClass : ''}`}>
                <SquaresFour size={16} className="mr-2" /><span>Boards</span>
              </Link>
              <Link to="/workspace/highlights" className={`flex items-center p-1 ${hoverClass} ${isActive('/workspace/highlights') ? activeClass : ''}`}>
                <Heart size={16} className="mr-2" /><span>Highlights</span>
              </Link>
              <Link to="/workspace/reports" className={`flex items-center p-1 ${hoverClass} ${isActive('/workspace/reports') ? activeClass : ''}`}>
                <ChartBar size={16} className="mr-2" /><span>Reports</span>
              </Link>
              <Link to="/workspace/members" className={`flex items-center justify-between p-1 ${hoverClass} ${isActive('/workspace/members') ? activeClass : ''}`}>
                <div className="flex items-center">
                  <Users size={16} className="mr-2" /><span>Member</span>
                </div>
                <div className="flex items-center">
                  <Plus size={16} className="mr-1" />
                  <CaretDown size={16} />
                </div>
              </Link>
              <Link to="/workspace/settings" className={`flex items-center justify-between p-1 ${hoverClass} ${isActive('/workspace/settings') ? activeClass : ''}`}>
                <div className="flex items-center">
                  <Gear size={16} className="mr-2" /><span>Settings</span>
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