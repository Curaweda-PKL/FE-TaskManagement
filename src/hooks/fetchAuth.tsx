import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

const useAuth = (onSuccess: () => void): any => {
  const [name, setName] = useState<any>('');
  const [email, setEmail] = useState<any>('');
  const [password, setPassword] = useState<any>('');
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<any>(false);
  const [checkingLogin, setCheckingLogin] = useState<any>(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
    setCheckingLogin(false);
  }, []);

  const handleLogin = async (): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await axios.post(`${config}/user/login`, { email, password });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setIsLoggedIn(true);
        onSuccess();
        return true;
      }
    } catch (error: any) {
      console.error('Login Error:', error);
      setError(error?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleRegister = async (): Promise<any> => {
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
    } catch (error) {
      console.error('Registration error:', error);
      setError('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    isLoggedIn,
    checkingLogin,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};

export default useAuth;
