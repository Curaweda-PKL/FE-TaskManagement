import { useState } from 'react';
import Navbar from '../Component/Navbar';
import useAuth from '../hooks/fetchAuth';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const {
    userData,
    isLoggedIn,
    checkingLogin,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    changePassword,
    error,
    loading,
  } = useAuth(() => {}, () => {});

  const [confirmPassword, setConfirmPassword] = useState('');

  if (checkingLogin) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>You are not logged in. Please log in to view your profile.</div>;
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match.');
      return;
    }
    
    const success = await changePassword();
    if (success) {
      alert('Password changed successfully!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      alert('Failed to change password. Please try again.');
    }
  };

  return (
    <div className='min-h-screen bg-white font-sans text-black'>
      <div className='px-4'>
        <Navbar />
        <div className='mt-24 w-screen'>
          <h1 className='text-xl font-semibold mb-4'>ACCOUNT</h1>

          <div className='flex items-center mb-6'>
            <div className='w-12 h-12 bg-red-500 rounded-full mr-4'></div>
            <div>
              <h2 className='font-semibold'>{userData?.name}</h2>
              <p className='text-sm text-gray-600'>{userData?.email}</p>
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
            <div className="flex justify-center">
              <div className='max-w-md w-1/2'>
                <h3 className='font-bold mb-2'>Profile photo and header image</h3>
                <div className='w-full h-24 bg-gray-200 relative rounded-t-lg shadow-xl'>
                  <div className='w-12 h-12 bg-red-500 rounded-full absolute bottom-0 left-4 transform translate-y-1/2 z-20'></div>
                </div>
                <div className='w-full h-24 bg-white relative border-t-2 border-black rounded-b-lg shadow-lg'></div>
                <h3 className='font-bold mb-4 mt-7'>About you</h3>
                <div className='flex flex-col space-y-4 text-black'>
                  {['name', 'email'].map((field) => (
                    <div key={field} className='flex flex-col space-y-2'>
                      <label className='w-24 text-sm capitalize font-bold'>{field}</label>
                      <input
                        type="text"
                        name={field}
                        value={userData?.[field] || ''}
                        readOnly
                        className='flex-grow border-b pb-1 focus:outline-none focus:border-b-purple-600 bg-white'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className='max-w-md'>
                <h3 className='font-semibold mb-6 text-lg'>Password</h3>
                <p className='text-sm text-gray-600 mb-4 font-bold'>Change your password</p>
                <p className='text-sm text-gray-600 mb-10'>When you change your password, we keep you logged in on this device but may log you out of your other devices.</p>
                <form className='space-y-4' onSubmit={handlePasswordChange}>
                  <div>
                    <label className='block text-sm mb-1 font-bold'>Current Password</label>
                    <input
                      type="password"
                      className='w-full border rounded p-2 bg-white border-black-2'
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block text-sm mb-1 font-bold'>New Password</label>
                    <input
                      type="password"
                      className='w-full border rounded p-2 bg-white border-black-2'
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className='block text-sm mb-1 font-bold'>Confirm New Password</label>
                    <input
                      type="password"
                      className='w-full border rounded p-2 bg-white border-black-2'
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    className='bg-purple-600 text-white px-4 py-2 rounded text-sm'
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save'}
                  </button>
                  {error && <p className='text-red-500 mt-2'>{error}</p>}
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
