import React from 'react';
import Sticker from '../assets/Media/sticker.svg'

const WorkspaceHighlights: React.FC = () => {
  return (
    <div>
          <div className="max-w-md mt-8 font-sans text-black">
          <div className="bg-white border shadow-md mb-4">
            <div className="flex p-7">
              <div className="bg-red-500 w-28 h-auto flex flex-col justify-between p-2">
              </div>
              <div className="ml-4 flex flex-col justify-between">
                <h2 className="text-lg font-bold mb-2">Highlights</h2>
                <p className="text-sm text-gray-600 mb-3">Stay up to date with activity from your workspace and boards</p>
                <button className="w-full py-2 font-semibold bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                Got it! Dismiss this
              </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-orange-400 p-5">
            <div className='bg-gray-200 p-3 rounded-lg'>
            <span className="font-semibold text-gray-600">Tugas 1</span>
              <div className="flex items-center text-xs mt-1">
                <i className="fas fa-eye text-xs text-gray-600 mr-2"/>
                <span className="ml-2 bg-yellow-200 text-yellow-800  border-yellow-800 border px-2 py-0.5 rounded-full text-xs">
                  <i className='fas fa-clock mr-2'/>Sep 12 - Sep 13
                </span>
                <i className="fas fa-message text-xs text-gray-600 ml-4"/>
                <span className="ml-1">1</span>
              </div>
              </div>
              <p className="text-md mt-3 text-white">Kelompok 1 workspace <span className='ml-2 mr-2'>|</span> Project 1 : Team</p>
            </div>
            <div className="p-4 border-black border rounded-b-lg">
              <div className="flex items-start">
                <img src="https://via.placeholder.com/40" alt="User" className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                  <p className="font-semibold">Kelompok 1</p>
                  <p className="text-xs text-gray-500">a minute ago</p>
                </div>
              </div>
                  <p className="mt-2  text-sm">hai akhsan tugasnya dikerjakan sesuai waktu yang ditetapkan ya</p>
                  <img className='mt-2' src={Sticker}/>
              <button className="mt-3 flex w-[99%] p-2 items-center justify-center text-sm text-gray-600 bg-gray-200 hover:text-gray-800">
                <i className="fas fa-paper-plane mr-2"/>
                Reply
              </button>
            </div>
          </div>
        </div>
    </div>
    /*<div className="bg-white min-h-screen">
      <div className="max-w-screen-xl mx-auto px-8">
        <div className="bg-white rounded-lg shadow-sm mr-80">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-full h-48">
              <img src={Wolf} alt="Workspace Highlight" className="w-full h-full object-cover rounded-t-lg"/>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-bold mb-4">Stay up to date</h2>
              <p className="text-gray-600 max-w-md">
                Invite people to boards and cards, leave comments, add due dates, and we'll show the most important activity here.
              </p>
            </div>
          </div>
        </div>
      </div>
      <SideTask />
    </div>*/
  );
};

export default WorkspaceHighlights;