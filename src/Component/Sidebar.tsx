import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import useAuth from '../hooks/fetchAuth';

const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [expandedWorkspaceIndex, setExpandedWorkspaceIndex] = useState<any>(null);
  const location = useLocation();

  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";
  const activeClass = "bg-gray-100 text-purple-600";
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onLogout = () => {
    console.log('Logout');
  };
  const onSuccess = () => {
    console.log('Success');
  };
  const { userData, fetchUserData } = useAuth(onSuccess, onLogout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData) {
          setCurrentUserId(userData.id);
          console.log("Current User ID:", userData.id);
        }
      } catch (error) {
        console.error("Error setting currentUserId:", error);
      }
    };
    fetchData();
  }, [userData]);

  const isAdminOrOwner = (workspace: any) => {
    if (!workspace || !currentUserId) return false;

    console.log(workspace)

    const currentUser = workspace.members.find(member => member.userId === currentUserId);
    return currentUser && (currentUser.role === 'ADMIN' || currentUser.role === 'OWNER');
  };

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const data = await fetchWorkspaces(workspaces);
        setWorkspaces(data);
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      }
    };

    getWorkspaces();
  }, []);

  const handleWorkspaceClick = (index: number) => {
    setExpandedWorkspaceIndex(expandedWorkspaceIndex === index ? null : index);
  };

  return (
    <aside className={`w-[25%] min-w-56 bg-white pl-[4%] py-16 h-screen p-4 max768:w-[230px] max768:min-w-0 ${isSidebarOpen ? 'max768:ml-0' : 'max768:ml-[-230px]'} max768:fixed transition-all duration-300 z-20`}>
      <div
        className={`fixed top-20 ${isSidebarOpen ? 'left-[-1.5rem] max768:left-[195px]' : 'left-[-1.5rem] max768:left-1'} max768:inline bg-white rounded-full p-1 shadow-2xl cursor-pointer transition-all duration-300`}
        onClick={toggleSidebar}
      >
        <i className={`fas fa-chevron-right ${isSidebarOpen ? 'transform rotate-180' : ''}`} />
      </div>
      <div className="mb-2">
        <Link to="/boards" className={`text-gray-600 p-2 mb-1 flex items-center ${hoverClass} ${isActive('/boards') ? activeClass : ''}`}>
          <i className='fas fa-th-large mr-2'></i><span>Boards</span>
        </Link>
        <Link to="/home" className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive('/home') ? activeClass : ''}`}>
          <i className='fas fa-home mr-2'></i><span>Home</span>
        </Link>
      </div>

      <div className="mb-4 py-3 border-t border-black">
        <h2 className="text-sm font-semibold text-gray-600 mb-2">Workspaces</h2>
        <div className="bg-white rounded-md">
          {workspaces.map((workspace, index) => (
            <div key={index}>
              <div
                className={`flex items-center mt-4 justify-between ${hoverClass}`}
                onClick={() => handleWorkspaceClick(index)}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div 
                    className="w-5 h-5 rounded-sm mr-2"
                    style={{ backgroundColor: workspace.color || '#EF4444' }}>
                  </div>
                  <span className="text-black font-medium overflow-hidden text-ellipsis whitespace-nowrap">{workspace.name}</span>
                </div>
                <i className={`fas fa-chevron-down text-gray-600 transform transition-transform ${expandedWorkspaceIndex === index ? 'rotate-180' : ''}`}></i>
              </div>

              {expandedWorkspaceIndex === index && (
                <div className="ml-6 mt-2 space-y-2 text-gray-600">
                  <Link to={`/workspace/${workspace.id}/boards`} className={`flex items-center p-1 ${hoverClass} ${isActive(`/workspace/${workspace.id}/boards`) ? activeClass : ''}`}>
                    <i className='fas fa-th-large mr-2'></i><span>Boards</span>
                  </Link>
                  <Link to={`/workspace/${workspace.id}/highlights`} className={`flex items-center p-1 ${hoverClass} ${isActive(`/workspace/${workspace.id}/highlights`) ? activeClass : ''}`}>
                    <i className='fas fa-heart mr-2'></i><span>Highlights</span>
                  </Link>
                  <Link to={`/workspace/${workspace.id}/reports`} className={`flex items-center p-1 ${hoverClass} ${isActive(`/workspace/${workspace.id}/reports`) ? activeClass : ''}`}>
                    <i className='fas fa-book-open mr-2'></i><span>Reports</span>
                  </Link>
                  <Link to={`/workspace/${workspace.id}/members`} className={`flex items-center justify-between p-1 ${hoverClass} ${isActive(`/workspace/${workspace.id}/members`) ? activeClass : ''}`}>
                    <div className="flex items-center">
                      <i className='fas fa-user-friends mr-2'></i><span>Members</span>
                    </div>
                    <div className="flex items-center">
                      <i className='fas fa-plus mr-2'></i>
                    </div>
                  </Link>
                  {isAdminOrOwner(workspace) && (
                  <Link to={`/workspace/${workspace.id}/settings`} className={`group flex gap-2 rounded-lg cursor-pointer p-1 items-center ${hoverClass}`}>
                    <i className='fas fa-gear max768:h-[18px] max768:w-[18px] text-[#4A4A4A] group-hover:text-purple-600' aria-hidden="true"></i>
                    <span className='text-[#4A4A4A] text-[15px] font-semibold group-hover:text-purple-600'>Settings</span>
                  </Link>
                )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
