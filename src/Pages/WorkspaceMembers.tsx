import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkspaceHeader from '../Component/WorkspaceHeader';
import { fetchWorkspaces, memberWorkspace, joinRequestsWorkspace, requestWorkspace, removeMemberWorkspace } from '../hooks/fetchWorkspace';
import DeleteConfirmation from '../Component/DeleteConfirmation';

const WorkspaceMembers: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [, setVisibility] = useState<'Private' | 'Public'>('Private');
  const [workspace, setWorkspace] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [inviteLinkEnabled, setInviteLinkEnabled] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: any } | null>(null);
  const hoverClass = "hover:bg-gray-100 hover:text-purple-600 cursor-pointer transition-colors duration-200 rounded-md";

  useEffect(() => {
    fetchWorkspaceData();
  }, [workspaceId]);

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 2000);
  };

  const fetchWorkspaceData = async () => {
    try {
      const workspaces = await fetchWorkspaces(workspaceId);
      const currentWorkspace = workspaces.find((ws: any) => ws.id === workspaceId);

      setWorkspace(currentWorkspace);
      setVisibility(currentWorkspace?.visibility || 'Private');

      const membersData = await memberWorkspace(workspaceId);
      setMembers(membersData);

      const joinRequestsData = await joinRequestsWorkspace(workspaceId);
      setJoinRequests(joinRequestsData);

    } catch (error) {
      console.error('Failed to fetch workspace data:', error);
    }
  };

  const handleJoinRequest = async (requestId: any, status: 'APPROVED' | 'REJECTED') => {
    try {
      await requestWorkspace(requestId, status);
      setJoinRequests((prevRequests) => prevRequests.filter(req => req.id !== requestId));
      if (status === 'APPROVED') {
        fetchWorkspaceData();
      }
    } catch (error) {
      console.error(`Failed to ${status} join request:`, error);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setMemberToRemove(memberId);
    setShowDeleteConfirmation(true);
  };

  const confirmRemoveMember = async () => {
    if (memberToRemove) {
      try {
        await removeMemberWorkspace(workspaceId, memberToRemove);
        setMembers((prevMembers) => prevMembers.filter((member) => member?.id !== memberToRemove));
        setShowDeleteConfirmation(false);
        setMemberToRemove(null);
        showAlert('Member successfully removed.', 'success');
      } catch (error) {
        console.error('Failed to remove member:', error);
        showAlert('Failed to remove member. Please try again.', 'error');
        
      }
    }
  };

  const cancelRemoveMember = () => {
    setShowDeleteConfirmation(false);
    setMemberToRemove(null);
  };

  const toggleInviteLink = () => {
    setInviteLinkEnabled(!inviteLinkEnabled);
    // TODO: Implement API call to toggle the invite link status on the server
  };

  return (
    <div className='bg-white min-h-screen'>
      <div className="max-w-6xl mx-auto">
      {alert && (
          <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {alert.message}
          </div>
        )}
        <WorkspaceHeader workspace={workspace} inviteLinkEnabled={inviteLinkEnabled} />
        <div className="relative px-6 py-2 lg:flex">
          <div className="w-full lg:w-1/4 bg-white pr-4">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-black text-lg font-semibold">Collaborators</h2>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{members.length}</span>
              </div>
              <div className="lg:flex lg:flex-col relative lg:space-y-2">
                <button
                  className={`rounded-lg px-2 py-1 text-left font-semibold ${hoverClass} ${!showJoinRequests ? 'bg-gray-100 text-purple-600' : 'bg-white text-black'}`}
                  onClick={() => setShowJoinRequests(false)}
                >
                  Workspace member ({members.length})
                </button>
                <button
                  className={`rounded-lg px-2 py-1 text-left font-semibold ${hoverClass} ${showJoinRequests ? 'bg-gray-100 text-purple-600' : 'bg-white text-gray-800'}`}
                  onClick={() => setShowJoinRequests(true)}
                >
                  Join Request ({joinRequests.length})
                </button>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-3/4 pl-0 lg:pl-4">
            {!showJoinRequests ? (
              <>
                <div className="mb-8 mt-8">
                  <h3 className="text-black text-lg font-semibold">Workspace member ({members.length})</h3>
                  <p className="text-sm text-black mt-2 w-4/5">
                    Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.
                  </p>
                </div>
                <div className="bg-white p-0 lg:p-4 border-t-[1.5px] border-b-[1.5px] text-black border-gray-200 mb-8">
                  <h3 className="text-lg font-semibold">Invite members to join you</h3>
                  <div className='flex flex-col lg:flex-row justify-between'>
                    <p className="text-sm mt-2 w-full lg:w-2/3">
                      {inviteLinkEnabled
                        ? "Anyone with an invite link can join this free Workspace. You can disable and create a new invite link for this Workspace at any time. Pending invitations count toward the 10 collaborator limit."
                        : "Invite link is currently disabled. You can re-enable it to allow new members to join using a link."}
                    </p>
                    <div className="items-center mt-4 lg:mt-0 flex space-x-0 lg:space-x-4 lg:flex-col flex-row justify-center">
                      {inviteLinkEnabled ? (
                        <>
                          <button className="bg-gray-200 text-black px-4 py-2 rounded-md flex items-center lg:mr-0 mr-10 mb-0 lg:lg:mb-0">
                            <i className='fas fa-link mr-3' />Invite with link
                          </button>
                          <button className="py-2 text-gray-500 hover:text-black" onClick={toggleInviteLink}>Disable invite link</button>
                        </>
                      ) : (
                        <>
                          <button className="flex items-center lg:mr-0 mr-10 mb-0 lg:lg:mb-0 text-gray-500 hover:text-black" onClick={toggleInviteLink}>
                            <i className='fas fa-link mr-3' />Invite with link
                          </button>
                          <button className="bg-gray-200 px-6 py-2 rounded-md  text-black">Disable invite link</button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-full lg:w-1/3 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700"
                  />
                </div>
                <div className="space-y-4 text-black w-full lg:w-5/6">
                  {members.map((member) => (
                    <div key={member.id} className="bg-yellow-200 p-4 rounded-md flex justify-between items-center flex-wrap">
                      <div className="flex items-center flex-wrap">
                        <img src="https://via.placeholder.com/40" alt="User" className="rounded-full mr-4" />
                        <div>
                          <h4 className="font-semibold">{member.name}</h4>
                          <p className="text-sm text-gray-600">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-4 items-center lg:mt-0 mt-2 flex-wrap">
                        <button className="bg-gray-200 text-gray-600 px-4 py-1 rounded-md">Views Boards ({member.boardCount})</button>
                        <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md" onClick={() => handleRemoveMember(member.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className='mt-8'>
                <h3 className="text-black text-lg font-semibold">Join Requests ({joinRequests.length})</h3>
                <p className="text-sm text-gray-600 py-3 w-full lg:w-4/5">
                  These people have requested to join this workspace. Adding new workspace will
                  automatically update your bill. Workspace guest already count toward the free workspace
                  collaborator limit.
                </p>
                <div className="mb-8 border-b-[1.5px] border-t-[1.5px] py-5 border-gray-200 ">
                  <input
                    type="text"
                    placeholder="Search requests..."
                    className="w-full lg:w-1/3 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700"
                  />
                </div>
                <div className="space-y-4 w-full lg:w-4/5 text-black">
                  {joinRequests.map((request) => (
                    <div key={request.id} className={`bg-${request.status === 'pending' ? 'red-200' : 'yellow-200'} p-4 rounded-md flex flex-col sm:flex-row justify-between items-start lg:items-center`}>
                      <div className="flex items-center mb-4 lg:mb-0">
                        <img src="https://via.placeholder.com/40" alt="User" className="rounded-full mr-4" />
                        <div>
                          <h4 className="font-semibold">{request.name}</h4>
                          <p className="text-sm text-gray-600">{request.email}</p>
                        </div>
                      </div>
                      <div className="flex space-x-4 items-center">
                        <button
                          onClick={() => handleJoinRequest(request.id, 'APPROVED')}
                          className="bg-green-200 text-green-600 px-4 py-1 rounded-md"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleJoinRequest(request.id, 'REJECTED')}
                          className="bg-red-100 text-red-600 px-4 py-1 rounded-md"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
        <DeleteConfirmation
          onDelete={confirmRemoveMember}
          onCancel={cancelRemoveMember}
          itemType="member"
        />
        </div>
      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceMembers;