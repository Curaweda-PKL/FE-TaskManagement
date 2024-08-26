import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/fetchAuth';

function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSuccess = () => {
    navigate('/boards');
  };

  const onLogout = () => {
    navigate('/');
  };

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    handleLogout,
    isLoggedIn,
    checkingLogin,
  } = useAuth(onSuccess, onLogout);

  useEffect(() => {
    if (!checkingLogin && isLoggedIn) {
      navigate('/boards');
    }
  }, [checkingLogin, isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogin();
    if (success) {
      window.location.reload();
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  if (checkingLogin) {
    return (
      <div className="flex justify-center">
        <span className="loading loading-bars loading-lg h-screen z-20"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white px-6 py-10 rounded-xl shadow-xl w-80">
        <h2 className="text-2xl text-black font-semibold mb-4 text-center mb-8">LOGIN</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-300 px-4 py-2 text-black border rounded-full focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-6 relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-300 px-4 py-2 text-black border rounded-full focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
            >
              {showPassword ? (
                <i className="ph-eye text-xl"></i>
              ) : (
                <i className="ph-eye-slash text-xl"></i>
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        {error && <p className="text-red-700 mt-2 text-center">{error}</p>}
        <div className="text-center mt-4">
          <Link to="/ForgotPassword" className="text-indigo-500 hover:underline">Forgot Your Password?</Link>
          <p className="text-gray-600 mt-2">
            Can't Log in?{' '}
            <Link to="/signup" className="text-indigo-500 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
        {isLoggedIn && (
          <div className="mt-4 text-center">
            <p className="text-green-600">You are currently logged in.</p>
            <button
              onClick={handleLogout}
              className="mt-2 bg-red-500 text-white py-1 px-3 rounded-full hover:bg-red-700 transition duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Signin;