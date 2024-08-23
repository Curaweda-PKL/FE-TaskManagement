import React, { useState } from 'react';
import Navbar from '../Component/Navbar';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    name: 'ketompok1',
    username: 'ketompok1',
    email: 'ketompok1@gmail.com'
  });

  return (
    <div className='min-h-screen bg-white font-sans'>
      <div className='max-w-5xl mx-auto px-4'>
        <Navbar />
        <div className='mt-8'>
          <h1 className='text-xl font-semibold mb-4'>ACCOUNT</h1>
          
          <div className='flex items-center mb-6'>
            <div className='w-12 h-12 bg-red-500 rounded-full mr-4'></div>
            <div>
              <h2 className='font-semibold'>{profile.name}</h2>
              <p className='text-sm text-gray-600'>@{profile.username}</p>
            </div>
          </div>

          <div className='border-b mb-6'>
            <button 
              className={`mr-6 pb-2 ${activeTab === 'profile' ? 'border-b-2 border-purple-600 font-semibold' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button 
              className={`pb-2 ${activeTab === 'password' ? 'border-b-2 border-purple-600 font-semibold' : ''}`}
              onClick={() => setActiveTab('password')}
            >
              Password
            </button>
          </div>

          {activeTab === 'profile' ? (
            <div className='max-w-md'>
              <h3 className='font-semibold mb-2'>Profile photo and header image</h3>
              <div className='w-full h-24 bg-gray-200 mb-6 relative rounded'>
                <div className='w-12 h-12 bg-red-500 rounded-full absolute bottom-0 left-4 transform translate-y-1/2'></div>
              </div>
              <h3 className='font-semibold mb-4'>About you</h3>
              <div className='space-y-4'>
                {['name', 'username', 'email'].map((field) => (
                  <div key={field} className='flex items-center'>
                    <label className='w-24 text-sm capitalize'>{field}</label>
                    <input 
                      type="text" 
                      name={field} 
                      value={profile[field]} 
                      readOnly
                      className='flex-grow border-b pb-1 focus:outline-none focus:border-purple-600'
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className='max-w-md'>
              <h3 className='font-semibold mb-2'>Password</h3>
              <p className='text-sm text-gray-600 mb-4'>Change your password</p>
              <p className='text-sm text-gray-600 mb-6'>When you change your password, we keep you logged in on this device but may log you out of your other devices.</p>
              <form className='space-y-4'>
                <div>
                  <label className='block text-sm mb-1'>Current Password</label>
                  <input type="password" className='w-full border rounded p-2' />
                </div>
                <div>
                  <label className='block text-sm mb-1'>New Password</label>
                  <input type="password" className='w-full border rounded p-2' />
                </div>
                <div>
                  <label className='block text-sm mb-1'>Confirm New Password</label>
                  <input type="password" className='w-full border rounded p-2' />
                </div>
                <button className='bg-purple-600 text-white px-4 py-2 rounded text-sm'>Save</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;