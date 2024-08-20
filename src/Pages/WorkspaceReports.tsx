import React from 'react';

const WorkspaceReports: React.FC = () => {
  return (
    <div className='bg-white min-h-screen'>
      <div className='container mx-auto px-4 py-4'> 
        <h1 className='text-black text-2xl font-bold mb-2'>Reports</h1> 
        <h2 className='text-xl font-bold'>YOUR PERFORMANCE THIS WEEK, <span className='text-yellow-400'>AVERAGE</span></h2>
        <p className='text-gray-700 mt-2'>Complete task to fill the performance bar!</p>
        <div className='flex items-center mt-4 mb-10'> 
          <div className='w-full bg-gray-300 h-2 rounded-md'>
            <div className='bg-blue-500 h-2 rounded-md' style={{ width: '40%' }}></div>
          </div>
          <span className='ml-4'>2/5</span>
        </div>
        <p className='text-gray-500 mt-2'>Bar resetting in : 4d 12h</p>

        {/* Search bar above the table */}
        <div className='mb-4'>
          <input
            type='text'
            placeholder='Search...'
            className='border border-gray-300 rounded-md py-2 px-4 text-sm w-full'
          />
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
