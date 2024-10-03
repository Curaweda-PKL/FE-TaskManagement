import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/fetchAuth';
import { fetchWorkspaces, createWorkspace } from '../hooks/fetchWorkspace';
import CreateWorkspace from './CreateWorkspace';

function Navbar() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showCreateWorkspace, setShowCreateWorkspace] = useState(false);
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceDescription, setWorkspaceDescription] = useState('');
  const [workspaces, setWorkspaces] = useState<any[]>([]);
  const navbarRef = useRef<HTMLDivElement | null>(null);

  const { userData, isLoggedIn, handleLogout, getProfilePhoto } = useAuth(() => { }, () => navigate('/'));

  useEffect(() => {
    fetchWorkspacesData();
    fetchUserProfilePhoto();
  }, []);

  const fetchWorkspacesData = async () => {
    try {
      const fetchedWorkspaces = await fetchWorkspaces(workspaces);
      setWorkspaces(fetchedWorkspaces);
    } catch (error) {
      console.error('Failed to fetch workspaces:', error);
    }
  };

  const fetchUserProfilePhoto = async () => {
    try {
      const userPhoto = await getProfilePhoto();
      setPhoto(userPhoto);
    } catch (error) {
      console.error('Error fetching photo profile:', error);
    }

  };

  const handleToggle = (dropdown: string) => {
    setOpenDropdown(prevDropdown => prevDropdown === dropdown ? null : dropdown);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleCreateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggle('create');
  };

  const closeCreateWorkspace = () => {
    setShowCreateWorkspace(false);
  };

  const handleCreateWorkspaceClick = () => {
    setShowCreateWorkspace(true);
    setOpenDropdown(null);
  };

  const handleCreateWorkspace = async (name: string, description: string) => {
    try {
      await createWorkspace(name, description, userData?.id);
      await fetchWorkspacesData();
      closeCreateWorkspace();
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  const handleLogoutClick = () => {
    handleLogout();
    setOpenDropdown(null);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleWorkspaceClick = (workspaceId: any) => {
    navigate(`/workspace/${workspaceId}/boards-ws`);
    setOpenDropdown(null);
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const buttonClass = 'bg-white border-none shadow-none hover:bg-gray-200';


  return (
    <nav
      ref={navbarRef}
      className={`fixed z-20 bg-white top-0 left-0 right-0 px-4 sm:px-6 lg:px-12 py-2 transition-shadow duration-300 ${isHovered ? '' : ''
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between z-[100]">
        <div className="flex items-center space-x-4">
          <a href="/boards" className="text-purple-600 font-bold text-2xl font-newsreader btn bg-white border-none shadow-none hover:bg-gray-300">TaskFlow</a>
          <div className="hidden md:flex items-center space-x-4 h-5">
            <div className="relative">
              <button onClick={() => handleToggle('workspace')}
                className={`flex items-center text-gray-600 hover:text-gray-900 btn-sm cursor-pointer btn ${buttonClass}`}>
                Workspace
                <i className={`${openDropdown === 'workspace' ? 'ph-caret-up' : 'ph-caret-down'} ml-1`}></i>
              </button>
              {openDropdown === 'workspace' && (
                <ul className="absolute left-0 mt-5 bg-white border border-gray-200 rounded-md shadow-lg w-80">
                  <li className="p-4">
                    <h3 className="text-sm font-semibold text-gray-500">Your workspaces</h3>
                    {workspaces.map(workspace => (
                      <div key={workspace.id} className={`mt-2 flex items-center justify-start p-2 rounded-md cursor-pointer btn btn-sm ${buttonClass}`} onClick={() => handleWorkspaceClick(workspace.id)}>
                        <div className="w-4 h-4 bg-red-600 mr-2 rounded"></div>
                        <a className="text-gray-800 font-semibold">{workspace.name}</a>
                      </div>
                    ))}
                  </li>
                </ul>
              )}
            </div>
            <div className="relative">
              <button onClick={handleCreateClick} className="bg-purple-600 text-white px-4 rounded-md text-sm font-semibold btn btn-sm hover:bg-purple-900 border-none">
                Create
              </button>
              {openDropdown === 'create' && (
                <ul className="absolute left-0 mt-3 bg-white border border-gray-200 rounded-md shadow-lg w-72">
                  <li className="p-4 hover:bg-gray-100 cursor-pointer" onClick={handleCreateWorkspaceClick}>
                    <div className="flex">
                      <div className="flex-shrink-0 mr-3">
                        <i className='fas fa-clipboard-list' />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">Create Workspace</h3>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">A Workspace is a place to store and manage boards</p>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden md:block relative">
            <input type="text" placeholder="Search" className="bg-gray-100 text-black rounded-md px-3 py-2 pl-10 text-sm w-64" />
            <i className='ph-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500'></i>
          </div>
          <div className="hidden md:flex items-center">
            <div className="relative inline-block">
              <button onClick={() => handleToggle('notification')} className={`flex items-center text-gray-600 cursor-pointer btn btn-sm ${buttonClass}`}>
                <i className="fas fa-bell text-gray-600 cursor-pointer" />
              </button>
              {openDropdown === 'notification' && (
                <div className="fixed right-0 mt-5 bg-white rounded-lg shadow-md p-4 w-w100 h-80 text-black">
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
                    <div className='p-2'>
                      <div className='flex items-center gap-2'>
                        <i className='fas fa-users' />
                        <p className="flex font-semibold border-b">Task Management</p>
                      </div>
                      <div className="flex items-start py-2 border-b gap-2">
                        <div>
                          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mt-1.5">
                            <i className="fas fa-user text-white text-[12px]" />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold">Najwan</p>
                          <p className="text-sm text-gray-600">
                            Added you to the Workspace Task management as an admin Jul 31, 2024,
                            10:52 AM
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative inline-block">
              <button
                onClick={() => handleToggle('profile')}
                className={`flex items-center cursor-pointer btn ${buttonClass} btn-sm px-1`}
              >
                {photo ? (
                  <img
                    src={photo}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <i className="fas fa-user text-gray-500" />
                )}
              </button>
              {openDropdown === 'profile' && isLoggedIn && (
                <ul className="fixed right-0 mt-4 bg-white border border-gray-200 rounded-md shadow-lg w-72">
                  <li className="p-4">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">ACCOUNT</h3>
                    <div className="flex items-center mb-4">
                      {photo ? (
                        <img
                          src={photo}
                          alt="Profile"
                          className="w-10 h-10 rounded-full mr-2"
                        />
                      ) : (
                        <i className="fas fa-user text-xl text-gray-500 mr-2" />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{userData?.name}</p>
                        <p className="text-xs text-gray-500">{userData?.email}</p>
                      </div>
                    </div>
                  </li>
                  <li className='px-2 py-2' onClick={handleProfileClick}>
                    <p className={`text-sm text-gray-700 btn-sm btn ${buttonClass}`}>Profile and visibility</p>
                  </li>
                  <li className="px-2 py-2 border-t border-gray-200">
                    <p className={`text-sm text-red-700 btn btn-sm ${buttonClass}`} onClick={handleLogoutClick}>Log out</p>
                  </li>
                </ul>
              )}
            </div>
          </div>
          <button
            className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu"><i className='fas fa-bars text-black' />
          </button>
        </div>
      </div>
      <div
        className={`md:hidden w-full mt-4 bg-white rounded-md overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 py-2">
          <input type="text" placeholder="Search" className="bg-gray-100 rounded-md px-3 py-2 w-full text-sm mb-2" />
        </div>
        <button onClick={() => handleToggle('workspace')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left">Workspace<i className='ph-caret-down ml-1'></i>
        </button>
        {openDropdown === 'workspace' && (
          <ul className="absolute left-0 mt-32 bg-white border border-gray-200 w-full">
            <li className="p-4">
              <h3 className="text-sm font-semibold text-gray-500">Your workspaces</h3>
              {workspaces.map(workspace => (
                <div key={workspace.id} className="mt-2 flex items-center hover:bg-gray-100 p-2 rounded-md cursor-pointer" onClick={() => handleWorkspaceClick(workspace.id)}>
                  <div className="w-4 h-4 bg-red-600 mr-2 rounded"></div>
                  <a className="text-gray-800 font-semibold hover:text-purple-600">
                    {workspace.name}
                  </a>
                </div>
              ))}
            </li>
          </ul>
        )}

        <button
          onClick={() => handleToggle('notification')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left">
          Notifications<i className="fas fa-bell ml-1" />
        </button>
        {openDropdown === 'notification' && (
          <div className="absolute top-[290px] left-0 bg-gray-50 p-4 m-0 shadow text-black w-full">
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
                <p className="flex font-semibold border-b pb-2"><i className='fas fa-users' />Task Management</p>
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
        )}
        <button
          onClick={() => handleToggle('profile')} className="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-100 w-full text-left">
          Profile<i className="fas fa-user ml-1" />
        </button>
        {openDropdown === 'profile' && (
          <ul className="absolute right-0 mt-[50px] bg-gray-50 px-8 py-2 w-full">
            <li className="mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-red-500 rounded-full mr-2 flex items-center justify-center">
                  <i className="fas fa-user text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{userData?.name}</p>
                  <p className="text-xs text-gray-500">{userData?.email}</p>
                </div>
              </div>
            </li>
            <li className="py-1" onClick={handleProfileClick}>
              <p className="text-sm text-gray-700">Profile and visibility</p>
            </li>
            <li className="py-1 border-t border-gray-200" onClick={handleLogoutClick}>
              <p className="text-sm text-gray-700">Log out</p>
            </li>
          </ul>
        )}

        <button
          onClick={handleCreateClick} className="block px-4 py-2 text-white bg-purple-600 hover:bg-purple-900 transition duration-300 w-full text-left">
          Create
        </button>
        {openDropdown === 'create' && (
          <ul className="left-0 bg-gray-50 px-4 py-2 w-full shadow">
            <li className="p-4 hover:bg-gray-100 cursor-pointer" onClick={handleCreateWorkspaceClick}>
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  <i className='fas fa-clipboard-list' />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Create Workspace</h3>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">A Workspace is a place to store and manage boards</p>
            </li>
          </ul>
        )}
      </div>

      {showCreateWorkspace && (
        <CreateWorkspace
          workspaceName={workspaceName}
          workspaceDescription={workspaceDescription}
          setWorkspaceName={setWorkspaceName}
          setWorkspaceDescription={setWorkspaceDescription}
          onClose={closeCreateWorkspace}
          onCreate={handleCreateWorkspace}
          isEditMode={false}
        />
      )}
    </nav>
  );
}

export default Navbar;