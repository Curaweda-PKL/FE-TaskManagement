import React from 'react';
import { Link } from 'react-router-dom';
import NavbarHome from '../Component/NavbarHome';
import Triangle from '../assets/Media/triangle.png';
import Ellipse from '../assets/Media/ellipse.png';
import Board from '../assets/Media/board.png';
import Feature from '../assets/Media/feature.png';
import Bug from '../assets/Media/bug.png'
import Web from '../assets/Media/website.png'
import Analysis from '../assets/Media/analysis.png'

function HomePage() {
  const cardData = [
    {
      title: 'Boards',
      content: 'TaskFlow boards keep tasks organized and work moving forward. In a glance, see everything from "things to do" to "aww yeah we did it!"'
    },
    {
      title: 'Lists',
      content: 'The Different stages of task. Start as simple as To Do, Doing or Done-or build a workflow custom fit to your team\'s needs. There\'s no wrong way to TaskFlow.'
    },
    {
      title: 'Cards',
      content: 'Cards represent tasks and ideas and hold all the information to get the job done. As you make progress, move cards across lists to tshow their status.'
    },
    {
      title: 'Report',
      content: 'Summarize how active one is in taking tasks, then also count the number of tasks taken, and calculate the workload taken. This summary will be displayed automatically on Friday, or you can also set it to be a monthly report instead of a weekly one.'
    }
  ];

  return (
    <div className='min-h-screen bg-white font-inter'>
      <div className='relative z-10 flex flex-col min-h-screen'>
        <NavbarHome/>
        <main className='min-h-screen flex-grow flex flex-col items-center md:items-start justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-12 relative'>
          <div className='absolute inset-0 z-0'>
            <img src={Triangle} alt='Background' className='w-full h-full object-cover' />
          </div>
          <div className='relative z-10 w-full mb-8 text-center md:text-left flex flex-col md:flex-row items-center md:items-start justify-between'>
            <div className='md:w-1/2'>
              <h1 className='text-2xl sm:text-3xl md:text-4xl text-black mb-4'>
                TaskFlow unifies all your tasks, teammates, and tools in one place.
              </h1>
              <Link to="/Signin">
                <button className='bg-purple-600 text-white px-6 py-2 rounded-md text-lg font-semibold w-36 h-12 mb-8 hover:bg-purple-900 transition duration-300'>
                  Login!
                </button>
              </Link>
              <div className='flex flex-row justify-center md:justify-start'>
                <div className='flex items-end'>
                  <img src={Bug} alt="Bug" className='w-16 sm:w-20 md:w-28' />
                </div>
                <div className='flex flex-col ml-4'>
                  <img src={Web} alt="Web" className='w-12 sm:w-16 md:w-20' />
                  <img src={Analysis} alt="Analysis" className='w-12 sm:w-16 md:w-20 mt-2' />
                </div>
              </div>
            </div>
            <div className='md:w-1/2 flex justify-end mt-4 md:mt-0'>
              <img src={Feature} alt="Feature" className='w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg' />
            </div>
          </div>
        </main>
        <main className='min-h-screen flex-grow flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-20 py-12 relative'>
          <div className='absolute inset-0 z-0'>
            <img src={Ellipse} alt='Background' className='w-full h-46 object-cover -mt-32' />
          </div>
          <div className='relative z-10 w-full mb-20 text-start'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl text-black pt-16 sm:pt-24 md:pt-36 mb-4 sm:mb-6 md:mb-8'>
              A Powerhouse for efficiency.
            </h1>
            <p className='text-lg sm:text-xl md:text-2xl text-black w-full md:w-3/5'>
              Easy, adaptable and effective. Boards, lists, cards and summary report provide a clear view of tasks and responsibilities.
            </p>
          </div>
          <div className='flex flex-col md:flex-row w-full justify-between items-start'>
            <div className='w-full md:w-1/2 pr-0 md:pr-8'>
              {cardData.map((card, index) => (
                <div key={index} className="bg-white border-l-8 border-sky-400 rounded-lg shadow-lg p-6 mb-4">
                  <h3 className="text-xl text-black font-semibold mb-2">{card.title}</h3>
                  <p className="text-black">{card.content}</p>
                </div>
              ))}
            </div>
            <div className='w-full md:w-1/2'>
              <img src={Board} alt="Board" className='w-full h-auto' />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default HomePage;
