import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import{faChevronLeft, faChevronRight, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';

const WorkspaceReports: React.FC = () => {
  return (
    <div className='bg-white py-4 px-5 min-h-screen text-black'>
      <h1 className='text-xl font-bold mb-5'>Reports</h1> 
      <div className='container mx-auto px-4'> 
        <h2 className='text-2xl font-bold text-gray-600'>YOUR PERFORMANCE THIS WEEK, <span className='text-yellow-400'>AVERAGE</span></h2>
        <p className='text-gray-700 mt-2'>Complete task to fill the performance bar!</p>
        <div className='flex items-center mt-4'> 
          <div className='w-2/4 bg-gray-300 h-2 rounded-md'>
            <div className='bg-blue-500 h-2 rounded-md' style={{ width: '40%' }}></div>
          </div>
          <span className='ml-4'>2/5</span>
        </div>
        <p className='text-gray-500 mb-11'>Bar resetting in : 4d 12h</p>

        <div className='mb-4 flex items-center text-center w-full'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search...'
              className='bg-gray-200 text-gray-500 border-gray-400 rounded-xl  px-3 py-2 pl-10 text-sm w-64'
            />
            <FontAwesomeIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500' icon={faMagnifyingGlass} />
          </div>
          <div className='ml-10 mr-10'>
          <FontAwesomeIcon className='mr-11' icon={faChevronLeft} />
          <FontAwesomeIcon icon={faChevronRight} />
          </div>
          <h2 className='font-bold'>4-10 Agustus 2024</h2>
          <h2 className='ml-auto text-gray-500 font-bold bg-gray-200 py-2 px-4 rounded-xl'>WEEK</h2>
        </div>

        <table className='min-w-full bg-white border border-gray-300 text-center'>
          <thead>
            <tr>  
              <th className='px-1 py-3 border border-gray-500 text-sm font-bold text-gray-900'>NO</th>
              <th className='px-6 py-3 border border-gray-500 text-sm font-bold text-gray-900'>USERS</th>
              <th className='px-6 py-3 border border-gray-500 text-sm font-bold text-gray-900'>BOARD</th>
              <th className='px-6 py-3 border border-gray-500 text-sm font-bold text-gray-900'>CARD</th>
              <th className='px-6 py-3 border border-gray-500 text-sm font-bold text-gray-900'>SUBMISSIONS DATE</th>
            </tr>
          </thead>
          <tbody>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorkspaceReports;
