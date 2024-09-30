import React from 'react';

const MemberPopup = ({ selectedCardList, isMemberPopupOpen, handleCloseMemberPopup }) => {
  if (!isMemberPopupOpen || !selectedCardList) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white w-72 p-4 rounded-lg shadow-lg text-gray-900">
        <div className="flex justify-between items-center mb-4">
          <div className="flex justify-center w-full">
            <h2 className="text-lg font-medium">Member</h2>
          </div>
          <button onClick={handleCloseMemberPopup} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
        
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search member"
            className="w-full py-2 px-3 bg-gray-200 rounded-md text-sm"
          />
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-normal mb-2">Board members</h3>
          <ul className="space-y-2">
            {selectedCardList.members.slice(0, 3).map((member, index) => (
              <li key={index} className="flex items-center py-1 px-3 bg-gray-200 rounded-md">
                <i className="fas fa-user bg-gray-100 text-xs rounded-full text-gray-400 mr-2 p-2 w-6 h-6 flex items-center justify-center"></i>
                <span className="text-sm">{member.name}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h3 className="text-sm font-normal mb-2">Workspace members</h3>
          <ul className="space-y-2">
            {selectedCardList.members.slice(3, 6).map((member, index) => (
              <li key={index} className="flex items-center py-2 px-3 bg-gray-200 rounded-md">
                <i className="fas fa-user bg-gray-100 text-xs rounded-full text-gray-400 mr-2 p-2 w-6 h-6 flex items-center justify-center"></i>
                <span className="text-sm">{member.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MemberPopup;