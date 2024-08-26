import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { House, SquaresFour, Users, Gear } from 'phosphor-react';
import ChevronRight from '../assets/Media/ChevronRight.svg';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';

const SidebarWorkspace: React.FC = () => {
  const location = useLocation();
  const { workspaceId } = useParams<{ workspaceId: string }>(); // Get the workspaceId from the URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);

  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";
  const activeClass = "bg-gray-100 text-purple-600";

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleWorkspaceClick = (workspaceId: any) => {
    const workspace = workspaces.find(ws => ws.id === workspaceId);
    setSelectedWorkspace(workspace || null);
  };

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const data = await fetchWorkspaces();
        setWorkspaces(data);
        if (data.length > 0) {
          const defaultWorkspace = data.find(ws => ws.id === workspaceId);
          setSelectedWorkspace(defaultWorkspace || data[0]); // Set the selected workspace based on URL or default to the first one
        }
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      }
    };

    getWorkspaces();
  }, [workspaceId]); // Depend on workspaceId to refetch when it changes

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
              <span className="text-black font-medium">{selectedWorkspace ? selectedWorkspace.name : 'Loading...'}</span>
            </div>
          </div>
          <div className="mt-2 space-y-1 px-4">
            <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/boards-ws`} className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/boards') ? activeClass : ''}`}>
              <SquaresFour size={20} className="mr-2" /><span>Boards</span>
            </Link>
            <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/members`} className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/members') ? activeClass : ''}`}>
              <Users size={20} className="mr-2" /><span>Members</span>
            </Link>
            <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/settings`} className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/settings') ? activeClass : ''}`}>
              <Gear size={20} className="mr-2" /><span>Workspace Settings</span>
            </Link>
          </div>
        </div>

        <div className="mb-4 px-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Workspace View</h2>
          <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/reports`} className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/reports') ? activeClass : ''}`}>
            <House size={20} className="mr-2" /><span>Reports</span>
          </Link>
        </div>

        <div className="mb-4 px-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Your Board</h2>
          <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/project`} className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/workspace/project') ? activeClass : ''}`}>
            <div className="w-4 h-4 bg-orange-500 rounded-sm mr-2"></div>
            <span>Project 1</span>
          </Link>
        </div>
      </aside>
    </>
  );
};

export default SidebarWorkspace;
