import React, { useState } from 'react';

interface Workspace {
  name: string;
  id: string;
  description?: string;
}

interface WorkspaceHeaderProps {
  workspace: Workspace;
  showEditIcon?: boolean;
  onEdit?: () => void;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  workspace,
  showEditIcon,
  onEdit,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleOpenInvite = () => {
    setIsModalOpen(false);
    setIsInviteOpen(true);
  };

  const handleOpenRequest = () => {
    setIsModalOpen(false);
    setIsRequestOpen(true);
  };

  const handleClose = () => {
    setIsRequestOpen(false);
    setIsInviteOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white text-black border-black border-b p-[6px] mx-6 mb-2">
        <div className="flex items-center font-sem">
          <div className="w-16 h-16 bg-red-700 mr-3"></div>
          <div>
            <h1 className="text-xl text-gray-600 font-semibold flex items-center">
              {workspace ? workspace.name : 'Loading...'}
              {showEditIcon && (
                <button
                  onClick={onEdit}
                  className="ml-2 text-gray-600 hover:text-gray-800"
                >
                  <i className="fas fa-pencil text-sm" />
                </button>
              )}
            </h1>
            <p className="text-sm flex items-center text-gray-500">
              {workspace ? workspace.description : 'Loading...'}
            </p>
            <p className="text-sm flex items-center">
              <i className="fas fa-lock mr-1" />
              Private | Workspace id : {workspace ? workspace.id : 'Loading...'}
            </p>
          </div>
        </div>
        <button onClick={handleOpenModal}><i className='fas fa-bars' /></button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white pt-8 px-6 pb-5 rounded-md shadow-md w-80 relative right-16 top-0 cursor-pointer">
            <i className='fas fa-times text-lg text-black absolute top-2 right-2 cursor-pointer' onClick={handleCloseModal} />
            <div className='bg-gray-200 p-1 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300' onClick={handleOpenInvite}>
              <i className='fas fa-user-plus' />
              <span className='ml-2'>Invite Workspace Member</span>
            </div>
            <div className='bg-gray-200 p-1 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300 mt-2' onClick={handleOpenRequest}>
              <i className='fas fa-user-plus' />
              <span className='ml-2'>Join Request (0)</span>
            </div>
          </div>
        </div>
      )}

      {isRequestOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-end z-[100]">
          <div className="bg-white rounded-lg shadow-lg w-[470px] relative right-16">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-md text-black font-medium">Request Join Workspace</h3>
              <i className="fas fa-times text-black cursor-pointer" onClick={handleClose} />
            </div>
            <div className="px-4 pb-3">
              <div className="flex items-center bg-teal-100 p-1 rounded-md">
                <img
                  src="https://via.placeholder.com/40"
                  alt="User Profile"
                  className="w-8 h-8 rounded-full mr-4"
                />
                <div className="flex-1">
                  <p className="font-semibold text-black">M Najwan M</p>
                  <p className="text-sm text-gray-600">najwanmuttaqin@gmail.com</p>
                </div>
                <div className="flex space-x-2 pr-4">
                  <button className="flex text-sm items-center bg-gray-200 hover:bg-gray-300 text-black py-1 px-2 rounded">
                    <i className="fas fa-check mr-2" />
                    Accept
                  </button>
                  <button className="flex text-sm items-center bg-gray-200 hover:bg-gray-300 text-black py-1 px-2 rounded">
                    <i className="fas fa-times mr-2" />
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
          <div className="bg-white rounded-lg shadow-lg w-[300px] relative right-16">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-md text-black font-medium">Invite Member Workspace</h3>
              <i className="fas fa-times text-black cursor-pointer" onClick={handleClose} />
            </div>
            <div className="px-4 pb-3 flex flex-col space-y-2">
              <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md">
                <i className="fas fa-link mr-2" />
                Invite with link
              </button>
              <button className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md">
                <i className="fas fa-link mr-2" />
                Copy Workspace id
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;
