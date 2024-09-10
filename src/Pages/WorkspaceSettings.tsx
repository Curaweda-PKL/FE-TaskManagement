import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import WorkspaceHeader from '../Component/WorkspaceHeader';
import CreateWorkspace from '../Component/CreateWorkspace';
import DeleteConfirmation from '../Component/DeleteConfirmation';
import { fetchWorkspaces, deleteWorkspace, updateWorkspace } from '../hooks/fetchWorkspace';

const WorkspaceSettings: React.FC = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [activePopup, setActivePopup] = useState<'visibility' | 'delete' | null>(null);
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Private');
  const [workspace, setWorkspace] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const navigate = useNavigate();
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  useEffect(() => {
    const fetchWorkspaceData = async () => {
      try {
        const workspaces = await fetchWorkspaces(workspaceId);
        const currentWorkspace = workspaces.find((ws: any) => ws.id === workspaceId);
        setWorkspace(currentWorkspace);
        setVisibility(currentWorkspace?.isPublic ? 'Public' : 'Private');
        setWorkspaceName(currentWorkspace?.name || '');
        setWorkspaceDescription(currentWorkspace?.description || '');
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
    setIsEditModalOpen(false);
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
        const response = await deleteWorkspace(workspaceId);
        if (Array.isArray(response) && response.length > 0 && response[0].message === "not owner in this workspace") {
          setAlert({ type: 'error', message: 'You are not the owner of this workspace and cannot delete it.' });
        } else {
          setAlert({ type: 'success', message: 'Workspace deleted successfully.' });
          setTimeout(() => navigate('/boards'), 500);
        }
      } catch (error: any) {
        console.error('Failed to delete workspace:', error);
        let errorMessage = 'Failed to delete workspace. Please try again.';
        
        // Periksa apakah error response mengandung pesan spesifik
        if (error.response?.data && Array.isArray(error.response.data) && 
            error.response.data.length > 0 && error.response.data[0].message === "not owner in this workspace") {
          errorMessage = 'You are not the owner of this workspace and cannot delete it.';
        }
        
        setAlert({ type: 'error', message: errorMessage });
      }
    }
    closeAllPopups();
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleUpdateWorkspace = async () => {
    const isPublic = visibility === 'Public';
    try {
        await updateWorkspace(workspaceId, workspaceName, workspaceDescription, workspace.ownerId, isPublic);
        setAlert({ type: 'success', message: 'Workspace updated successfully.' });
        const workspaces = await fetchWorkspaces(workspaceId);
        const updatedWorkspace = workspaces.find((ws: any) => ws.id === workspaceId);
        setWorkspace(updatedWorkspace);
        closeAllPopups();
    } catch (error) {
        console.error('Failed to update workspace:', error);
        setAlert({ type: 'error', message: 'Failed to update workspace. Please try again.' });
    }
  };

  const handleVisibilityChange = async (newVisibility: 'Private' | 'Public') => {
    const isPublic = newVisibility === 'Public';
    console.log(`Updating visibility to: ${newVisibility}, isPublic: ${isPublic}`);
    
    try {
      await updateWorkspace(workspaceId, workspace.name, workspace.description, workspace.ownerId, isPublic);
      setVisibility(newVisibility);
      setWorkspace((prev: any) => ({
        ...prev,
        isPublic: isPublic
      }));
      setAlert({ type: 'success', message: 'Workspace visibility updated successfully.' });
      const workspaces = await fetchWorkspaces(workspaceId);
      const updatedWorkspace = workspaces.find((ws: any) => ws.id === workspaceId);
      setWorkspace(updatedWorkspace);
    } catch (error) {
      console.error('Failed to update workspace visibility:', error);
      setAlert({ type: 'error', message: 'Failed to update workspace visibility. Please try again.' });
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
      <WorkspaceHeader workspace={workspace} showEditIcon={true} onEdit={handleEditClick} />

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
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black opacity-50"></div>
            <DeleteConfirmation
              onDelete={handleDeleteWorkspace}
              onCancel={closeAllPopups}
              itemType="workspace"
            />
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

          {isEditModalOpen && (
            <CreateWorkspace
              workspaceName={workspaceName}
              workspaceDescription={workspaceDescription}
              setWorkspaceName={setWorkspaceName}
              setWorkspaceDescription={setWorkspaceDescription}
              onClose={() => setIsEditModalOpen(false)}
              onCreate={handleUpdateWorkspace}
              isEditMode={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkspaceSettings;
