import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faUserFriends, faPencilAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const WorkspaceProject = () => {
  const teamMembers = [
    { name: 'Akhsan', color: 'bg-red-500' },
    { name: 'M Najwan', color: 'bg-yellow-500' },
    { name: 'Satriya', color: 'bg-green-500' },
  ];

  return (
    <div className="m-h-screen">
      <header className="flex bg-gray-100 p-4 justify-between items-center mb-6">
        <div className="flex items-center space-x-7">
          <h1 className="text-xl text-black font-medium">Project 1</h1>
          <FontAwesomeIcon icon={faStar} className="text-gray-400" />
          <div className="flex -space-x-1">
            <FontAwesomeIcon icon={faUserFriends} className="text-gray-400" />
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-1 rounded text-sm">
          Share
        </button>
      </header>
      
      <main className="flex px-8 bg-white mb-4">
        <div className="bg-white rounded-2xl shadow-xl border p-4 mr-4 w-64">
          <h2 className="text-xl text-center p-5 mb-4 text-gray-700">TEAM</h2>
          <ul className="space-y-2">
            {teamMembers.map((member, index) => (
              <li key={index} className="bg-gray-100 rounded-full p-2 flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full ${member.color} mr-2`}></div>
                  <span className="text-black text-sm">{member.name}</span>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <FontAwesomeIcon icon={faPencilAlt} className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
          <button className="text-gray-500 hover:text-gray-700 mt-6 w-full text-left text-sm">
            + Add card
          </button>
        </div>
        <button className="bg-gray-200 text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl h-10 w-44 text-sm">
        <FontAwesomeIcon icon={faPlus} className="h-3 w-3 mr-3" />
          Add another list
        </button>
      </main>
    </div>
  );
};

export default WorkspaceProject;