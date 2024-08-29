import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkspaceHeader from '../Component/WorkspaceHeader';
import { fetchWorkspaces, deleteWorkspace } from '../hooks/fetchWorkspace';

const WorkspaceSettings: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: any }>();
  const [activePopup, setActivePopup] = useState<'visibility' | 'delete' | null>(null);
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Private');
  const [workspace, setWorkspace] = useState<any>(null);
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

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

  const togglePopup = (popupType: 'visibility' | 'delete') => {
    setActivePopup(activePopup === popupType ? null : popupType);
  };

  const closeAllPopups = () => {
    setActivePopup(null);
  };

  const handleVisibilityChange = (newVisibility: 'Private' | 'Public') => {
    setVisibility(newVisibility);
    closeAllPopups();
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleDeleteWorkspace = async () => {
    if (workspaceId) {
      try {
        await deleteWorkspace(workspaceId);
        setAlert({ type: 'success', message: 'Workspace deleted successfully.' });
        setTimeout(() => navigate('/boards'), 500);
      } catch (error: any) {
        console.error('Failed to delete workspace:', error);
        let errorMessage = error.response?.data?.error || 'Failed to delete workspace. Please try again.';
        setAlert({ type: 'error', message: errorMessage });
      }
    }
    closeAllPopups();
  };

  return (
    <div className='min-h-screen'>
      {alert && (
        <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {alert.message}
        </div>
      )}
      <WorkspaceHeader workspace={workspace} />

      <div className='py-10 text-black px-16'>
        <h2 className='text-xl font-medium mb-4'>Workspace Settings</h2>

        <div className='mb-6 relative'>
          <h3 className='text-lg mb-2 border-b py-1'>Workspace visibility</h3>
          <div className='flex justify-between items-center'>
              <div className='flex items-center mb-1'>
                <i className={`fas ${visibility === 'Private' ? 'fa-lock text-red-600' : 'fa-globe text-green-600'} mr-2`}></i>
                <span>{visibility} - This Workspace is {visibility === 'Private' ? "private. It's not indexed or visible to those outside the Workspace." : "public. It's visible to everyone."}</span>
              </div>
            <button onClick={(e) => {
              e.stopPropagation();
              togglePopup('visibility');
            }} className='bg-gray-200 px-3 py-1 rounded text-sm relative'>
              Change
            </button>
          </div>

          <div className='mt-3 w-52 cursor-pointer' onClick={(e) => {
            e.stopPropagation();
            togglePopup('delete');
          }}>
            <p className='text-red-500 font-semibold hover:bg-gray-200 w-fit p-1.5 px-5 rounded-md'>Delete this workspace?</p>
          </div>

          {activePopup === 'delete' && (
            <div className='flex justify-center' onClick={(e) => e.stopPropagation()}>
              <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full text-center">
                <div className='flex justify-end right-0'>
                  <i className='fas fa-times' onClick={closeAllPopups} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Delete this workspace?
                </h2>
                <p className="text-sm text-gray-700 mb-6">
                  Are you sure you want to delete this workspace permanently? This can't be undone.
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={handleDeleteWorkspace}
                    className="bg-[#FF0000] text-sm text-white font-medium py-1 px-10 rounded-lg hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePopup === 'visibility' && (
            <div
              className='absolute right-0 mt-2 bg-white border py-1 shadow-lg w-1/3 z-10'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-end px-1'>
                <i className='fas fa-times cursor-pointer' onClick={closeAllPopups} />
              </div>
              <p className='mb-3 text-center'>Select workspace visibility</p>
              <div className='mb-0'>
                <button
                  className='block w-full text-left py-4 px-5 hover:bg-gray-200 border-b'
                  onClick={() => handleVisibilityChange('Private')}
                >
                  <i className='fas fa-lock mr-4 text-red-600' />
                  Private
                </button>
                <button
                  className='block w-full text-left py-4 px-5 hover:bg-gray-200'
                  onClick={() => handleVisibilityChange('Public')}
                >
                  <i className='fas fa-globe mr-4 text-green-600' />
                  Public
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
