import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/fetchAuth';

function Signup() {
  const navigate = useNavigate();

  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleRegister,
    isLoggedIn,
    checkingLogin,
  } = useAuth(() => {
    navigate('/signin');
  });

  useEffect(() => {
    if (!checkingLogin && isLoggedIn) {
      navigate('/boards');
    }
  }, [checkingLogin, isLoggedIn, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleRegister();
    console.log('Registration success:', success);
    if (success) {
      navigate('/signin');
    }
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
        <h2 className="text-2xl text-black font-semibold mb-4 text-center mb-8">SIGN UP</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-300 px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-300 px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <div className="mb-6 relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-300 px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-700 transition duration-200"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        {error && <p className="text-red-700 mt-2 text-center">{error}</p>}
        <div className="text-center mt-4">
          <p className="text-gray-600">
            Already have an Account?{' '}
            <Link to="/signin" className="text-indigo-500 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
