import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/fetchAuth';
import { WindowsLogo } from 'phosphor-react';

function Signin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [verificationError, setVerificationError] = useState('');
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    handleLogin,
    verify,
    resendVerification,
    isLoggedIn,
    checkingLogin,
    isVerified,
    getCodeVerify
  } = useAuth({
    onLoginSuccess: () => {
      navigate('/boards');
    },
    onLogout: () => {
      navigate('/');
    },
  });

  useEffect(() => {
    if (!checkingLogin && isLoggedIn) {
      navigate('/boards');
    }
  }, [checkingLogin, isLoggedIn, navigate]);

  const handleVerification = async () => {
    setVerificationSent(true); // Show loading card
    const codeSent = await getCodeVerify();
    if (codeSent) {
      setVerificationSent(false); // Hide loading card
      setShowVerification(true);  // Show verification code input
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await handleLogin();
    if (success) {
      window.location.reload()
    }
  };

  const handleVerificationCodeChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      if (value !== '' && index < 5) {
        const nextInput = document.querySelector(
          `input[name=verification-${index + 1}]`
        ) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationLoading(true);
    const code = verificationCode.join('');

    try {
      const success = await verify(code);
      if (success) {
        const success = await handleLogin();
        if (success) {
          window.location.reload();
        }
      }
    } catch (err) {
      setVerificationError('Invalid verification code. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleResendCode = async () => {
    const success = await resendVerification();
    if (success) {
      setVerificationError('');
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

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white px-6 py-10 rounded-xl shadow-xl w-80 text-center">
          <h2 className="text-2xl text-black font-semibold mb-4">Sending Verification Code</h2>
          <p className="text-gray-600 text-sm sm:text-base">
            We have sent you a code, please check your email.
          </p>
          <span className="loading loading-spinner loading-lg mt-4"></span>
        </div>
      </div>
    );
  }

  if (showVerification) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white px-6 py-10 rounded-xl shadow-xl w-80">
          <h2 className="text-2xl text-black font-semibold mb-4 text-center">Verify Email</h2>
          <p className="text-gray-600 text-center mb-6">
            Please enter the verification code sent to your email
          </p>
          <form onSubmit={handleVerificationSubmit}>
            <div className="flex justify-between mb-6">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  name={`verification-${index}`}
                  value={digit}
                  onChange={(e) => handleVerificationCodeChange(index, e.target.value)}
                  className="w-10 h-12 text-center bg-slate-300 border rounded-lg text-black text-lg font-semibold focus:outline-none focus:border-indigo-500"
                  maxLength={1}
                  required
                />
              ))}
            </div>
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-700 transition duration-200"
              disabled={verificationLoading}
            >
              {verificationLoading ? 'Verifying...' : 'Verify'}
            </button>
          </form>
          {verificationError && (
            <p className="text-red-700 mt-2 text-center">{verificationError}</p>
          )}
          <div className="text-center mt-4">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              <button
                onClick={handleResendCode}
                className="text-indigo-500 hover:underline"
                disabled={loading}
              >
                Resend
              </button>
            </p>
          </div>
        </div>
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
        {error && (
          <div className="text-red-700 mt-2 text-center">
            <p>
              {error}
              {error === "You need verify" && (
                <button
                  onClick={handleVerification}
                  className="ml-2 text-blue-500 underline"
                >
                  Verify
                </button>
              )}
            </p>
          </div>
        )}
        <div className="text-center mt-4">
          <Link to="/ForgotPassword" className="text-indigo-500 hover:underline">Forgot Your Password?</Link>
          <p className="text-gray-600 mt-2">
            Can't Log in?{' '}
            <Link to="/signup" className="text-indigo-500 hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signin;
