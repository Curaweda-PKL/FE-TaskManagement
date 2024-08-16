import React, { useState } from 'react';
import userPlus from '../assets/Media/UserPlus.svg';
import GenericAvatar from '../assets/Media/GenericAvatar.svg';
import Grid from '../assets/Media/Grid.svg';
import setting from '../assets/Media/settings.svg';
import trello from '../assets/Media/Trello.svg';
import star from '../assets/Media/starIcon.svg';

interface Toolbars {
  id: number;
  name: string;
  img: string;
}
interface Projects {
  id: number;
  name: string;
}
interface Workspace {
  id: number;
  name: string;
}

const Boards: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [workspaceId, setWorkspaceId] = useState('');

  const toolbars: Toolbars[] = [
    { id: 1, name: "Board", img: trello },
    { id: 2, name: "Views", img: Grid },
    { id: 3, name: "Member", img: GenericAvatar },
    { id: 4, name: "Settings", img: setting },
  ];

  const projects: Projects[] = [
    { id: 1, name: "Project 1" },
    { id: 2, name: "Project 2" },
    { id: 3, name: "Project 3" },
    { id: 4, name: "Project 4" },
  ];

  const workspaces: Workspace[] = [
    { id: 1, name: "Kelompok 1 Workspace" },
    { id: 2, name: "Kelompok 2 Workspace" },
    { id: 3, name: "Kelompok 3 Workspace" },
    { id: 4, name: "Kelompok 4 Workspace" },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Joining workspace:', workspaceId);
    closeModal();
    setWorkspaceId('');
  };

  return (
    <div>
      <section className='flex items-center gap-5'>
        <h1 className='text-black font-bold text-2xl max768:text-xl'>YOUR WORKSPACE</h1>
        <div className="group flex py-2 px-3 gap-3 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer hover:bg-[rgba(131,73,255,0.2)] transition-colors duration-300 items-center" onClick={openModal}>
          <img src={userPlus} alt="" className='max768:h-[18px] max768:w-[18px]' />
          <span className="text-[#4A4A4A] font-semibold text-[15px] group-hover:text-[#7000FF] transition-colors duration-300">Join Workspace</span>
        </div>
      </section>

      <section className='flex flex-col gap-10 mt-9'>
        {workspaces.map((workspace) => (
          <div key={workspace.id}>
            <div className='mt-3 flex justify-between max-w-[905px] max1000:flex-col max1000:gap-3'>
              <div className='flex items-center gap-2 max-w-[300px] overflow-hidden'>
                <div className='min-h-5 max768:min-h-[18px] max768:min-w-[18px] min-w-5 bg-[#AE1616]'></div>
                <span className='font-semibold text-[#4A4A4A] text-[15px] overflow-hidden text-ellipsis whitespace-nowrap'>{workspace.name}</span>
              </div>
              <div className='grid grid-cols-4 max850:grid-cols-2 gap-5 max850:gap-2'>
                {toolbars.map((toolbar) => (
                  <div key={toolbar.id} className='group hover:bg-[rgba(131,73,255,0.2)] transition-colors duration-300 flex gap-2 bg-[rgba(131,73,255,0.1)] rounded-lg cursor-pointer py-2 px-3 items-center'>
                    <img src={toolbar.img} alt="User Plus" className='max768:h-[18px] max768:w-[18px]' />
                    <span className='text-[#4A4A4A] text-[15px] font-semibold group-hover:text-[#7000FF] transition-colors duration-300'>{toolbar.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className='grid gap-5 grid-cols-4 ml-1 max-w-[900px] mt-5 max1000:grid-cols-3 max850:grid-cols-2'>
              {projects.map((project) => (
                <div key={project.id} className='p-1 h-28 w-full bg-gradient-to-b from-[#00A3FF] to-[#9CD5D9] rounded-[5px] cursor-pointer'>
                  <h5 className='text-white'>{project.name}</h5>
                </div>
              ))}
              <div className='p-1 h-28 w-full bg-[#2e3b4286] rounded-[5px] flex items-center justify-center cursor-pointer'>
                <h5 className='text-white'>Create New Project</h5>
              </div>
            </div>
          </div>
        ))}
      </section >

      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 flex flex-col gap-5">
            <h2 className="text-xl text-center font-bold mb-4 text-black">Join Workspace</h2>
            <form onSubmit={handleSubmit}>
              <label htmlFor="workspaceId" className="block mb-2 text-black font-semibold">ID Workspace</label>
              <input
                type="text"
                id="workspaceId"
                value={workspaceId}
                onChange={(e) => setWorkspaceId(e.target.value)}
                placeholder="Type here..."
                className="w-full p-2 border bg-white border-gray-300 rounded mb-4 text-black"
              />
              <div className="flex gap-3 justify-end mt-8">
                <button type="button" onClick={closeModal} className="bg-gray-200 font-semibold text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-black">Cancel</button>
                <button type="submit" className="bg-purple-600 font-semibold text-white px-4 py-2 rounded hover:bg-purple-700">Send</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boards;