import React, { useState, useEffect } from 'react';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { fetchBoards, createBoard, updateBoard, deleteBoard } from '../hooks/fetchBoard';
import CreateBoard from '../Component/CreateBoard';
import ConfirmationAlert from '../Component/Alert';

interface Toolbar {
  id: number;
  name: string;
  icon: string;
}

const Workspace: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [editingBoard, setEditingBoard] = useState<any>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: any } | null>(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState<{ isOpen: any, boardId: any | null }>({
    isOpen: false,
    boardId: null
  });

  const toolbars: Toolbar[] = [
    { id: 1, name: "Board", icon: "fa-th-large" },
    { id: 2, name: "Report", icon: "fa-book-open" },
    { id: 3, name: "Member", icon: "fa-user" },
    { id: 4, name: "Settings", icon: "fa-cog" },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
      const workspaceData = await fetchWorkspaces(Workspace);
      const updatedWorkspaces = await Promise.all(
        workspaceData.map(async (workspace: any) => {
          const boards = await fetchBoards(workspace.id);
          return { ...workspace, boards };
        })
      );

      setWorkspaces(updatedWorkspaces);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
      setAlert({ type: 'error', message: 'Failed to fetch workspace data. Please try again later.' });
    }
  };

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

  const handleEditBoard = async (boardId: any, name: string, description: string) => {
    try {
      const response = await updateBoard(boardId, name, description);
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
        const message = response?.message;
        await fetchData();
        setAlert({ type: 'success', message: message });
      } catch (error: any) {
        console.error(error);
        let errorMessage;
        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        } else {
          errorMessage = 'An unexpected error occurred';
        }
        
        setAlert({ type: 'error', message: errorMessage });
      } finally {
        closeDeleteConfirmation();
      }
    }
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
        <div className="group flex py-2 px-3 gap-3 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer hover:bg-[rgba(131,73,255,0.2)] transition-colors duration-300 items-center" onClick={openModal}>
          <i className='fas fa-user-plus text-gray-700 max768:h-[18px] max768:w-[18px]' />
          <span className="text-[#4A4A4A] font-semibold text-[15px] group-hover:text-[#7000FF] transition-colors duration-300">Join Workspace</span>
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
                {toolbars.map((toolbar) => (
                  <div key={toolbar.id} className='group hover:bg-[rgba(131,73,255,0.2)] transition-colors duration-300 flex gap-2 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer py-2 px-3 items-center'>
                    <i className={`fas ${toolbar.icon} max768:h-[18px] max768:w-[18px] text-[#4A4A4A]`} aria-hidden="true"></i>
                    <span className='text-[#4A4A4A] text-[15px] font-semibold group-hover:text-[#7000FF] transition-colors duration-300'>{toolbar.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
              {workspace.boards && workspace.boards.map((board: any) => (
                <div
                  key={board.id}
                  className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden'
                >
                  <div className='absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-200'></div>
                  <h5 className='text-white relative z-10'>{board.name}</h5>
                  <div className='absolute right-2 bottom-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10'>
                    <i
                      className='fas fa-pencil text-white hover:text-yellow-300 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        openEditBoard(board);
                      }}
                    />
                    <i
                      className='fas fa-trash text-white hover:text-red-500 cursor-pointer'
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteConfirmation(board.id);
                      }}
                    />
                  </div>
                </div>
              ))}
              <div onClick={() => openCreateBoard(workspace.id)} className='group relative p-1 h-28 w-full bg-gray-400 rounded-[5px] cursor-pointer overflow-hidden flex items-center justify-center text-white'>
                <h5 className='text-white text-center'>Create New Board</h5>
              </div>
            </div>
          </div>
        ))}

        <ConfirmationAlert
          isOpen={deleteConfirmation.isOpen}
          onClose={closeDeleteConfirmation}
          onConfirm={handleDeleteBoard}
          message="Are you sure you want to delete this board? This action cannot be undone."
        />
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
            <form>
              <label htmlFor="workspaceId" className="block mb-2 text-black font-semibold">ID Workspace</label>
              <input
                type="text"
                id="workspaceId"
                placeholder="Type here..."
                className="w-full p-2 border bg-white border-gray-300 rounded mb-4 text-black"
              />
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={closeModal} className="bg-gray-200 font-semibold px-4 py-2 rounded hover:bg-gray-300 text-black">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white font-semibold px-4 py-2 rounded hover:bg-blue-700">Join</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;
