import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

const useAuth = (onSuccess: () => void, onLogout: () => void): any => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkingLogin, setCheckingLogin] = useState<boolean>(true);
  const [userData, setUserData] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
      fetchUserData();
    }
    setCheckingLogin(false);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${config}/user/user-data`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUserData(response.data);
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      setError('Failed to fetch user data.');
    }
  };

  const handleLogin = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${config}/user/login`, { email, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        fetchUserData();
        onSuccess();
        return true;
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleRegister = async (): Promise<boolean> => {
    try {
      const token = localStorage.getItem('token');
  
      const response = await axios.post(
        `${config}/user/register`,
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200 || response.status === 201) {
        console.log('Registration successful:', response.data);
        return true;
      } else {
        setError('Registration failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Registration failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };
  

  const getCodeVerify = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${config}/user/get-code-verify`, { email });
      if (response.status === 200) {
        console.log('Verification code sent successfully:', response.data);
        return true;
      } else {
        setError('Failed to send verification code. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Error getting verification code:', error);
      setError(error.response?.data?.error || 'Failed to get verification code.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const verify = async (code: string): Promise<boolean> => {
    try {
      const response = await axios.post(`${config}/user/verify`, { email, code });
      if (response.status === 200) {
        console.log('Verification successful:', response.data);
        return true;
      } else {
        setError('Failed to verify code. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setError(error.response?.data?.error || 'Verification failed.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async (): Promise<boolean> => {
    try {
      const response = await axios.post(`${config}/user/resend-verification`, { email });
      if (response.status === 200) {
        console.log('Verification email resent successfully:', response.data);
        return true;
      } else {
        setError('Failed to resend verification email. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Resend verification error:', error);
      setError(error.response?.data?.error || 'Failed to resend verification.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    onLogout();
  };

  const changePassword = async (): Promise<boolean> => {
    try {
      const response = await axios.put(
        `${config}/user/change-password`,
        { email, oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.status === 200) {
        console.log('Password changed successfully:', response.data);
        return true;
      } else {
        setError('Failed to change password. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Change Password Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to change password. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateUserName = async (newName: string): Promise<boolean> => {
    try {
      const response = await axios.put(
        `${config}/user/update`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );

      if (response.status === 200) {
        setUserData(prevData => Object.assign({}, prevData, { name: newName }));
        return true;
      } else {
        setError('Failed to update name. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Update Name Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to update name. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getProfilePhoto = async (): Promise<string> => {
    try {
      const response = await axios.get(
        `${config}/user/get-PhotoProfile`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          responseType: 'blob'
        }
      );

      const blobUrl = URL.createObjectURL(response.data);

      console.log(response.data);
      console.log(blobUrl);

      return blobUrl;
    } catch (error: any) {
      console.error('Failed to fetch profile photo:', error);
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Failed to fetch profile photo. Please try again.');
      }
    }
  };

  const updateProfilePhoto = async (userId: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append('userId', userId);
      formData.append('file', file);

      const response = await axios.post(
        `${config}/user/update-PhotoProfile`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      return response.data;
    } catch (error: any) {
      console.error('Failed to update profile photo:', error);
      if (error.response && error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error('Failed to update profile photo. Please try again.');
      }
    }
  };


  const deleteProfilePhoto = async () => {
    try {
      const response = await axios.delete(
        `${config}/user/delete-PhotoProfile`,
        {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to delete photo:', error);
      throw error;
    }
  };


  const forgotPassword = async (email: any): Promise<boolean> => {
    try {
      const response = await axios.post(`${config}/user/forgot-password`, { email });
      if (response.status === 200) {
        console.log('Forgot password email sent:', response.data);
        return true;
      } else {
        setError('Failed to send forgot password email. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Forgot Password Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to send forgot password email. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const forgotTokenVerify = async (token: string): Promise<boolean> => {
    try {
      const response = await axios.post(
        `${config}/user/forgot-token-verify`,
        { token },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.status === 200) {
        const res = response.data;
        res.status = 200
        return res;
      }
      return false;
    } catch (error: any) {
      console.error('Error verifying token:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to verify token. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };



  const forgotChangePassword = async (token: any, newPassword: any) => {
    try {
      const response = await axios.post(
        `${config}/user/forgot-change-password`,
        { token, newPassword },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      if (response.status) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error resetting password:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getUserDataById = async (id: string | number): Promise<any> => {
    try {
      const response = await axios.get(`${config}/user/user-data/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user data by id:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Failed to fetch user data by id. Please try again.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    oldPassword,
    setOldPassword,
    newPassword,
    setNewPassword,
    loading,
    error,
    isLoggedIn,
    checkingLogin,
    userData,
    handleLogin,
    handleRegister,
    handleLogout,
    changePassword,
    updateUserName,
    getProfilePhoto,
    updateProfilePhoto,
    deleteProfilePhoto,
    forgotPassword,
    forgotTokenVerify,
    forgotChangePassword,
    getUserDataById,
    useState: { userData, setUserData },
    getCodeVerify,
    verify,
    resendVerification
  };
};

export default useAuth;