import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faPencilAlt, faBars, faGlobe, faTimes } from '@fortawesome/free-solid-svg-icons';

const WorkspaceSettings: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [visibility, setVisibility] = useState<'Private' | 'Public'>('Private');

  const togglePopup = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  const handleBackgroundClick = () => {
    if (isPopupVisible) {
      closePopup();
    }
  };

  const handleVisibilityChange = (newVisibility: 'Private' | 'Public') => {
    setVisibility(newVisibility);
    closePopup();
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
            <button onClick={togglePopup} className='bg-gray-200 px-3 py-1 rounded text-sm relative'>
              Change
            </button>
          </div>

          {isPopupVisible && (
            <div
              className='absolute right-0 mt-2 bg-white border py-1 shadow-lg w-1/3 z-10'
              onClick={(e) => e.stopPropagation()}
            >
              <div className='flex justify-end px-1'>
                <FontAwesomeIcon icon={faTimes} className='cursor-pointer' onClick={closePopup} />
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
