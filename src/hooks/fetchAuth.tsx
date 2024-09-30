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
      setLoading(true);
      setError(null);

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
      setLoading(true);
      setError(null);
    
      try {
        const response = await axios.post(`${config}/user/register`, { name, email, password });
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

    const handleLogout = () => {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      setUserData(null);
      onLogout();
    };

    const changePassword = async (): Promise<boolean> => {
      setLoading(true);
      setError(null);

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
      setLoading(true);
      setError(null);
    
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

  const getProfilePhoto = async (): Promise<any> => {
    try {
      const response = await axios.get(
        `${config}/user/get-PhotoProfile`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        }
      );

      return response.data;
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
  

  const deleteProfilePhoto = async (id: any) => {
    try {
      const response = await axios.delete(
        `${config}/user/delete-PhotoProfile` + id,
        {
          headers: {
            'Authorization': `${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          },
          data: { id }
        }
      );
  
      return response.data;  
    } catch (error) {
      console.error('Failed to delete board:', error);
      throw error;
    }
  };
  
  
  const forgotPassword = async (email: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
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
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(`${config}/user/forgot-token-verify`, { token });
      if (response.status === 200) {
        console.log('Token verified successfully:', response.data);
        return true;
      } else {
        setError('Token verification failed. Please try again.');
        return false;
      }
    } catch (error: any) {
      console.error('Token Verification Error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('Token verification failed. Please try again.');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const forgotChangePassword = async (token: string, newPassword: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
  
    try {
      const response = await axios.post(`${config}/user/forgot-change-password`, { token, newPassword });
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
    forgotChangePassword
  };
};

  export default useAuth;
