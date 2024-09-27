import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { fetchWorkspaces, joinWorkspace, requestJoinWorkspace } from '../hooks/fetchWorkspace';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../hooks/fetchBoard';
import CreateBoard from '../Component/CreateBoard';
import DeleteConfirmation from '../Component/DeleteConfirmation';

const Workspace: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<any>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: any } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: any, workspaceId: any, boardId: any | null }>({
    isOpen: false,
    workspaceId: null,
    boardId: null
  });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [joinWorkspaceId, setJoinWorkspaceId] = useState<string>('');
  const [isPrivateWorkspace, setIsPrivateWorkspace] = useState(false);
  const navigate = useNavigate();
  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setIsPrivateWorkspace(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const workspaceData = await fetchWorkspaces(workspaces);
      const updatedWorkspaces = await Promise.all(
        workspaceData.map(async (workspace: any) => {
          const boards = await fetchBoards(workspace.id);
          return { ...workspace, boards };
        })
      );

      setWorkspaces(updatedWorkspaces);
      setLoading(false);
    } catch (err: any) {
      // handleApiError(err);
      setError(err.message);
      setLoading(false);
      setAlert({ type: 'error', message: 'Failed to fetch workspace data. Please try again later.' });
    }
  };

  const handleJoinWorkspace = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.get(`/workspace/${joinWorkspaceId}`);
      const workspace = response.data;

      if (workspace.isPublic) {
        await joinWorkspace(joinWorkspaceId);
        const updatedWorkspaces = await fetchWorkspaces(workspaces);
        setWorkspaces(updatedWorkspaces);
        closeModal();
      } else {
        setIsPrivateWorkspace(true);
      }
    } catch (error: any) {
      console.error('Failed to join workspace:', error);
      let errorMessage;
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      } else {
        errorMessage = 'Failed to join workspace. Please try again.';
      }

      setAlert({ type: 'error', message: errorMessage });
    }
  };

  const handleRequestJoin = async () => {
    try {
      await requestJoinWorkspace(joinWorkspaceId);
      setAlert({ type: 'success', message: 'Join request sent successfully.' });
      closeModal();
    } catch (error: any) {
      console.error('Failed to request join:', error);
      setAlert({ type: 'error', message: 'Failed to send join request. Please try again.' });
    }
  };

  // const handleApiError = (error: any) => {
  //   if (error.response?.status === 401) {
  //     navigate('/signin');
  //   } else {
  //     setError(error.message);
  //     setAlert({ type: 'error', message: 'An unexpected error occurred. Please try again later.' });
  //   }
  // };

  const handleCreateBoard = async (workspaceId: string, name: string, description: string) => {
    try {
      const response = await createBoard(workspaceId, name, description);
      const message = response?.message || 'Board created successfully.';
      await fetchData();
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

  const handleEditBoard = async (workspaceId: any, boardId: any, name: string, description: string) => {
    try {
      const response = await updateBoard(workspaceId, boardId, name, description);
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

  const handleDeleteBoard = async () => {
    if (deleteConfirmation.boardId && deleteConfirmation.workspaceId) {
      try {
        const response = await deleteBoard(deleteConfirmation.boardId, deleteConfirmation.workspaceId);
        const message = response?.message || 'Board deleted successfully.';
        await fetchData();
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

  const openCreateBoard = (workspaceId: any) => {
    setCurrentWorkspaceId(workspaceId);
    setShowCreateBoard(true);
  };

  const openEditBoard = (board: any) => {
    setEditingBoard(board);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {alert && (
        <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alert.message}
        </div>
      )}
      <section className='flex items-center gap-5'>
        <h1 className='text-black font-bold text-2xl max768:text-xl'>YOUR WORKSPACE</h1>
        <div className={`group flex py-2 px-3 gap-3 bg-[rgba(131,73,255,0.1)] rounded-lg items-center ${hoverClass}`} onClick={openModal}>
          <i className='fas fa-user-plus text-gray-700 max768:h-[18px] max768:w-[18px] group-hover:text-purple-600' />
          <span className='text-[#4A4A4A] font-semibold text-[15px] group-hover:text-purple-600'>Join Workspace</span>
        </div>
      </section>

      <section className='flex flex-col gap-10 mt-9'>
        {workspaces.map((workspace: any) => (
          <div key={workspace.id}>
            <div className='mt-3 flex justify-between max-w-[905px] max1000:flex-col max1000:gap-3'>
              <div className='flex items-center gap-2 max-w-[300px] overflow-hidden'>
                <div className='min-h-5 max768:min-h-[18px] max768:min-w-[18px] min-w-5 bg-[#AE1616]'></div>
                <span className='font-semibold text-[#4A4A4A] text-[15px] overflow-hidden text-ellipsis whitespace-nowrap'>{workspace.name}</span>
              </div>
              <div className='grid grid-cols-4 max850:grid-cols-2 gap-5 max850:gap-2'>
                <Link to={`/workspace/${workspace.id}/boards-ws`} className={`group flex gap-2 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer py-2 px-3 items-center ${hoverClass}`}>
                  <i className='fas fa-th-large max768:h-[18px] max768:w-[18px] text-[#4A4A4A] group-hover:text-purple-600' aria-hidden="true"></i>
                  <span className='text-[#4A4A4A] text-[15px] font-semibold group-hover:text-purple-600'>Board</span>
                </Link>
                <Link to={`/workspace/${workspace.id}/reports`} className={`group flex gap-2 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer py-2 px-3 items-center ${hoverClass}`}>
                  <i className='fas fa-book-open max768:h-[18px] max768:w-[18px] text-[#4A4A4A] group-hover:text-purple-600' aria-hidden="true"></i>
                  <span className='text-[#4A4A4A] text-[15px] font-semibold group-hover:text-purple-600'>Report</span>
                </Link>
                <Link to={`/workspace/${workspace.id}/members`} className={`group flex gap-2 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer py-2 px-3 items-center ${hoverClass}`}>
                  <i className='fas fa-users max768:h-[18px] max768:w-[18px] text-[#4A4A4A] group-hover:text-purple-600' aria-hidden="true"></i>
                  <span className='text-[#4A4A4A] text-[15px] font-semibold group-hover:text-purple-600'>Member</span>
                </Link>
                <Link to={`/workspace/${workspace.id}/settings`} className={`group flex gap-2 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer py-2 px-3 items-center ${hoverClass}`}>
                  <i className='fas fa-gear max768:h-[18px] max768:w-[18px] text-[#4A4A4A] group-hover:text-purple-600' aria-hidden="true"></i>
                  <span className='text-[#4A4A4A] text-[15px] font-semibold group-hover:text-purple-600'>Settings</span>
                </Link>
              </div>
            </div>

            <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
              {workspace.boards && workspace.boards.map((board: any) => (
                <div
                  key={board.id}
                  className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden'
                >
                  <Link to={`/workspace/${workspace.id}/board/${board.id}`}>
                    <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                    <h5 className='text-white relative z-10'>{board.name}</h5>
                    <div className='absolute right-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                      <i
                        className='fas fa-pencil text-white hover:text-yellow-300 cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          openEditBoard(board);
                        }}
                      />
                      <i
                        className='fas fa-trash text-white hover:text-red-500 cursor-pointer'
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          openDeleteConfirmation(workspace.id, board.id);
                        }}
                      />
                    </div>
                  </Link>

                </div>
              ))}
              <div onClick={() => openCreateBoard(workspace.id)} className='group relative p-1 h-28 w-full bg-gray-400 rounded-[5px] cursor-pointer overflow-hidden flex items-center justify-center text-white'>
                <h5 className='text-white text-center'>Create New Board</h5>
              </div>
            </div>
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
      </section>

      {showCreateBoard && (
        <CreateBoard
          workspaceId={currentWorkspaceId}
          onClose={() => setShowCreateBoard(false)}
          onCreateBoard={handleCreateBoard}
        />
      )}

      {editingBoard && (
        <CreateBoard
          workspaceId={editingBoard.workspaceId}
          onClose={() => setEditingBoard(null)}
          onCreateBoard={handleEditBoard}
          initialData={editingBoard}
          isEditing={true}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 flex flex-col gap-5">
            <h2 className="text-xl text-center font-bold mb-4 text-black">Join Workspace</h2>
            {!isPrivateWorkspace ? (
              <form onSubmit={handleJoinWorkspace}>
                <label htmlFor="workspaceId" className="block mb-2 text-black font-semibold">Workspace ID</label>
                <input
                  type="text"
                  value={joinWorkspaceId}
                  onChange={(e) => setJoinWorkspaceId(e.target.value)}
                  placeholder="Type here..."
                  className="w-full p-2 border bg-white border-gray-300 rounded mb-4 text-black"
                />
                <div className="flex gap-3 justify-end mt-8">
                  <button type="button" onClick={closeModal} className="bg-gray-200 font-semibold px-4 py-2 rounded hover:bg-gray-300 text-black">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700">Join</button>
                </div>
              </form>
            ) : (
              <div>
                <p className="text-black mb-4">This workspace is private. Would you like to send a join request?</p>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={closeModal} className="bg-gray-200 font-semibold px-4 py-2 rounded hover:bg-gray-300 text-black">Cancel</button>
                  <button onClick={handleRequestJoin} className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700">Send Request</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
