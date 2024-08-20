import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faUser, faUserFriends } from '@fortawesome/free-solid-svg-icons';

const WorkspaceBoards: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='bg-white min-h-screen'> {/* Menghapus padding atas */}
      <div className="flex items-center justify-between bg-white p-4 rounded-md shadow-md mb-4 mx-6 mt-0"> {/* Tambahkan mt-0 untuk menyingkirkan margin atas */}
        <div className="flex items-center">
          <div className="w-8 h-8 bg-red-600 rounded-md mr-4"></div>
          <div>
            <h2 className="text-black text-xl font-bold">Kelompok 1’s workspace</h2>
            <div className="flex items-center text-gray-500">
              <FontAwesomeIcon icon={faLock} className="mr-2" />
              <span>Private</span>
            </div>
          </div>
          <button className="mb-5 ml-20 text-purple-600 bg-purple-100 px-9 py-1 rounded-md font-medium">Invite Workspace members</button>
        </div>
      </div>
      <div className='mx-6'>
        <div className='mb-8'>
          <h2 className='text-xl font-bold flex items-center'>
            <FontAwesomeIcon icon={faUser} className='mr-2' />
            Your Boards
          </h2>
          <div className='flex gap-4 mt-4'>
            <div className='w-56 h-36 bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] text-white flex items-start justify-start rounded-md p-4'>
              Project 1
            </div>
            <div className='w-56 h-36 bg-gray-400 text-white flex items-center justify-center rounded-md cursor-pointer' onClick={handleOpenModal}>
              Create New Project
            </div>
          </div>
        </div>
        <div className='mb-8'>
          <h2 className='text-xl font-bold flex items-center'>
            <FontAwesomeIcon icon={faUserFriends} className='mr-2' />
            All boards in this workspace
          </h2>
          <div className='flex items-center gap-4 mt-4'>
            <div className='flex items-center bg-gray-200 px-4 py-2 rounded-md'>
              <span className='mr-2'>Sort by</span>
              <select className='bg-white border border-gray-300 rounded-md'>
                <option>Most recently active</option>
              </select>
            </div>
            <div className='bg-blue-500 w-10 h-10 flex items-center justify-center rounded-full text-white'>N</div>
          </div>
          <div className='flex gap-4 mt-4'>
            <div className='w-56 h-36 bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] text-white flex items-start justify-start rounded-md p-4'>
              Project 1
            </div>
            <div className='w-56 h-36 bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] text-white flex items-start justify-start rounded-md p-4'>
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-md shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Create board</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Background</label>
              <div className="flex gap-2 mt-2">
                <div className="w-10 h-10 bg-red-500 rounded-md"></div>
                <div className="w-10 h-10 bg-blue-500 rounded-md"></div>
                <div className="w-10 h-10 bg-green-500 rounded-md"></div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Board title*</label>
              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Visibility</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>Public</option>
                <option>Private</option>
                <option>Workspace</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button onClick={handleCloseModal} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">Cancel</button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceBoards;
