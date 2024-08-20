import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, SquaresFour, Users, Gear, Plus } from 'phosphor-react';
import ChevronRight from '../assets/Media/ChevronRight.svg'

const SidebarWorkspace: React.FC = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";
  const activeClass = "bg-gray-100 text-purple-600";

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <div
        className={`fixed top-20 left-1 max768:inline hidden bg-white rounded-full p-1 shadow-2xl cursor-pointer transition-all duration-300 z-30`}
        onClick={toggleSidebar}
      >
        <img src={ChevronRight} alt="" className={`${isSidebarOpen ? 'transform rotate-180' : ''}`} />
      </div>
      <aside className={`pt-16 w-64 bg-white border-r h-screen max768:fixed max768:top-0 max768:left-0 transition-transform duration-300 z-20 ${isSidebarOpen ? 'max768:translate-x-0' : 'max768:-translate-x-full'}`}>
        <div className="mb-4">
          <div className={`flex items-center justify-between p-2 border-b w-full p-4`}>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span className="text-black font-medium">Kelompok 1 Workspace</span>
            </div>
          </div>
          <div className="mt-2 space-y-1 px-4">
            <Link to="/workspace/boards-ws" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/boards') ? activeClass : ''}`}>
              <SquaresFour size={20} className="mr-2" /><span>Boards</span>
            </Link>
            <Link to="/workspace/members" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/members') ? activeClass : ''}`}>
              <Users size={20} className="mr-2" /><span>Member</span>
            </Link>
            <Link to="/workspace/settings" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/settings') ? activeClass : ''}`}>
              <Gear size={20} className="mr-2" /><span>Workspace setting</span>
            </Link>
          </div>
        </div>

        <div className="mb-4 px-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Workspace view</h2>
          <Link to="/workspace/reports" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/reports') ? activeClass : ''}`}>
            <House size={20} className="mr-2" /><span>Reports</span>
          </Link>
        </div>

        <div className="mb-4 px-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Your Board</h2>
          <Link to="/workspace/project" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/project') ? activeClass : ''}`}>
            <div className="w-4 h-4 bg-orange-500 rounded-sm mr-2"></div>
            <span>Project 1</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SidebarWorkspace;