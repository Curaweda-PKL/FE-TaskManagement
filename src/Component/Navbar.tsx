import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretDown, MagnifyingGlass, Bell, Question, User, Star, Clipboard, ClipboardText, X, UsersThree } from 'phosphor-react';
import CreateBoard from './CreateBoard'
import work from '../assets/Media/work.png'
import createWork from '../assets/Media/createWork.svg'
import useAuth from '../hooks/fetchAuth';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showCreateBoard, setShowCreateBoard] = useState(false);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const navbarRef = useRef(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ workspaceName, workspaceDescription });
  };

  const handleCreateWorkspaceClick = () => {
    setShowCreateWorkspace(true);
    setOpenDropdown(null);
  };

  const closeCreateWorkspace = () => {
    setShowCreateWorkspace(false);
  };

  const handleToggle = (dropdown) => {
    setOpenDropdown(prevDropdown => prevDropdown === dropdown ? null : dropdown);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCreateBoardClick = () => {
    setShowCreateBoard(true);
    setOpenDropdown(null);
  };

  const closeCreateBoard = () => {
    setShowCreateBoard(false);
  };

  const handleCreateClick = () => {
    e.stopPropagation();
    handleToggle('create');
  };

  const { handleLogout } = useAuth(
    () => {},
    () => navigate('/')
  );

  const handleLogoutClick = () => {
    handleLogout();
    setOpenDropdown(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    }
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav 
      ref={navbarRef}
      className={`fixed z-20 bg-white top-0 left-0 right-0 px-4 sm:px-6 lg:px-12 py-3 transition-shadow duration-300 ${
        isHovered ? 'shadow-lg' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between z-[100]">
        <div className="flex items-center space-x-4">
          <a href="/" className="text-purple-600 font-bold text-2xl font-newsreader">TaskFlow</a>
          <div className="hidden lg:flex items-center space-x-4">
            <details
              className="relative inline-block"
              open={openDropdown === 'workspace'}
              onClick={(e) => { e.preventDefault(); handleToggle('workspace'); }}
            >
              <summary className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer list-none">
                Workspace
                <CaretDown size={16} className="ml-1" />
              </summary>
              <ul className="absolute left-0 mt-5 bg-white border border-gray-200 rounded-md shadow-lg w-80">
                <li className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500">Your workspaces</h3>
                  <div className="mt-2 flex items-center">
                    <div className="w-4 h-4 bg-red-600 mr-2 rounded"></div>
                    <a href="#" className="text-gray-800 font-semibold">Kelompok 1 Workspace</a>
                  </div>
                </li>
              </ul>
            </details>
            <details
              className="relative inline-block"
              open={openDropdown === 'recent'}
              onClick={(e) => { e.preventDefault(); handleToggle('recent'); }}
            >
              <summary className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer list-none">
                Recent
                <CaretDown size={16} className="ml-1" />
              </summary>
              <ul className="absolute left-0 mt-5 bg-white border border-gray-200 rounded-md shadow-lg w-80">
                <li className="p-4 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded mr-4"></div>
                  <div>
                    <h3 className="text-gray-800 font-semibold">Project 1</h3>
                    <p className="text-sm text-gray-500">Kelompok 1 Workspace</p>
                  </div>
                </li>
              </ul>
            </details>
            <details
              className="relative inline-block"
              open={openDropdown === 'starred'}
              onClick={(e) => { e.preventDefault(); handleToggle('starred'); }}
            >
              <summary className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer list-none">
                Starred
                <CaretDown size={16} className="ml-1" />
              </summary>
              <ul className="absolute left-0 mt-5 bg-white border border-gray-200 rounded-md shadow-lg w-80">
                <li className="p-4 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-orange-500 rounded mr-4"></div>
                  <div className="flex-1">
                    <h3 className="text-gray-800 font-semibold">Project 1</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">Kelompok 1 Workspace</p>
                      <Star size={16} className="text-yellow-500" />
                    </div>
                  </div>
                </li>
              </ul>
            </details>
            <div className="relative inline-block">
            <button
              onClick={handleCreateClick}
              className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-purple-900 transition duration-300"
            >
              Create
            </button>
            {openDropdown === 'create' && (
              <ul className="absolute left-0 mt-3 bg-white border border-gray-200 rounded-md shadow-lg w-72">
                <li
                  className="p-4 hover:bg-gray-100 cursor-pointer"
                  onClick={handleCreateBoardClick}
                >
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <Clipboard size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Create board</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    A board is made up of cards ordered on lists. Use it to manage projects, track information or organize anything.
                  </p>
                </li>
                <li className="p-4 hover:bg-gray-100 cursor-pointer" onClick={handleCreateWorkspaceClick}>
                  <div className="flex">
                    <div className="flex-shrink-0 mr-3">
                      <ClipboardText size={16} />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Create Workspace</h3>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">A Workspace is a place to store and manage boards</p>
                </li>
              </ul>
            )}
              {showCreateBoard && (
                <CreateBoard onClose={closeCreateBoard} />
              )}
              {showCreateWorkspace && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white shadow-lg overflow-hidden w-full max-w-3xl max-h-[90vh] flex relative">       
                  <div className="w-1/2 p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-black">Let's Build a Workspace</h2>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Workspace name</label>
                      <input type="text" className="w-full px-3 py-2 bg-white border border-gray-300" placeholder="Workspace..." value={workspaceName} onChange={(e) => setWorkspaceName(e.target.value)}/>
                      <p className="text-xs text-gray-500 mt-1">This is the name of your team or your organization.</p>
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Workspace description</label>
                      <textarea className="w-full px-3 py-2 bg-white border border-gray-300" 
                        placeholder="Our workspace is..." value={workspaceDescription} onChange={(e) => setWorkspaceDescription(e.target.value)}></textarea>
                      <p className="text-xs text-gray-500 mt-1">Get your members on board with a few words about your Workspace.</p>
                    </div>
                    <button onClick={closeCreateWorkspace} 
                      className="bg-purple-600 text-white px-4 py-2 text-sm font-semibold hover:bg-purple-700 transition duration-300 w-full">Continue</button>
                  </div>
                  <div className="w-1/2 flex items-center justify-center relative">
                    <button onClick={closeCreateWorkspace} className="absolute top-0 right-0 m-4 z-20 text-black hover:text-gray-600"><X size={24} />
                    </button>
                    <img src={createWork} alt="Background" className="w-full h-full object-cover" />
                    <div className="absolute w-64 h-48 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <img src={work} alt="Work" className="w-full h-full object-cover z-10" />
                    </div>
                  </div>
                </div>
              </div>
              )}
          </div>
          </div>
        </div>
        <button 
          className="lg:hidden"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="hidden lg:flex items-center space-x-4">
          <div className="relative">
            <input type="text" placeholder="Search" className="bg-gray-100 text-black rounded-md px-3 py-2 pl-10 text-sm w-64"/>
            <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <details
              className="relative inline-block"
              open={openDropdown === 'notification'}
              onClick={(e) => { e.preventDefault(); handleToggle('notification'); }}
            >
              <summary className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer list-none">
              <Bell size={24} className="text-gray-600 hover:text-gray-900 cursor-pointer" />
              </summary>
              <div className=" fixed right-0 mt-5 bg-white rounded-lg shadow-md p-4 w-w100 h-80 text-black">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Notifications</h2>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">only show unread</span>
                    <div className="w-12 h-6 bg-green-500 rounded-full p-1 cursor-pointer">
                      <div className="bg-white w-4 h-4 rounded-full shadow-md transform translate-x-6"></div>
                    </div>
                  </div>
                </div>
                <div className="border-t border-black pt-2">
                  <div className='border p-2'>
                  <p className="flex font-semibold border-b pb-2"><UsersThree size={24} />Task Management</p>
                  <div className="flex items-start mt-0 pt-2">
                    <div className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-white font-bold mr-3">
                      N
                    </div>
                    <div>
                      <p className="font-semibold">Najwan Muttaqin</p>
                      <p className="text-sm text-gray-600">
                        Added you to the Workspace Task management as an admin Jul 31, 2024,
                        10:52 AM
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </details>
          <Question size={24} className="text-gray-600 hover:text-gray-900 cursor-pointer" />
          <details
            className="relative inline-block"
            open={openDropdown === 'profile'}
            onClick={(e) => { e.preventDefault(); handleToggle('profile'); }}
          >
            <summary className="flex items-center text-gray-600 hover:text-gray-900 cursor-pointer list-none">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer">
                <User size={20} className="text-white" />
              </div>
            </summary>
            <ul className="fixed right-0 mt-4 bg-white border border-gray-200 rounded-md shadow-lg w-72">
              <li className="p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-4">ACCOUNT</h3>
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-red-500 rounded-full mr-3 flex items-center justify-center">
                    <User size={24} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">kelompok 1</p>
                    <p className="text-xs text-gray-500">@kelompok1</p>
                  </div>
                </div>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                <p className="text-sm text-gray-700">Switch Account</p>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleProfileClick}>
                <p className="text-sm text-gray-700">Profile and visibility</p>
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200" onClick={handleLogoutClick}>
            <p className="text-sm text-gray-700">Log out</p>
          </li>
            </ul>
          </details>
        </div>
      </div>
      <div 
        className={`lg:hidden mt-4 bg-white rounded-md shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-60 opacity-100 animate-slideDown' : 'max-h-0 opacity-0'}`}
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
          <input type="text" placeholder="Search" className="bg-gray-100 rounded-md px-3 py-2 w-full text-sm"/>
        </div>
      </div>
      </nav>
  );
}

export default Navbar;
