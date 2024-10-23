import React, { useState, useEffect } from 'react';
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { fetchBoards, deleteBoard } from '../hooks/fetchBoard';
import DeleteConfirmation from './DeleteConfirmation';

const SidebarWorkspace: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [activeBoardId, setActiveBoardId] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: any } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: any, workspaceId: any, boardId: any | null }>({
    isOpen: false,
    workspaceId: null,
    boardId: null
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

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

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const openDeleteConfirmation = (boardId: any, workspaceId: any) => {
    setDeleteConfirmation({ isOpen: true, boardId, workspaceId });
    setShowDeleteConfirmation(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, boardId: null, workspaceId: null });
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

  const handleDeleteBoard = async () => {
    if (deleteConfirmation.boardId && deleteConfirmation.workspaceId) {
      try {
        const response = await deleteBoard(deleteConfirmation.boardId, deleteConfirmation.workspaceId);
        const message = response?.message || 'Board deleted successfully.';
        await fetchBoards(selectedWorkspace.id);
        setAlert({ type: 'success', message: message });
      } catch (error: any) {
        console.error('Failed to delete board:', error);
        let errorMessage = error.response?.data?.error || 'Failed to delete board. Please try again.';
        setAlert({ type: 'error', message: errorMessage });
      } finally {
        closeDeleteConfirmation();
      }
    } handleCancel();
  };

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
        <i className={`fas fa-chevron-right ${isSidebarOpen ? 'transform rotate-180' : ''}`} />
      </div>
      {alert && (
        <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alert.message}
        </div>
      )}
      <aside
        className={`pt-[59px] w-64 bg-white border-r h-screen max768:fixed max768:top-0 max768:left-0 transition-transform duration-300 z-20 ${isSidebarOpen ? 'max768:translate-x-0' : 'max768:-translate-x-full'
          }`}
      >
        <div className="h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
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

            <div className="px-4">
              <h2 className="text-sm font-semibold text-gray-600 mb-2">Your Boards</h2>
              {boards.length > 0 ? (
                boards.map(board => {
                  const boardUrl = `/workspace/${selectedWorkspace ? selectedWorkspace.id : ''}/board/${board.id}`;
                  const isOnBoardPage = location.pathname === boardUrl;

                  return (
                    <div key={board.id} className="relative flex items-center justify-between mb-1">
                      <Link to={boardUrl} className={`text-gray-600 p-2 flex items-center w-full ${hoverClass} ${isActive(boardUrl) ? activeClass : ''}`}>
                        <div className="w-4 h-4 bg-orange-500 rounded-sm mr-2"></div>
                        <span>{board.name}</span>
                        <button
                          onClick={(e) => {
                            if (!isOnBoardPage) {
                              e.preventDefault();
                              navigate(boardUrl);
                            } else {
                              togglePopup(board.id);
                            }
                          }}
                          className="ml-auto"
                        >
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                      </Link>

                      {isPopupVisible && activeBoardId === board.id && isOnBoardPage && (
                        <div 
                        className="fixed bg-white shadow-lg rounded-md p-2"
                        style={{
                          transform: 'translateX(1rem)', // Add some spacing from the sidebar
                          width: '16rem', // w-64
                          zIndex: 50
                        }}
                      >
                          <div className="flex items-center justify-between px-4 py-2 border-b">
                            <span className="text-black">{board.name}</span>
                            <button onClick={() => setIsPopupVisible(false)} className="text-gray-500">
                              <i className="fas fa-times"></i>
                            </button>
                          </div>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              openDeleteConfirmation(selectedWorkspace.id, board.id);
                            }}
                          >
                            Delete Board
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <span>No boards available</span>
              )}
            </div>
          </div>
        </div>
      </aside>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <DeleteConfirmation
            onDelete={handleDeleteBoard}
            onCancel={handleCancel}
            itemType="board"
          />
        </div>
      )}
    </>
  );
};

export default SidebarWorkspace;
