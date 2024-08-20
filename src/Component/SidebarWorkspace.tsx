import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { House, SquaresFour, Users, Gear, Plus } from 'phosphor-react';

const SidebarWorkspace: React.FC = () => {
  const location = useLocation();

  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";
  const activeClass = "bg-gray-100 text-purple-600";

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="pt-16 w-64 bg-white border-r h-screen">
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
        <Link to="/project1" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/project1') ? activeClass : ''}`}>
          <div className="w-4 h-4 bg-orange-500 rounded-sm mr-2"></div>
          <span>Project 1</span>
        </Link>
      </div>

      <button className="flex items-center text-gray-600 p-2 mt-4 px-4">
        <Plus size={20} className="mr-2" />
        <span>Create new board</span>
      </button>
    </aside>
  );
};

export default SidebarWorkspace;
