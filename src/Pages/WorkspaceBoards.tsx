import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../hooks/fetchBoard';
import { getTaskBar } from '../hooks/ApiReport'
import CreateBoard from '../Component/CreateBoard';
import WorkspaceHeader from '../Component/WorkspaceHeader';
import WorkspaceReports from './WorkspaceReports';
import DeleteConfirmation from '../Component/DeleteConfirmation';
import config from '../config/baseUrl';
import io from 'socket.io-client';
import useAuth from '../hooks/fetchAuth';

type SortOrder = 'asc' | 'desc' | 'recent'; // Define a type for sorting order

const WorkspaceBoards: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: any }>();
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<any>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, workspaceId: string | null, boardId: string | null }>({
    isOpen: false,
    workspaceId: null,
    boardId: null
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const onLogout = () => {
    console.log('Logout');
  };
  const onSuccess = () => {
    console.log('Success');
  };
  const { userData, fetchUserData } = useAuth(onSuccess, onLogout);
  const [taskBarData, setTaskBarData] = useState<any | null>(null)

  useEffect(() => {
    const handlegetTaskBarData = async () => {
      setTaskBarData(await getTaskBar(workspaceId))

    }
    handlegetTaskBarData()
  }, []);

  const data = taskBarData
  const statusCounts = data?.statusCounts || [];
  const allTaskCount = data?.allTaskCount || 0;

  // Calculate completed tasks (DONE or APPROVED status)
  const completedTasks = statusCounts.reduce((total: any, item: { status: string; count: any; }) => {
    if (item?.status === 'DONE' || item?.status === 'APPROVED') {
      return total + (item.count || 0);
    }
    return total;
  }, 0);

  const completionPercentage = allTaskCount === 0 ? 0 : (completedTasks / allTaskCount) * 100;

  const getPerformanceLevel = () => {
    if (allTaskCount === 0) return { text: 'NO TASKS YET', color: 'text-gray-500' };
    if (completionPercentage >= 80) return { text: 'EXCELLENT', color: 'text-green-500' };
    if (completionPercentage >= 60) return { text: 'GOOD', color: 'text-blue-500' };
    if (completionPercentage >= 40) return { text: 'AVERAGE', color: 'text-yellow-500' };
    return { text: 'NEEDS IMPROVEMENT', color: 'text-red-500' };
  };

  const performance = getPerformanceLevel();


  useEffect(() => {
    if (userData) {
      setCurrentUserId(userData.id);
      console.log("Current User ID:", userData.id); // For debugging
    }
  }, [userData]);

  const isOwner = (board: any) => {
    if (!board || !currentUserId) return false;
    console.log("Comparing board owner:", board.ownerId, "with current user:", currentUserId); // For debugging
    return board.ownerId === currentUserId;
  };

  // Filter boards owned by current user
  const userOwnedBoards = boards.filter(board => isOwner(board));

  const handleCancel = () => {
    setShowDeleteConfirmation(false);
  };

  const openDeleteConfirmation = (boardId: any, workspaceId: any) => {
    setDeleteConfirmation({ isOpen: true, boardId, workspaceId });
    setShowDeleteConfirmation(true);
  };

  useEffect(() => {
    fetchWorkspaceData();
    fetchBoardsData();

    // const socket = io(config);

    // socket.on(`board/${workspaceId}`, () => {
    //   fetchBoardsData();
    // });

    // return () => {
    //   socket.off(`board/${workspaceId}`);
    //   socket.disconnect();
    // };

  }, [workspaceId]);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchWorkspaceData = async () => {
    try {
      const workspaces = await fetchWorkspaces(workspaceId);
      const currentWorkspace = workspaces?.find((ws: any) => ws?.id === workspaceId);
      setWorkspace(currentWorkspace);
    } catch (error) {
      console.error('Failed to fetch workspace:', error);
      setAlert({ type: 'error', message: 'Failed to fetch workspace data. Please try again later.' });
    }
  };

  const fetchBoardsData = async () => {
    try {
      const boardsData = await fetchBoards(workspaceId);
      setBoards(boardsData);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      setAlert({ type: 'error', message: 'Failed to fetch boards data. Please try again later.' });
    }
  };

  const handleCreateBoard = async (workspaceId: string, name: string, description: string, backgroundColor: string) => {
    try {
      const response = await createBoard(workspaceId, name, description, backgroundColor);
      const message = response?.message || 'Board created successfully.';

      // Memperbarui list board setelah create
      await fetchBoardsData();

      setShowCreateBoard(false);
      setAlert({ type: 'success', message: message });
    } catch (error: any) {
      console.error('Failed to create board:', error);
      let errorMessage;
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = 'Failed to create board. Please try again.';
      }
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const handleEditBoard = async (workspaceId: any, boardId: any, name: string, description: string, backgroundColor: string) => {
    try {
      const response = await updateBoard(workspaceId, boardId, name, description, backgroundColor);
      const message = response?.message || 'Board updated successfully.';
      await fetchData();
      setEditingBoard(null);
      setAlert({ type: 'success', message: message });
    } catch (error: any) {
      console.error('Failed to update board:', error);
      let errorMessage;
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = 'Failed to update board. Please try again.';
      }

      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, boardId: null, workspaceId: null });
  };

  const handleDeleteBoard = async () => {
    if (deleteConfirmation.boardId && deleteConfirmation.workspaceId) {
      try {
        const response = await deleteBoard(deleteConfirmation.boardId, deleteConfirmation.workspaceId);
        const message = response?.message || 'Board deleted successfully.';
        await fetchBoardsData();
        setAlert({ type: 'success', message: message });
      } catch (error: any) {
        console.error('Failed to delete board:', error);
        let errorMessage = error?.response?.data?.error || 'Failed to delete board. Please try again.';
        setAlert({ type: 'error', message: errorMessage });
      } finally {
        closeDeleteConfirmation();
      }
    } handleCancel();
  };

  const [sortOrder, setSortOrder] = useState<SortOrder>('recent'); // State for sorting order

  // ... existing useEffect and functions

  // Function to handle sorting change
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(event.target.value as SortOrder); // Type assertion
  };

  // Sort boards based on the selected order
  const sortedBoards = [...boards].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name); // Sort A-Z
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name); // Sort Z-A
    } else {
      // For "Most recently active", you can implement your logic here
      return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime(); // Sort by last active date
    }
  });
  return (
    <div className="bg-white min-h-screen">
      {alert && (
        <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alert.message}
        </div>
      )}
      <WorkspaceHeader workspace={workspace} inviteLinkEnabled={false} />

      <div className='px-6 py-2 text-gray-600'>
        <div className='mb-6'>
          <h2 className='text-lg font-semibold flex items-center'>
            <i className='fas fa-user mr-2 text-xl'></i>
            Your Boards
          </h2>
          <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
            {userOwnedBoards.map((board) => (
              <div
                key={board.id}
                className={`group relative p-1 h-28 w-full rounded-[5px] cursor-pointer overflow-hidden ${board.backgroundColor || 'bg-gray-400'}`}
              >
                <Link to={`/workspace/${workspace?.id}/board/${board?.id}`} onClick={() => {
                  localStorage.setItem('onWorkspace', workspace.id);
                  localStorage.setItem('onBoardId', board.id);
                }}>
                  <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                  <h5 className='text-white relative z-10'>{board?.name}</h5>
                  <div className='absolute right-2 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                    <i
                      className='fas fa-pencil-alt text-white hover:text-yellow-300 mr-2 cursor-pointer'
                      onClick={(e) => {
                        e.preventDefault();
                        setEditingBoard(board);
                      }}
                    />
                    <i
                      className='fas fa-trash text-white hover:text-red-500 cursor-pointer'
                      onClick={(e) => {
                        e.preventDefault();
                        openDeleteConfirmation(workspace?.id, board?.id);
                      }}
                    />
                  </div>
                </Link>
              </div>
            ))}
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
            <div onClick={() => setShowCreateBoard(true)} className='group relative p-1 h-28 w-full bg-gray-400 rounded-[5px] cursor-pointer overflow-hidden flex items-center justify-center text-white'>
              <h5 className='text-white text-center'>Create New Board</h5>
            </div>
          </div>
        </div>
        <div className='mb-8'>
          <h2 className='text-lg font-semibold flex items-center'>
            <i className='fas fa-user-friends mr-2 text-xl'></i>
            All boards in this workspace
          </h2>
          <div className='items-center gap-4 mt-4'>
            <p className='mr-2'>Sort by</p>
            <select
              className='bg-gray-400 border p-1 border-gray-300 text-white rounded-md'
              onChange={handleSortChange}
              value={sortOrder}
            >
              <option value="asc">A-Z</option>
              <option value="desc">Z-A</option>
            </select>
          </div>
          <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
            {sortedBoards.map((board) => (
              <div
                key={board.id}
                className={`group relative p-1 h-28 w-full rounded-[5px] cursor-pointer overflow-hidden ${board.backgroundColor || 'bg-gray-400'}`}
              >
                <Link to={`/workspace/${workspace?.id}/board/${board?.id}`} onClick={() => {
                  localStorage.setItem('onWorkspace', workspace.id);
                  localStorage.setItem('onBoardId', board.id);
                }}>
                  <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                  <h5 className='text-white relative z-10'>{board.name}</h5>
                  <div className='absolute right-2 gap-3 bottom-2 flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                    <i
                      className='fas fa-pencil-alt text-white hover:text-yellow-300 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingBoard(board);
                      }}
                    />
                    <i
                      className='fas fa-trash text-white hover:text-red-500 cursor-pointer'
                      onClick={(e) => {
                        e.preventDefault();
                        openDeleteConfirmation(workspace?.id, board?.id);
                      }}
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-1 shadow-sm mt-8 rounded-lg w-2/3">
          {workspace && ( // Tambahkan pengecekan workspace
            <Link to={`/workspace/${workspace?.id}/reports`} className="block">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h2 className="text-gray-700 text-lg font-medium">
                      YOUR PERFORMANCE THIS WEEK, <span className={performance.color}>{performance.text}</span>
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {allTaskCount === 0
                        ? "No tasks assigned yet. Tasks will appear here when assigned."
                        : "Complete task to fill the performance bar!"}
                    </p>
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                  </div>
                  <div className="overflow-hidden h-1 text-xs flex rounded bg-gray-200">
                    <div
                      className={`${allTaskCount === 0 ? 'bg-gray-400' : 'bg-blue-500'}`}
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className='flex justify-between'>
                  <div className="text-sm text-gray-600">
                    Bar resetting in: {data?.resettingIn || 'N/A'}
                  </div>
                  <div className="text-gray-600 right-0 relative">
                    {completedTasks}/{allTaskCount}
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>

      {showCreateBoard && (
        <CreateBoard
          workspaceId={workspaceId}
          onClose={() => setShowCreateBoard(false)}
          onCreateBoard={handleCreateBoard}
        />
      )}
      {editingBoard && (
        <CreateBoard
          workspaceId={workspaceId}
          onClose={() => setEditingBoard(null)}
          onCreateBoard={handleEditBoard}
          initialData={editingBoard}
          isEditing={true}
        />
      )}
    </div>
  );
};

export default WorkspaceBoards;
