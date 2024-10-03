import React, { useState, useEffect } from 'react';
import Navbar from '../Component/Navbar';
import useAuth from '../hooks/fetchAuth';

function Profile() {
  const [activeTab, setActiveTab] = useState('profile');
  const [photo, setPhoto] = useState(null);
  const [showModal, setShowModal] = useState(false);
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
    updateUserName,
    updateProfilePhoto,
    deleteProfilePhoto,
    getProfilePhoto
  } = useAuth(() => { }, () => { });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [editedName, setEditedName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (userData) {
      setEditedName(userData?.name || '');
      fetchUserProfilePhoto();
    }
  }, [userData]);

  const fetchUserProfilePhoto = async () => {
    if (userData) {
      try {
        const userPhoto = await getProfilePhoto();
        setPhoto(userPhoto);
      } catch (error) {
        console.error('Error fetching photo profile:', error);
      }
    }
  };

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [alert]);


  if (checkingLogin) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <div>You are not logged in. Please log in to view your profile.</div>;
  }

  const handlePasswordChange = async (email: any) => {
    if (newPassword !== confirmPassword) {
      setAlert({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    const success = await changePassword(email, oldPassword, newPassword);
    if (success) {
      setAlert({ type: 'success', message: 'Password changed successfully!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setAlert({ type: 'error', message: 'Failed to change password. Please try again.' });
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameSave = async () => {
    setSavingName(true);
    try {
      const success = await updateUserName(editedName);
      if (success) {
        setIsEditing(false);
        setAlert({ type: 'success', message: 'Nama berhasil diperbarui.' });
      } else {
        setAlert({ type: 'error', message: 'Gagal memperbarui nama. Silakan coba lagi.' });
      }
    } catch (error: any) {
      console.error('Gagal memperbarui nama:', error);
      setAlert({ type: 'error', message: 'Gagal memperbarui nama. Silakan coba lagi.' });
    } finally {
      setSavingName(false);
    }
  };

  const handlePhotoUpload = async (event: any) => {
    const file = event?.target?.files[0];
    if (file && userData) {
      try {
        const updatedPhoto = await updateProfilePhoto(userData?.id, file);
        setPhoto(updatedPhoto);
        setAlert({ type: 'success', message: 'Foto profil berhasil diupdate!' });
        fetchUserProfilePhoto();
      } catch (error) {
        console.error('Error uploading photo:', error);
        setAlert({ type: 'error', message: 'Gagal mengunggah foto. Coba lagi.' });
      }
    }
  };

  const handleChangePhoto = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userData) {
      try {
        await updateProfilePhoto(userData.id, file);
        setAlert({ type: 'success', message: 'Foto profil berhasil diupdate!' });
        await fetchUserProfilePhoto();
        setShowModal(false);
      } catch (error) {
        console.error('Error changing photo:', error);
        setAlert({ type: 'error', message: 'Gagal mengubah foto. Coba lagi.' });
      }
    }
  };

  const handleDeletePhoto = async () => {
    if (userData) {
      try {
        await deleteProfilePhoto(userData?.id);
        setPhoto(null);
        setShowModal(false);
      } catch (error) {
        console.error('Error deleting photo:', error);
      }
    }
  };

  return (
    <div className='min-h-screen pb-20 bg-white font-sans text-black'>
      <div className='px-5'>
        <Navbar />
        <div className='mt-24'>
          <h1 className='text-xl font-semibold mb-4'>ACCOUNT</h1>

          {alert && (
            <div className={`p-4 mb-4 w-1/5 rounded-md fixed text-center 5 right-5 top-14 z-[102] ${alert?.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {alert?.message}
            </div>
          )}

          <div className='flex items-center mb-6'>
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4"
              />
            ) : (
              <i className="fas fa-user text-2xl text-gray-500 mr-4" />
            )}
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
              <div className='max-w-md md:w-1/2 w-4/5'>
                <h3 className='font-bold mb-2'>Profile photo and header image</h3>
                <div className='w-full h-24 bg-gray-200 relative rounded-t-lg shadow-xl'>
                  {photo ? (
                    <img
                      src={photo}
                      alt="Profile"
                      className='w-16 h-16 rounded-full absolute bottom-0 left-4 transform translate-y-1/2 z-20 object-cover cursor-pointer'
                      onClick={() => setShowModal(true)}
                    />
                  ) : (
                    <div className='w-16 h-16 bg-gray-400 rounded-full absolute bottom-0 left-4 transform translate-y-1/2 z-20 flex justify-center items-center group'>
                      <label htmlFor="profilePhotoUpload" className='cursor-pointer relative'>
                        <i className="fa-solid fa-plus text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></i>
                        <input
                          type="file"
                          id="profilePhotoUpload"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={handlePhotoUpload}
                        />
                      </label>
                    </div>
                  )}
                </div>
                <div className='w-full h-24 bg-white relative border-t border-black rounded-b-lg shadow-lg'></div>
                <h3 className='font-bold mb-4 mt-7'>About you</h3>
                <div className='flex flex-col space-y-4 text-black'>
                  <div className='flex flex-col space-y-2'>
                    <label className='w-24 text-sm capitalize font-bold'>name</label>
                    <div className='flex items-center'>
                      <input
                        type="text"
                        name="name"
                        value={isEditing ? editedName : (userData?.name || '')}
                        onChange={handleNameChange}
                        readOnly={!isEditing}
                        className='flex-grow border-b pb-1 focus:outline-none focus:border-b-purple-600 bg-white'
                      />
                      {isEditing ? (
                        <button
                          onClick={handleNameSave}
                          className='ml-2 bg-gray-200 text-black px-2 py-1 rounded text-sm'
                          disabled={savingName}
                        >
                          {savingName ? 'Saving...' : 'Save'}
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsEditing(true)}
                          className='ml-2 text-gray-700 px-2 py-1 rounded text-sm'
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className='flex flex-col space-y-2'>
                    <label className='w-24 text-sm capitalize font-bold'>email</label>
                    <input
                      type="text"
                      name="email"
                      value={userData?.email || ''}
                      readOnly
                      className='flex-grow border-b pb-1 focus:outline-none focus:border-b-purple-600 bg-white'
                    />
                  </div>
                </div>
              </div>

              {showModal && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                    <h3 className="text-lg font-bold mb-4">Manage Photo</h3>
                    <button
                      className="w-full bg-purple-600 text-white py-2 px-4 mb-3 rounded hover:bg-purple-700"
                    >
                      <label className="w-full">
                        
                      Change Photo
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleChangePhoto}
                          accept="image/*"
                        />
                      </label>
                    </button>
                    <button
                      onClick={handleDeletePhoto}
                      className="w-full bg-red-500 text-white py-2 px-4 mb-3 rounded hover:bg-red-600"
                    >
                      Delete Photo
                    </button>
                    <button
                      onClick={() => setShowModal(false)}
                      className="w-full bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              <input
                type="file"
                id="profilePhotoUpload"
                className="hidden"
                onChange={handlePhotoUpload}
              />
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
