import React from 'react';

const MemberPopup = ({ selectedCardList, isMemberPopupOpen, handleCloseMemberPopup }) => {
  if (!isMemberPopupOpen || !selectedCardList) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-100">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-xl font-bold mb-4">Members of {selectedCardList.title}</h2>
        <ul className="space-y-2">
          {selectedCardList.members.map((member, index) => (
            <li key={index} className="flex items-center justify-between">
              <span>{member.name}</span>
              <button className="ml-2">
                <i className="fas fa-pencil-alt"></i>
              </button>
            </li>
          ))}
        </ul>
        <button className="mt-4 bg-gray-300 text-black p-2 rounded w-full">Add new member</button>
        <button
          onClick={handleCloseMemberPopup}
          className="mt-4 bg-purple-600 text-white px-4 py-2 rounded w-full"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MemberPopup;
