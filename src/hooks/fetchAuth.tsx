import { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config/baseUrl';

const useAuth = (onSuccess: any): any => {
  const [name, setName] = useState<any>('');
  const [email, setEmail] = useState<any>('');
  const [password, setPassword] = useState<any>('');
  const [loading, setLoading] = useState<any>(false);
  const [error, setError] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingLogin, setCheckingLogin] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await axios.get(`${config}/user/check-login`, { headers: { Authorization: token } });
        setIsLoggedIn(response.data.isLoggedIn);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      } finally {
        setCheckingLogin(false);
      }
    };

    checkLogin();
  }, [token]);

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
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
    return false;
  };

  const handleRegister = async (): Promise<any> => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await axios.post(`${config}/user/register`, { name, email, password });
      if (response.status === 200) {
        return await handleLogin();
      }
    } catch (error: any) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
    return false;
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
    handleLogin,
    handleRegister,
    handleLogout,
    isLoggedIn,
    checkingLogin,
  };
};

export default useAuth;