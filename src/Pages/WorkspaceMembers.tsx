import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkspaceHeader from '../Component/WorkspaceHeader';
import { fetchWorkspaces } from '../hooks/fetchWorkspace';
import { Link } from 'phosphor-react';

const WorkspaceMembers: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: any }>();
  const [showJoinRequests, setShowJoinRequests] = useState(false);
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Private');
  const [workspace, setWorkspace] = useState<any>(null);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const workspaces = await fetchWorkspaces(workspaceId);
        const currentWorkspace = workspaces.find((ws: any) => ws.id === workspaceId);
        setWorkspace(currentWorkspace);
        setVisibility(currentWorkspace?.visibility || 'Private');
      } catch (error) {
        console.error('Failed to fetch workspace:', error);
      }
    };

    fetchWorkspaceData();
  }, [workspaceId]);

  return (
    <div className='bg-white min-h-screen'>
      <div className="max-w-6xl mx-auto">
        <WorkspaceHeader workspace={workspace}/>
        <div className="flex px-6 py-2">
          <div className="w-1/4 bg-white pr-4">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-black text-lg font-semibold">Collaborators</h2>
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">3/10</span>
              </div>
              <div className="flex flex-col space-y-2">
                <button
                  className={`rounded-lg px-2 py-1 text-left font-semibold ${!showJoinRequests ? 'bg-purple-200 text-purple-700' : 'bg-white text-black'}`}
                  onClick={() => setShowJoinRequests(false)}
                >
                  Workspace member (3)
                </button>
                <button
                  className={`rounded-lg px-2 py-1 text-left font-semibold ${showJoinRequests ? 'bg-purple-200 text-purple-700' : 'bg-white text-gray-800'}`}
                  onClick={() => setShowJoinRequests(true)}
                >
                  Join Request (2)
                </button>
              </div>
            </div>
          </div>
          <div className="w-3/4 pl-4">
            {!showJoinRequests ? (
              <>
                {/* Workspace Members Section */}
                <div className="mb-8 mt-8">
                  <h3 className="text-black text-lg font-semibold">Workspace member (3)</h3>
                  <p className="text-sm text-black mt-2 w-4/5">
                    Workspace members can view and join all Workspace visible boards and create new boards in the Workspace.
                  </p>
                </div>

                {/* Invite Section */}
                <div className="bg-white p-4 border-t-[1.5px] border-b-[1.5px] text-black border-gray-200 mb-8">
                  <h3 className="text-lg font-semibold">Invite members to join you</h3>
                  <div className='flex justify-between'>
                    <p className="text-sm mt-2 w-2/3">
                      Anyone with an invite link can join this free Workspace. You can also disable and create a new invite link for this Workspace at any time. Pending invitations count toward the 10 collaborator limit.
                    </p>
                    <div className="items-center flex flex-col space-x-4">
                    <button className="bg-gray-200 px-4 py-2 rounded-md flex items-center"><Link size={16} className='mr-3'/>Invite with link</button>
                    <button className="py-2">Disable invite link</button>
                    </div>
                  </div>
                </div>
                <div className="mb-8">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-1/3 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700"
                  />
                </div>

                {/* Members Section */}
                <div className="space-y-4 text-black w-4/5">
                  {/* Replace with your dynamic member list */}
                  <div className="bg-green-200 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/40" alt="User" className="rounded-full mr-4" />
                      <div>
                        <h4 className="font-semibold">M Najwan M</h4>
                        <p className="text-sm text-gray-600">najwannuttaqin@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button className="bg-gray-200 text-gray-600 px-4 py-1 rounded-md">Views Boards (4)</button>
                      <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md">Remove</button>
                    </div>
                  </div>

                  <div className="bg-red-200 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/40" alt="User" className="rounded-full mr-4" />
                      <div>
                        <h4 className="font-semibold">Satriya Galank</h4>
                        <p className="text-sm text-gray-600">bangsatriya@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button className="bg-gray-200 text-gray-600 px-4 py-1 rounded-md">Views Boards (5)</button>
                      <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md">Remove</button>
                    </div>
                  </div>

                  <div className="bg-blue-200 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/40" alt="User" className="rounded-full mr-4" />
                      <div>
                        <h4 className="font-semibold">Ucoeps</h4>
                        <p className="text-sm text-gray-600">cupacups@gmail.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button className="bg-gray-200 text-gray-600 px-4 py-1 rounded-md">Views Boards (1)</button>
                      <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md">Remove</button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className='mt-8'>
                {/* Join Requests Section */}
                <h3 className="text-black text-lg font-semibold">Join Requests (2)</h3>
                <p className="text-sm text-gray-600 py-3 w-4/5">
                  These people have requested to join this workspace. Adding new workspace will
                  automatically update your bill. workspace guest already count toward the free workspace
                  collaborator limit
                </p>
                {/* Search Section */}
                <div className="mb-8 border-b-[1.5px] border-t-[1.5px] py-5 border-gray-200 ">
                  <input
                    type="text"
                    placeholder="Search members..."
                    className="w-1/3 bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700"
                  />
                </div>
                {/* Join Requests Members */}
                <div className="space-y-4 w-4/5 text-black">
                  <div className="bg-green-200 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/40" alt="User" className="rounded-full mr-4" />
                      <div>
                        <h4 className="font-semibold">John Doe</h4>
                        <p className="text-sm text-gray-600">johndoe@example.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button className="bg-green-200 text-green-600 px-4 py-1 rounded-md">Accept</button>
                      <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md">Reject</button>
                    </div>
                  </div>

                  <div className="bg-yellow-200 p-4 rounded-md flex justify-between items-center">
                    <div className="flex items-center">
                      <img src="https://via.placeholder.com/40" alt="User" className="rounded-full mr-4" />
                      <div>
                        <h4 className="font-semibold">Jane Smith</h4>
                        <p className="text-sm text-gray-600">janesmith@example.com</p>
                      </div>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <button className="bg-green-200 text-green-600 px-4 py-1 rounded-md">Accept</button>
                      <button className="bg-red-100 text-red-600 px-4 py-1 rounded-md">Reject</button>
                    </div>
                  </div>
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
