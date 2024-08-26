import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserFriends, faBars, faUserPlus, faX, faCheck, faTimes, faLink, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../hooks/fetchBoard';
import CreateBoard from '../Component/CreateBoard';
import ConfirmationAlert from '../Component/Alert';

const WorkspaceBoards: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: any }>();
  const [workspace, setWorkspace] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isRequestOpen, setIsRequest] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<any>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: boolean, boardId: string | null }>({
    isOpen: false,
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
      console.log('Fetched boards data:', boardsData);
      setBoards(boardsData);
    } catch (error) {
      console.error('Failed to fetch boards:', error);
      setAlert({ type: 'error', message: 'Failed to fetch boards data. Please try again later.' });
    }
  };

  const handleCreateBoard = async (workspaceId : any, name: any, description: any) => {
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

  const handleEditBoard = async (boardId: any, name: any, description: any) => {
    console.log(boardId);
    console.log(name);
    console.log(description);
    try {
      const response = await updateBoard(boardId, name, description);
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

  const openDeleteConfirmation = (boardId: any) => {
    setDeleteConfirmation({ isOpen: true, boardId });
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmation({ isOpen: false, boardId: null });
  };

  const handleDeleteBoard = async () => {
    if (deleteConfirmation.boardId) {
      try {
        const response = await deleteBoard(deleteConfirmation.boardId);
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

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenInvite = () => {
    setIsModalOpen(false);
    setIsInviteOpen(true);
  };
  const handleOpenRequest = () => {
    setIsModalOpen(false);
    setIsRequest(true);
  };
  const handleOpenJoin = () => {
    setIsModalOpen(false);
    setIsJoinOpen(true);
  };
  const handleClose = () => {
    setIsJoinOpen(false);
    setIsRequest(false);
    setIsInviteOpen(false);
  };

  return (
    <div className="bg-white min-h-screen">
      {alert && (
        <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alert.message}
        </div>
      )}
      <div className="flex items-center justify-between bg-white p-4 border-b -4 mx-6 mt-0 mb-2">
        <div className="flex items-center font-sem">
          <div className="w-11 h-11 bg-red-700 mr-3"></div>
          <div>
            <h1 className="text-lg font-bold">{workspace ? workspace.name : 'Loading...'}</h1>
            <p className="text-sm flex items-center mt-1">
              <FontAwesomeIcon icon={faLock} className="w-4 h-4 mr-1" />
              Private | Workspace id : {workspace ? workspace.id : 'Loading...'}
            </p>
          </div>
        </div>
        <button className='text-xl' onClick={handleOpenModal}><FontAwesomeIcon icon={faBars} /></button>
      </div>
      <div className='mx-6'>
        <div className='mb-8'>
          <h2 className='text-xl font-bold flex items-center'>
            <FontAwesomeIcon icon={faUser} className='mr-2' />
            Your Boards
          </h2>
          <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
            {boards.map((board) => (
              <div
                key={board.id}
                className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden'
              >
                <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                <h5 className='text-white relative z-10'>{board.name}</h5>
                <div className='absolute right-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className='text-white hover:text-yellow-300 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBoard(board);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className='text-white hover:text-red-500 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(board.id);
                    }}
                  />
                </div>
              </div>
            ))}
            <div onClick={() => setShowCreateBoard(true)} className='group relative p-1 h-28 w-full bg-gray-400 rounded-[5px] cursor-pointer overflow-hidden flex items-center justify-center text-white'>
              <h5 className='text-white text-center'>Create New Board</h5>
            </div>
          </div>
        </div>
        <div className='mb-8'>
          <h2 className='text-xl font-bold flex items-center'>
            <FontAwesomeIcon icon={faUserFriends} className='mr-2' />
            All boards in this workspace
          </h2>
          <div className='items-center gap-4 mt-4'>
            <p className='mr-2'>Sort by</p>
            <select className='bg-gray-400 border p-2 border-gray-300 text-white rounded-md'>
              <option>Most recently active</option>
            </select>
          </div>
          <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
            {boards.map((board) => (
              <div
                key={board.id}
                className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden'
              >
                <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                <h5 className='text-white relative z-10'>{board.name}</h5>
                <div className='absolute right-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                  <FontAwesomeIcon
                    icon={faPencilAlt}
                    className='text-white hover:text-yellow-300 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBoard(board);
                    }}
                  />
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className='text-white hover:text-red-500 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(board.id);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className='text-xl font-bold'>YOUR PERFORMANCE THIS WEEK</h2>
          <p className='text-gray-700 mt-2'>Complete task to fill the performance bar!</p>
          <div className='flex items-center mt-4'>
            <div className='w-full bg-gray-300 h-2 rounded-md'>
              <div className='bg-blue-500 h-2 rounded-md' style={{ width: '40%' }}></div>
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
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white p-10 rounded-md shadow-md w-96 relative right-16 top-0 cursor-pointer">
            <FontAwesomeIcon icon={faX} className='absolute top-4 right-4 cursor-pointer' onClick={handleCloseModal} />
            <div className='bg-gray-200 p-2 rounded-md text-gray-500 font-bold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300' onClick={handleOpenInvite}>
              <FontAwesomeIcon icon={faUserPlus} className='black' />
              <span className='ml-2' >Invite Workspace Member</span>
            </div>
            <div className='bg-gray-200 p-2 rounded-md text-gray-500 font-bold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300 mt-2' onClick={handleOpenJoin}>
              <FontAwesomeIcon icon={faUserPlus} className='black' />
              <span className='ml-2'>Join Workspace</span>
            </div>
            <div className='bg-gray-200 p-2 rounded-md text-gray-500 font-bold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300 mt-2' onClick={handleOpenRequest}>
              <FontAwesomeIcon icon={faUserPlus} className='black' />
              <span className='ml-2'>Join Request (0)</span>
            </div>
          </div>
        </div>
      )}
      {isJoinOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white rounded-lg p-6 w-80 relative right-16">
            <h2 className="text-xl font-bold mb-4">Join Workspace</h2>
            <div className="mb-4">
              <label htmlFor="workspace-id" className="block text-sm font-medium text-gray-700 mb-1">
                Id Workspace
              </label>
              <input
                type="text"
                id="workspace-id"
                placeholder="Type here..."
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div className="flex justify-between">
              <button className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100" onClick={handleClose}>
                Cancel
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {isRequestOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white rounded-lg shadow-lg w-[500px] relative right-16">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Request Join Workspace</h3>
              <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={handleClose} />
            </div>
            <div className="p-4">
              <div className="flex items-center bg-teal-100 p-2 rounded-md">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Profile"
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div className="flex-1">
                  <p className="font-bold text-black">M Najwan M</p>
                  <p className="text-sm text-gray-600">najwanmuttaqin@gmail.com</p>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-black py-1 px-3 rounded">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Accept
                  </button>
                  <button className="flex items-center bg-gray-200 hover:bg-gray-300 text-black py-1 px-3 rounded">
                    <FontAwesomeIcon icon={faTimes} className="mr-2" />
                    Decline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white rounded-lg shadow-lg w-[350px] relative right-16">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Invite Member Workspace</h3>
              <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={handleClose} />
            </div>
            <div className="p-4 flex flex-col space-y-2">
              <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md">
                <FontAwesomeIcon icon={faLink} className="mr-2" />
                Invite with link
              </button>
              <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md">
                <FontAwesomeIcon icon={faLink} className="mr-2" />
                Copy Workspace id
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white p-10 rounded-md shadow-md w-96 relative right-16 top-0 cursor-pointer">
            <FontAwesomeIcon icon={faX} className='absolute top-4 right-4 cursor-pointer' onClick={handleCloseModal} />
            <div className='bg-gray-200 p-2 rounded-md text-gray-500 font-bold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300' onClick={handleOpenInvite}>
              <FontAwesomeIcon icon={faUserPlus} className='black' />
              <span className='ml-2' >Invite Workspace Member</span>
            </div>
            <div className='bg-gray-200 p-2 rounded-md text-gray-500 font-bold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300 mt-2' onClick={handleOpenJoin}>
              <FontAwesomeIcon icon={faUserPlus} className='black' />
              <span className='ml-2'>Join Workspace</span>
            </div>
            <div className='bg-gray-200 p-2 rounded-md text-gray-500 font-bold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300 mt-2' onClick={handleOpenRequest}>
              <FontAwesomeIcon icon={faUserPlus} className='black' />
              <span className='ml-2'>Join Request (0)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceBoards;