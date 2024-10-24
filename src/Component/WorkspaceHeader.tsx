import React, { useState, useEffect } from 'react';
import { generateLinkWorkspace, joinRequestsWorkspace, requestWorkspace } from '../hooks/fetchWorkspace';
import useAuth from '../hooks/fetchAuth';

interface Workspace {
  name: string;
  id: string;
  description?: string;
  isPublic: any;
}

interface JoinRequest {
  id: string;
  name: string;
  email: string;
  photoProfile: any;
}

interface WorkspaceHeaderProps {
  workspace: Workspace;
  showEditIcon?: boolean;
  onEdit?: () => void;
  inviteLinkEnabled: boolean;
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  workspace,
  showEditIcon,
  onEdit,
  inviteLinkEnabled,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: any } | null>(null);
  const [currentWorkspaceId, setCurrentWorkspaceId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const onLogout = () => {
    console.log('Logout');
  };
  const onSuccess = () => {
    console.log('Success');
  };
  const { userData, fetchUserData } = useAuth(onSuccess, onLogout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData) {
          setCurrentUserId(userData.id);
          console.log("Current User ID:", userData.id); // Untuk debugging
        }
      } catch (error) {
        console.error("Error setting currentUserId:", error);
      }
    };
    fetchData();
  }, [userData]);

  const isOwner = (workspace: any) => {
    if (!workspace || !currentUserId) return false; 
    return workspace.ownerId === currentUserId;
  };

  useEffect(() => {
    const fetchJoinRequests = async () => {
      if (workspace?.id) {
        try {
          const requests = await joinRequestsWorkspace(workspace?.id);
          setJoinRequests(requests);
        } catch (error) {
          console.error('Failed to fetch join requests:', error);
        }
      } else {
        console.error('Workspace ID is undefined');
      }
    };

    fetchJoinRequests();
  }, [workspace?.id]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleClose = () => {
    setIsRequestOpen(false);
    setIsInviteOpen(false);
  };

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 2000);
  };

  const handleCopyId = () => {
    if (workspace) {
      navigator.clipboard.writeText(workspace.id)
        .then(() => {
          showAlert('Workspace ID copied to clipboard!', 'success');
        })
        .catch(() => {
          showAlert('Failed to copy Workspace ID.', 'error');
        });
    }
  };

  const handleCopyLink = async () => {
    if (workspace && workspace.isPublic && inviteLinkEnabled) {
      try {
        const response = await generateLinkWorkspace(workspace.id);
        const inviteLink = "http://localhost:4545/j/" + response.link.joinLink;

        navigator.clipboard.writeText(inviteLink);
        showAlert('Invite link copied to clipboard!', 'success');
      } catch (error) {
        console.error('Failed to generate link:', error);
        showAlert('An error occurred while generating the invite link.', 'error');
      }
    } else if (!workspace.isPublic) {
      showAlert('Invite link is not available for private workspaces.', 'error');
    } else if (!inviteLinkEnabled) {
      showAlert('Invite link is currently disabled.', 'error');
    }
  };

  const handleAccept = async (requestId: string) => {
    try {
      await requestWorkspace(requestId, 'APPROVED');
      showAlert('Request accepted successfully!', 'success');
      setJoinRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      showAlert('Failed to accept request.', 'error');
      console.error('Error accepting request:', error);
    }
  };

  const handleDecline = async (requestId: string) => {
    try {
      await requestWorkspace(requestId, 'REJECTED');
      showAlert('Request rejected successfully!', 'success');
      setJoinRequests((prevRequests) =>
        prevRequests.filter((request) => request.id !== requestId)
      );
    } catch (error) {
      showAlert('Failed to reject request.', 'error');
      console.error('Error rejecting request:', error);
    }
  };

  const handleInviteWorkspaceMember = () => {
    setIsInviteOpen(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-white text-black border-black border-b p-[6px] mx-0 md:mx-6 mb-2">
        {alert && (
          <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {alert.message}
          </div>
        )}
        <div className="flex sm:items-center md:px-10 px-5 font-sem">
          <div className="min-w-11 h-11 sm:w-14 sm:h-14 rounded bg-red-700 mr-3"></div>
          <div>
            <h1 className="text-xl -mt-1 text-gray-600 font-semibold flex items-center">
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
            <p className="text-sm flex -mt-1 items-center text-gray-500">
              {workspace ? workspace.description : 'Loading...'}
            </p>
            <p className="sm:text-sm text-xs flex items-center">
              <i className={`fas ${workspace?.isPublic ? 'fa-globe' : 'fa-lock'} mr-1`} />
              {workspace?.isPublic ? 'Public' : 'Private'} | Workspace id: {workspace ? workspace.id : 'Loading...'}
            </p>
          </div>
        </div>
        {isOwner(workspace) && (
        <button onClick={handleOpenModal}><i className='fas fa-bars' /></button>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white pt-8 px-6 pb-5 rounded-md shadow-md w-80 relative cursor-pointer">
            <i className='fas fa-times text-lg text-black absolute top-2 right-2 cursor-pointer' onClick={handleCloseModal} />
            <div
              className="bg-gray-200 p-1 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-300"
              onClick={handleInviteWorkspaceMember}
            >
              <i className='fas fa-user-plus' />
              <span className='ml-2'>Invite Workspace Member</span>
            </div>
            <div className='bg-gray-200 p-1 rounded-md text-gray-700 font-semibold hover:bg-gray-100 hover:text-purple-600 transition-colors duration-300 mt-2 cursor-pointer' onClick={() => { setIsRequestOpen(true); setIsModalOpen(false); }}>
              <i className='fas fa-user-plus' />
              <span className='ml-2'>Join Request ({joinRequests?.length})</span>
            </div>
          </div>
        </div>
      )}

      {isInviteOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-lg w-[300px] relative">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-md text-black font-medium">Invite Member Workspace</h3>
              <i className="fas fa-times text-black cursor-pointer" onClick={() => setIsInviteOpen(false)} />
            </div>
            <div className="px-4 pb-3 flex flex-col space-y-2">
              <button
                className={`flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md ${(!workspace.isPublic || !inviteLinkEnabled) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleCopyLink}
                disabled={!workspace.isPublic || !inviteLinkEnabled}
              >
                <i className="fas fa-link mr-2" />
                Invite with link
              </button>
              <button
                className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-black py-2 px-4 rounded-md"
                onClick={handleCopyId}
              >
                <i className="fas fa-link mr-2" />
                Copy Workspace id
              </button>
            </div>
          </div>
        </div>
      )}

      {isRequestOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg shadow-lg w-[470px] relative">
            <div className="flex justify-between items-center p-4">
              <h3 className="text-md text-black font-medium">Request Join Workspace</h3>
              <i className="fas fa-times text-black cursor-pointer" onClick={handleClose} />
            </div>
            <div className="px-4 pb-3">
              {joinRequests.map((request) => (
                <div key={request?.id} className="flex items-center bg-teal-100 p-1 rounded-md mb-2">
                  <img
                    src={request.photoProfile || 'https://via.placeholder.com/40'}
                    alt="User Profile"
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-black">{request?.name}</p>
                    <p className="text-sm text-gray-600">{request?.email}</p>
                  </div>
                  <div className="flex space-x-2 pr-4">
                    <button
                      className="flex text-sm items-center bg-gray-200 hover:bg-gray-300 text-black py-1 px-2 rounded"
                      onClick={() => handleAccept(request.id)}
                    >
                      <i className="fas fa-check mr-2" />
                      Accept
                    </button>
                    <button
                      className="flex text-sm items-center bg-gray-200 hover:bg-gray-300 text-black py-1 px-2 rounded"
                      onClick={() => handleDecline(request.id)}
                    >
                      <i className="fas fa-times mr-2" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkspaceHeader;
