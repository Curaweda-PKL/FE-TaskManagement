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
  };
};

export default useAuth;
