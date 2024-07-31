import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="absolute z-20 bg-white top-0 left-0 right-0 px-4 sm:px-6 lg:px-20 py-3">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-purple-600 font-bold text-2xl font-newsreader">TaskFlow</Link>
        
        <button 
          className="lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden lg:flex items-center space-x-6">
          <Link to="/features" className="text-gray-600 hover:text-gray-900">Features</Link>
          <Link to="/solutions" className="text-gray-600 hover:text-gray-900">Solutions</Link>
          <Link 
            to="/boards" 
            className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-900 transition duration-300"
          >
            Go to your boards
          </Link>
        </div>
      </div>

      <div 
        className={`lg:hidden mt-4 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-60 opacity-100 animate-slideDown' : 'max-h-0 opacity-0'
        }`}
      >
        <Link to="/features" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Features</Link>
        <Link to="/solutions" className="block px-4 py-2 text-gray-600 hover:bg-gray-100">Solutions</Link>
        <Link 
          to="/boards" 
          className="block px-4 py-2 text-white bg-purple-600 hover:bg-purple-900 transition duration-300"
        >
          Go to your boards
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;