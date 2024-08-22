import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faPencilAlt, faBars, faGlobe, faTimes, faXmark } from '@fortawesome/free-solid-svg-icons';

const WorkspaceSettings: React.FC = () => {
  const [activePopup, setActivePopup] = useState<'visibility' | 'delete' | null>(null);
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Private');

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

  const handleBackgroundClick = () => {
    closeAllPopups();
  };

  return (
    <div className='bg-white min-h-screen text-gray-700' onClick={handleBackgroundClick}>
      <div className='border-b p-4 flex justify-between items-center'>
        <div className='flex items-center'>
          <div className='bg-red-600 w-10 h-10 rounded-md mr-3'></div>
          <div>
            <h1 className='text-xl font-bold flex items-center'>
              Kelompok 1's workspace
              <FontAwesomeIcon icon={faPencilAlt} className='text-gray-400 ml-2 text-sm' />
            </h1>
            <div className='text-sm text-gray-600 flex items-center'>
              <FontAwesomeIcon icon={faLock} className='mr-1' />
              Private | Workspace id : bNs98
            </div>
          </div>
        </div>
        <FontAwesomeIcon icon={faBars} className='text-xl text-gray-600' />
      </div>

      <div className='py-10 px-16'>
        <h2 className='text-xl font-medium mb-4'>Workspace Settings</h2>
        
        <div className='mb-6 relative'>
          <h3 className='text-lg mb-2 border-b py-1'>Workspace visibility</h3>
          <div className='flex justify-between items-center'>
            <div>
              <div className='flex items-center mb-1'>
                <FontAwesomeIcon 
                  icon={visibility === 'Private' ? faLock : faGlobe} 
                  className={`mr-2 ${visibility === 'Private' ? 'text-red-600' : 'text-green-600'}`} 
                />
                <span className=''>
                  {visibility} - This Workspace is {visibility === 'Private' ? "private. It's not indexed or visible to those outside the Workspace." : "public. It's visible to everyone."}
                </span>
              </div>
            </div>
            <button onClick={(e) => {
              e.stopPropagation();
              togglePopup('visibility');
            }} className='bg-gray-200 px-3 py-1 rounded text-sm relative'>
              Change
            </button>
          </div>
          
          <div className='mt-3 cursor-pointer' onClick={(e) => {
            e.stopPropagation();
            togglePopup('delete');
          }}>
              <p className='text-red-500 font-semibold hover:bg-gray-200 w-fit p-1.5 px-5 rounded-md'>Delete this workspace?</p>
          </div>

          {activePopup === 'delete' && (
            <div className='flex justify-center' onClick={(e) => e.stopPropagation()}>
              <div className="bg-white shadow-xl rounded-lg p-6 max-w-sm w-full text-center">
                <div className='flex justify-end right-0'>
                  <FontAwesomeIcon icon={faXmark} onClick={closeAllPopups}/>
                </div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Delete this workspace?
                </h2>
                <p className="text-sm text-gray-700 mb-6">
                  Are you sure you want to delete this workspace permanently? This can't be undone.
                </p>
                <div className="flex justify-center">
                  <button className="bg-[#FF0000] text-sm text-white font-medium py-1 px-10 rounded-lg hover:bg-red-600">
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
                <FontAwesomeIcon icon={faTimes} className='cursor-pointer' onClick={closeAllPopups} />
              </div>
              <p className='mb-3 text-center'>Select workspace visibility</p>
              <div className='mb-0'>
                <button 
                  className='block w-full text-left py-4 px-5 hover:bg-gray-200 border-b'
                  onClick={() => handleVisibilityChange('Private')}
                >
                  <FontAwesomeIcon icon={faLock} className='mr-4 text-red-600' />
                  Private
                </button>
                <button 
                  className='block w-full text-left py-4 px-5 hover:bg-gray-200'
                  onClick={() => handleVisibilityChange('Public')}
                >
                  <FontAwesomeIcon icon={faGlobe} className='mr-4 text-green-600' />
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