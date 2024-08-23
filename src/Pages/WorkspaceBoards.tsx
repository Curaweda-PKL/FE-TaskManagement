import React, { useState, useEffect } from 'react';
import CreateBoard from '../Component/CreateBoard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserFriends, faBars, faUserPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { fetchBoards } from '../hooks/fetchBoard';

const WorkspaceBoards: React.FC<{ workspaceId: string }> = ({ workspaceId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [workspace, setWorkspace] = useState<any>(null);
  const [boards, setBoards] = useState<any[]>([]);
  const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
  const [boardDetails, setBoardDetails] = useState<any>(null);

  const isWorkspaceLayout = location.pathname === '/workspace/boards-ws';

  useEffect(() => {
    const fetchData = async () => {
      if (workspaceId) {
        try {
          const workspaceData = await fetchWorkspaces(workspaceId);
          setWorkspace(workspaceData);

          const boardsData = await fetchBoards(workspaceId);
          setBoards(boardsData);

          // Optionally set the first board as the default selected board
          if (boardsData.length > 0) {
            setSelectedBoardId(boardsData[0].id);
          }
        } catch (error) {
          console.error('Failed to fetch workspace or boards:', error);
        }
      }
    };

    fetchData();
  }, [workspaceId]);

  useEffect(() => {
    const fetchBoard = async () => {
      if (selectedBoardId) {
        try {
          const boardData = await fetchBoards(selectedBoardId);
          setBoardDetails(boardData);
        } catch (error) {
          console.error('Failed to fetch board details:', error);
        }
      }
    };

    fetchBoard();
  }, [selectedBoardId]);

  const handleOpenInvite = () => {
    setIsModalOpen(false);
    setIsInviteOpen(true);
  };

  const handleOpenRequest = () => {
    setIsModalOpen(false);
    setIsRequestOpen(true);
  };

  const closeCreateBoard = () => {
    setShowCreateBoard(false);
  };

  const handleCreateBoardClick = () => {
    setShowCreateBoard(true);
  };

  const handleOpenJoin = () => {
    setIsModalOpen(false);
    setIsJoinOpen(true);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsJoinOpen(false);
    setIsRequestOpen(false);
    setIsInviteOpen(false);
  };

  const handleBoardSelect = (id: string) => {
    setSelectedBoardId(id);
  };

  return (
    <div className={`bg-white min-h-screen ${isWorkspaceLayout ? '' : ''}`}>
      <div className="flex items-center justify-between bg-white p-4 border-black border-b-2 -4 mx-6 mt-0 mb-2">
        <div className="flex items-center font-sem">
          <div className="w-11 h-11 bg-red-700 mr-3"></div>
          <div>
            <h1 className="text-lg font-bold">{workspace?.name || "Workspace"}</h1>
            <p className="text-sm flex items-center mt-1">
              <FontAwesomeIcon icon={faLock} className="w-4 h-4 mr-1" />
              Private | Workspace id : {workspace?.id || 'N/A'}
            </p>
          </div>
        </div>
        <button className='text-xl' onClick={handleOpenModal}><FontAwesomeIcon icon={faBars} /></button>
      </div>
      <div className='flex'>
        <div className='w-1/4 bg-gray-100 p-4'>
          <h2 className='text-xl font-bold mb-4'>Boards</h2>
          <ul className='space-y-2'>
            {boards.map((board) => (
              <li
                key={board.id}
                onClick={() => handleBoardSelect(board.id)}
                className={`cursor-pointer p-2 rounded-md ${selectedBoardId === board.id ? 'bg-blue-200' : 'hover:bg-gray-200'}`}
              >
                {board.name}
              </li>
            ))}
          </ul>
        </div>
        <div className='flex-1 p-4'>
          {boardDetails ? (
            <div>
              <h2 className='text-xl font-bold'>{boardDetails.name}</h2>
              <p className='text-gray-700'>{boardDetails.description}</p>
              {/* Render other board details here */}
            </div>
          ) : (
            <p>Select a board to see details.</p>
          )}
        </div>
      </div>
      {showCreateBoard && (
        <CreateBoard onClose={closeCreateBoard} />
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
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Join Workspace
              </button>
            </div>
          </div>
        </div>
      )}
      {isRequestOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white rounded-lg p-6 w-[500px] relative right-16">
            <h2 className="text-xl font-bold mb-4">Request Access</h2>
            <div className="mb-4">
              <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">
                Request Reason
              </label>
              <textarea
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md"
              ></textarea>
            </div>
            <div className="flex justify-end mt-4">
              <button
                className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100"
                onClick={handleClose}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white rounded-lg p-6 w-[500px] relative right-16">
            <h2 className="text-xl font-bold mb-4">Invite User</h2>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Type here..."
                className="w-full p-2 border border-gray-300 rounded-md bg-white"
              />
            </div>
            <div className="flex justify-between">
              <button className="text-gray-600 px-4 py-2 rounded-md hover:bg-gray-100" onClick={handleClose}>
                Cancel
              </button>
              <button className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600">
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceBoards;
