import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../hooks/fetchBoard';
import CreateBoard from '../Component/CreateBoard';
import ConfirmationAlert from '../Component/Alert';
import WorkspaceHeader from '../Component/WorkspaceHeader';

const WorkspaceBoards: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: any }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<any>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, workspaceId: any, boardId: string | null }>({
    isOpen: false,
    workspaceId: null,
    boardId: null
  });

  useEffect(() => {
    fetchWorkspaceData();
    fetchBoardsData();
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
      const currentWorkspace = workspaces.find((ws: any) => ws.id === workspaceId);
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

  const handleCreateBoard = async (workspaceId: any, name: any, description: any) => {
    console.log('Creating board with:', {workspaceId, name, description });
    try {
      const response = await createBoard(workspaceId, name, description);
      const message = response?.message || 'Board created successfully.';
      await fetchBoardsData();
      setShowCreateBoard(false);
      setAlert({ type: 'success', message: message });
    } catch (error: any) {
      console.error('Failed to create board:', error);
      let errorMessage = error.response?.data?.error || 'Failed to create board. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const handleEditBoard = async (workspaceId: any, boardId: any, name: any, description: any) => {
    console.log(boardId);
    console.log(name);
    console.log(description);
    try {
      const response = await updateBoard(workspaceId, boardId, name, description);
      const message = response?.message || 'Board updated successfully.';
      await fetchBoardsData();
      setEditingBoard(null);
      setAlert({ type: 'success', message: message });
    } catch (error: any) {
      console.error('Failed to update board:', error);
      let errorMessage = error.response?.data?.error || 'Failed to update board. Please try again.';
      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const openDeleteConfirmation = (boardId: any, workspaceId: any) => {
    setDeleteConfirmation({ isOpen: true, boardId, workspaceId });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, boardId: null, workspaceId: null });
  };

  const handleDeleteBoard = async () => {
    if (deleteConfirmation.boardId && deleteConfirmation.workspaceId) {
      try {
        const response = await deleteBoard(deleteConfirmation.boardId,  deleteConfirmation.workspaceId);
        const message = response?.message || 'Board deleted successfully.';
        await fetchBoardsData();
        setAlert({ type: 'success', message: message });
      } catch (error: any) {
        console.error('Failed to delete board:', error);
        let errorMessage = error.response?.data?.error || 'Failed to delete board. Please try again.';
        setAlert({ type: 'error', message: errorMessage });
      } finally {
        closeDeleteConfirmation();
      }
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {alert && (
        <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alert.message}
        </div>
      )}
      <WorkspaceHeader workspace={workspace}/>

      <div className='px-6 py-2 text-gray-600'>
        <div className='mb-6'>
          <h2 className='text-lg font-semibold flex items-center'>
            <i className='fas fa-user mr-2 text-xl'></i>
            Your Boards
          </h2>
          <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
            {boards.map((board) => (
              <div
                key={board.id}
                className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden'
              >
              <Link to={`/workspace/${workspace?.id}/board/${board.id}`}>
                <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                <h5 className='text-white relative z-10'>{board.name}</h5>
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
                      openDeleteConfirmation(workspace?.id, board.id);
                    }}
                  />
                </div>
                </Link>
              </div>
            ))}
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
            <select className='bg-gray-400 border p-1 border-gray-300 text-white rounded-md'>
              <option>Most recently active</option>
            </select>
          </div>
          <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
            {boards.map((board) => (
              <div
                key={board.id}
                className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden'
              >
                <Link to={`/workspace/${workspace?.id}/board/${board.id}`}>
                <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                <h5 className='text-white relative z-10'>{board.name}</h5>
                <div className='absolute right-2 gap-3 bottom-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
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
                      e.stopPropagation();
                      openDeleteConfirmation(board.id, workspace.id);
                    }}
                  />
                </div>
              </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold'>YOUR PERFORMANCE THIS WEEK</h2>
          <p className='text-gray-700 mt-2'>Complete task to fill the performance bar!</p>
          <div className='flex items-center mt-4'>
            <div className='w-2/3 bg-gray-300 h-1 rounded-md'>
              <div className='bg-blue-500 h-1 rounded-md' style={{ width: '35%' }}></div>
            </div>
            <span className='ml-4'>2/5</span>
          </div>
          <p className='text-gray-500 mt-2'>Bar resetting in : 4d 12h</p>
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
      <ConfirmationAlert
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteBoard}
        message="Are you sure you want to delete this board? This action cannot be undone."
      />
    </div>
  );
};

export default WorkspaceBoards;
