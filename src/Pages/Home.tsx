import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../Component/Navbar';
import Triangle from '../Media/triangle.png';
import Ellipse from '../Media/ellipse.png'

function Home() {
  return (
    <div className='min-h-screen bg-white font-inter'>
      <div className='relative z-10 flex flex-col min-h-screen'>
        <Navbar />
        <main className='min-h-screen flex-grow flex flex-col items-center md:items-start justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-12 relative'>
          <div className='absolute inset-0 z-0'>
            <img src={Triangle} alt='Background' className='w-full h-full object-cover' />
          </div>
          <div className='relative z-10 w-full md:w-2/3 lg:w-1/2 mb-8 text-center md:text-left'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl text-black mb-4'>
              TaskFlow unifies all your tasks, teammates, and tools in one place.
            </h1>
            <Link to="/Signin">
              <button className='bg-purple-600 text-white px-6 py-2 rounded-md text-lg font-semibold w-36 h-12 hover:bg-purple-900 transition duration-300'>
                Login!
              </button>
            </Link>
          </div>
        </main>
        <main className='min-h-screen flex-grow flex flex-col items-center md:items-start px-4 sm:px-8 md:px-12 lg:px-20 py-12 relative'>
          <div className='absolute inset-0 z-0'>
            <img src={Ellipse} alt='Background' className='w-full h-46 object-cover -mt-32' />
          </div>
          <div className='relative z-10 w-full md:w-2/3 lg:w-1/2 mb-8 text-center md:text-left'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl text-black pt-16 sm:pt-24 md:pt-36 mb-4 sm:mb-6 md:mb-8'>
              A Powerhouse for efficiency.
            </h1>
            <p className='text-xl sm:text-2xl md:text-3xl text-black'>
              Easy, adaptable and effective. Boards, lists, cards and summary report provide a clear view of tasks and responsibilities
            </p>
          </div>
          <div className='flex flex-row'>
            <div>
              
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Home;