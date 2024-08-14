import React, { useState } from 'react';
import Feature from '../Pages/Feature';
import Solution from '../Pages/Solution'; // Import the Solution component
import { CaretDown } from 'phosphor-react';

function NavbarHome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false); // Add state for Solution
  const [isHovered, setIsHovered] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFeatures = () => {
    setIsFeaturesOpen(!isFeaturesOpen);
    if (!isFeaturesOpen) {
      setIsSolutionsOpen(false); // Close Solution when Features is opened
    }
  };

  const toggleSolutions = () => {
    setIsSolutionsOpen(!isSolutionsOpen);
    if (!isSolutionsOpen) {
      setIsFeaturesOpen(false); // Close Features when Solutions is opened
    }
  };

  return (
    <nav 
      className={`relative z-20 bg-white top-0 left-0 right-0 px-4 sm:px-6 lg:px-20 py-3 transition-shadow duration-300 ${
        isHovered ? 'shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <a href="/" className="text-purple-600 font-bold text-2xl font-newsreader">TaskFlow</a>
        
        <button 
          className="lg:hidden"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden lg:flex items-center space-x-10">
          <button 
            onClick={toggleFeatures}
            className={`flex items-center text-gray-600 hover:text-gray-900 ${
              isFeaturesOpen ? 'underline-active' : ''
            }`}
          >
            Features<CaretDown size={16} className="ml-1" />
          </button>
          <button 
            onClick={toggleSolutions}
            className={`flex items-center text-gray-600 hover:text-gray-900 ${
              isSolutionsOpen ? 'underline-active' : ''
            }`}
          >
            Solutions<CaretDown size={16} className="ml-1" />
          </button>
          <a 
            href="/boards" 
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-900 transition duration-300"
          >
            Go to your boards
          </a>
        </div>
      </div>

      <div 
        className={`lg:hidden mt-4 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-60 opacity-100 animate-slideDown' : 'max-h-0 opacity-0'
        }`}
      >
        <button 
          onClick={toggleFeatures}
          className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left ${
            isFeaturesOpen ? 'underline-active' : ''
          }`}
        >
          Features<CaretDown size={16} className="ml-1" />
        </button>
        <button 
          onClick={toggleSolutions}
          className={`flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left ${
            isSolutionsOpen ? 'underline-active' : ''
          }`}
        >
          Solutions<CaretDown size={16} className="ml-1" />
        </button>
        <a 
          href="/boards" 
          className="block px-4 py-2 text-gray-600 hover:bg-gray-100"
        >
          Solutions<CaretDown size={16} className="ml-1" />
        </a>
        <a 
          href="/boards" 
          className="block px-4 py-2 text-white bg-purple-600 hover:bg-purple-900 transition duration-300"
        >
          Go to your boards
        </a>
      </div>

      <Feature isOpen={isFeaturesOpen} />
      <Solution isOpen={isSolutionsOpen} /> {/* Add the Solution component */}
    </nav>
  );
}

export default NavbarHome;
