import React from 'react';

const WorkspaceReports: React.FC = () => {
  return (
    <div className='bg-gray-100 min-h-screen py-20'>
      <div className='container mx-auto px-4'>
        <h1 className='text-black text-2xl font-bold mb-4'>Reports</h1>
        
        <div className='flex mb-4'>
          <button className='bg-gray-300 text-black px-4 py-2 rounded-md mr-2'>Opportunity</button>
          <button className='bg-gray-300 text-black px-4 py-2 rounded-md mr-2'>Lead</button>
          <button className='bg-gray-300 text-black px-4 py-2 rounded-md'>Goals</button>
        </div>

        <div className='relative mb-8'>
          <input 
            type='text' 
            className='w-full py-2 px-4 rounded-md border border-gray-300' 
            placeholder='Search' 
          />
          <svg 
            className='w-6 h-6 text-gray-500 absolute top-1/2 right-3 transform -translate-y-1/2' 
            fill='currentColor' 
            viewBox='0 0 20 20'
          >
            <path 
              fillRule='evenodd' 
              d='M12.9 14.32a8 8 0 111.42-1.42l5.39 5.38a1 1 0 01-1.42 1.42l-5.38-5.39zM8 14a6 6 0 100-12 6 6 0 000 12z' 
              clipRule='evenodd' 
            />
          </svg>
        </div>

        <table className='min-w-full bg-white border border-gray-300'>
          <thead>
            <tr>
            <th className='px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-900'>NO</th>
              <th className='px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-900'>USERS</th>
              <th className='px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-900'>BOARD</th>
              <th className='px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-900'>CARD</th>
              <th className='px-6 py-3 border-b border-gray-300 text-left text-sm font-medium text-gray-900'>SUBMISSIONS DATE</th>
            </tr>
          </thead>
          <tbody>
            {/* Add your rows here */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkspaceReports;