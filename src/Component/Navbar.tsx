import React, { useState } from 'react';
import { CaretDown, MagnifyingGlass, Bell, Question, User } from 'phosphor-react';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav 
      className={`fixed z-20 bg-white top-0 left-0 right-0 px-4 sm:px-6 lg:px-20 py-3 transition-shadow duration-300 ${
        isHovered ? 'shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-purple-600 font-bold text-2xl font-newsreader">TaskFlow</a>
          
          <div className="hidden lg:flex items-center space-x-4">
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              Workspace<CaretDown size={16} className="ml-1" />
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              Recent<CaretDown size={16} className="ml-1" />
            </button>
            <button className="flex items-center text-gray-600 hover:text-gray-900">
              Starred<CaretDown size={16} className="ml-1" />
            </button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-900 transition duration-300">
              Create
            </button>
          </div>
        </div>
        
        <button 
          className="lg:hidden"
          onClick={toggleMenu}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="bg-gray-100 text-black rounded-md px-3 py-2 pl-10 text-sm w-64"
            />
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <Bell size={24} className="text-gray-600 hover:text-gray-900 cursor-pointer" />
          <Question size={24} className="text-gray-600 hover:text-gray-900 cursor-pointer" />
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>

      <div 
        className={`lg:hidden mt-4 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-60 opacity-100 animate-slideDown' : 'max-h-0 opacity-0'
        }`}
      >
        <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left">
          Workspace<CaretDown size={16} className="ml-1" />
        </button>
        <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left">
          Recent<CaretDown size={16} className="ml-1" />
        </button>
        <button className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left">
          Starred<CaretDown size={16} className="ml-1" />
        </button>
        <button className="block px-4 py-2 text-white bg-purple-600 hover:bg-purple-900 transition duration-300 w-full text-left">
          Create
        </button>
        <div className="px-4 py-2">
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-100 rounded-md px-3 py-2 w-full text-sm"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
