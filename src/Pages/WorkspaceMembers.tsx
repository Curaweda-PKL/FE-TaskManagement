import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkspaceHeader from '../Component/WorkspaceHeader';
import { fetchWorkspaces, memberWorkspace, joinRequestsWorkspace } from '../hooks/fetchWorkspace';

const WorkspaceMembers: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Private');
  const [workspace, setWorkspace] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const workspaces = await fetchWorkspaces(workspaceId);
        const currentWorkspace = workspaces.find((ws: any) => ws.id === workspaceId);
        setWorkspace(currentWorkspace);
        setVisibility(currentWorkspace?.visibility || 'Private');
        const membersData = await memberWorkspace(workspaceId);
        setMembers(membersData);

        if (showJoinRequests) {
          const joinRequestsData = await joinRequestsWorkspace(workspaceId);
          setJoinRequests(joinRequestsData);
        }

      } catch (error) {
        console.error('Failed to fetch workspace:', error);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId, showJoinRequests]);

  return (
    <div className='bg-white min-h-screen'>
      <div className="max-w-6xl mx-auto">
        <WorkspaceHeader workspace={workspace}/>
        <div className="relative px-6 py-2 lg:flex">
          <div className="w-full lg:w-1/4 bg-white pr-4">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-black text-lg font-semibold">Collaborators</h2>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{members.length}</span>
              </div>
              <div className="lg:flex lg:flex-col relative lg:space-y-2">
                <button
                  className={`rounded-lg px-2 py-1 text-left font-semibold ${!showJoinRequests ? 'bg-purple-200 text-purple-700' : 'bg-white text-black'}`}
                  onClick={() => setShowJoinRequests(false)}
                >
                  Workspace member ({members.length})
                </button>
                <button
                  className={`rounded-lg px-2 py-1 text-left font-semibold ${showJoinRequests ? 'bg-purple-200 text-purple-700' : 'bg-white text-gray-800'}`}
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
                      Anyone with an invite link can join this free Workspace. You can also disable and create a new invite link for this Workspace at any time. Pending invitations count toward the 10 collaborator limit.
                    </p>
                    <div className="items-center mt-4 lg:mt-0 flex space-x-0 lg:space-x-4 lg:flex-col flex-row justify-center">
                      <button className="bg-gray-200 px-4 py-2 rounded-md flex items-center lg:mr-0 mr-10 mb-0 lg:lg:mb-0"><i className='fas fa-link mr-3'/>Invite with link</button>
                      <button className="py-2">Disable invite link</button>
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
                        <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md">Remove</button>
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
                        <button className="bg-green-200 text-green-600 px-4 py-1 rounded-md">Accept</button>
                        <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md">Reject</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkspaceMembers;
