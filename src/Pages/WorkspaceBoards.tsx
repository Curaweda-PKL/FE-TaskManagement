import React, { useState } from 'react';
import CreateBoard from '../Component/CreateBoard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserFriends, faBars, faUserPlus, faX, faCheck, faTimes, faLink } from '@fortawesome/free-solid-svg-icons';

const WorkspaceBoards: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isRequestOpen, setIsRequest] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const isWorkspaceLayout = location.pathname === '/workspace/boards-ws';

  const handleOpenInvite = () => {
    setIsModalOpen(false);
    setIsInviteOpen(true);
  }

  const handleOpenRequest = () =>{
    setIsModalOpen(false);
    setIsRequest(true);
  }

  const closeCreateBoard = () => {
    setShowCreateBoard(false);
  };

  const handleCreateBoardClick = () => {
    setShowCreateBoard(true);
  };

  const handleOpenJoin = () =>{
    setIsModalOpen(false);
    setIsJoinOpen(true);
  }
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleClose = () => {
    setIsJoinOpen(false);
    setIsRequest(false);
    setIsInviteOpen(false)
  }

  return (
    <div className={`bg-white min-h-screen ${isWorkspaceLayout ? '' : ''}`}>
      <div className="flex items-center justify-between bg-white p-4 border-black border-b-2 -4 mx-6 mt-0 mb-2">
        <div className="flex items-center font-sem">
          <div className="w-11 h-11 bg-red-700 mr-3"></div>
          <div>
            <h1 className="text-lg font-bold">Kelompok 1's workspace</h1>
            <p className="text-sm flex items-center mt-1">
              <FontAwesomeIcon icon={faLock} className="w-4 h-4 mr-1" />
              Private | Workspace id : bNs98
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
            <div className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden text-white'>
              Project 1
            </div>
            <div onClick={handleCreateBoardClick} className='group relative p-1 h-28 w-full bg-gray-400 rounded-[5px] cursor-pointer overflow-hidden flex items-center justify-center text-white'>
              <h5 className='text-white text-center'>Create New Project</h5>
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
            <div className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden text-white'>
              Project 1
            </div>
            <div className='group relative p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer overflow-hidden text-white'>
              Project 2
            </div>
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
                 <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={handleClose}/>
               </div>
               <div className="p-4">
                 <div className="flex items-center bg-teal-100 p-2 rounded-md">
                   <img
                     src="https://via.placeholder.com/40" // Ganti dengan URL gambar profil
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
      {isInviteOpen &&(
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
            <div className="bg-white rounded-lg shadow-lg w-[350px] relative right-16">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">Invite Member Workspace</h3>
                <FontAwesomeIcon icon={faTimes} className="cursor-pointer" onClick={handleClose}/>
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
            <FontAwesomeIcon icon={faX} className='absolute top-4 right-4 cursor-pointer' onClick={handleCloseModal}/>
            <div className='bg-gray-200 p-2 rounded-md text-gray-500 font-bold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300' onClick={handleOpenInvite}>
              <FontAwesomeIcon icon={faUserPlus} className='black' />
              <span className='ml-2 ' >Invite Workspace Member</span>
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