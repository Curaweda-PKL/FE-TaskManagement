import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import ChevronRight from '../assets/Media/ChevronRight.svg';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { fetchBoards } from '../hooks/fetchBoard';
import DeleteConfirmation from './DeleteConfirmation';

const SidebarWorkspace: React.FC = () => {
  const location = useLocation();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] = useState(false);

  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";
  const activeClass = "bg-gray-100 text-purple-600";

  const isActive = (path: string) => location.pathname === path;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const togglePopup = (boardId: string) => {
    setActiveBoardId(boardId);
    setIsPopupVisible(!isPopupVisible);
  };

  const showDeleteConfirmation = () => {
    setIsPopupVisible(false);
    setIsDeleteConfirmationVisible(true);
  };

  const handleDeleteBoard = () => {
    console.log('Board deleted');
    setIsDeleteConfirmationVisible(false);
  };

  const handleClosePopup = () => {
    setIsDeleteConfirmationVisible(false);
  };

  useEffect(() => {
    const getWorkspaces = async () => {
      try {
        const data = await fetchWorkspaces(workspaces);
        setWorkspaces(data);
        if (data.length > 0) {
          const defaultWorkspace = data.find((ws: any) => ws.id === workspaceId);
          setSelectedWorkspace(defaultWorkspace || data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch workspaces:', error);
      }
    };

    getWorkspaces();
  }, [workspaceId]);

  useEffect(() => {
    const getBoards = async () => {
      if (selectedWorkspace) {
        try {
          const data = await fetchBoards(selectedWorkspace.id);
          setBoards(data);
        } catch (error) {
          console.error('Failed to fetch boards:', error);
        }
      }
    };

    getBoards();
  }, [selectedWorkspace]);

  return (
    <>
      <div
        className={`fixed top-2 left-1 max768:inline hidden bg-white rounded-full p-1 shadow-2xl cursor-pointer transition-all duration-300 z-30`}
        onClick={toggleSidebar}
      >
        <img src={ChevronRight} alt="" className={`${isSidebarOpen ? 'transform rotate-180' : ''}`} />
      </div>
      <aside className={`pt-16 w-64 bg-white border-r h-screen max768:fixed max768:top-0 max768:left-0 transition-transform duration-300 z-20 ${isSidebarOpen ? 'max768:translate-x-0' : 'max768:-translate-x-full'}`}>
        <div className="mb-4">
          <div className={`flex items-center justify-between border-b w-full p-4`}>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 mr-2"></div>
              <span className="text-black font-medium">{selectedWorkspace ? selectedWorkspace.name : 'Loading...'}</span>
            </div>
          </div>
          <div className="mt-2 space-y-1 px-4">
            <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/boards-ws`} 
                className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive(`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/boards-ws`) ? activeClass : ''}`}>
                <i className="fas fa-th-large mr-2"></i><span>Boards</span>
            </Link>
            <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/members`} 
                className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive(`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/members`) ? activeClass : ''}`}>
                <i className="fas fa-user-friends mr-2"></i><span>Members</span>
            </Link>
            <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/settings`} 
                className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive(`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/settings`) ? activeClass : ''}`}>
                <i className="fas fa-cog mr-2"></i><span>Workspace Settings</span>
            </Link>
          </div>
        </div>

        <div className="mb-4 px-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Workspace View</h2>
          <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/reports`} 
              className={`text-gray-600 p-2 flex items-center ${hoverClass} ${isActive(`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/reports`) ? activeClass : ''}`}>
              <i className="fas fa-book-open mr-2"></i><span>Reports</span>
          </Link>
        </div>

        <div className="mb- px-4">
          <h2 className="text-sm font-semibold text-gray-600 mb-2">Your Boards</h2>
          {boards.length > 0 ? (
            boards.map(board => (
              <div key={board.id} className="relative flex items-center mb-1 justify-between">
                <Link to={`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/board/${board.id}`} 
                    className={`text-gray-600 p-2 flex items-center w-full ${hoverClass} ${isActive(`/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/board/${board.id}`) ? activeClass : ''}`}>
                    <div className="w-4 h-4 bg-orange-500 rounded-sm mr-2"></div>
                    <span>{board.name}</span>
                    <button onClick={() => togglePopup(board.id)} className="ml-auto">
                  <i className="fas fa-ellipsis-h"></i>
                </button>
                </Link>

                {isPopupVisible && activeBoardId === board.id && (
                  <div className="absolute right-[-120%] top-0 w-64 bg-white shadow-lg rounded-md p-2 z-50">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                      <span className="font-semibold">{board.name}</span>
                      <button onClick={() => setIsPopupVisible(false)} className="text-gray-500">
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <button 
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      onClick={showDeleteConfirmation}
                    >
                      Close Board
                    </button>
                  </div>
                )}

              </div>
            ))
          ) : (
            <span>No boards available</span>
          )}
        </div>
      </aside>

      {isDeleteConfirmationVisible && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <DeleteConfirmation
            onDelete={handleDeleteBoard}
            onCancel={handleClosePopup}
          />
        </div>
      )}
    </>
  );
};

export default SidebarWorkspace;
