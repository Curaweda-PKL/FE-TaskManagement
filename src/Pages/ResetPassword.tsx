import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Eye, EyeClosed } from 'phosphor-react';
import useAuth from '../hooks/fetchAuth';

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [tokenStatus, setTokenStatus] = useState<'valid' | 'expired' | 'invalid' | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: any } | null>(null);

  const { forgotTokenVerify, forgotChangePassword } = useAuth(() => { }, () => { });

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  useEffect(() => {
    console.log('Verifying token:', token);

    const verifyToken = async () => {
      if (!token) {
        navigate('/forgot-password');
        return;
      }
      try {
        setLoading(true);
        const response = await forgotTokenVerify(token);
        console.log('Token verification response:', response);
        if (response.status === 200) {
          setTokenStatus('valid');
        } else if (response.status === 400 || response.status === 401) {
          setTokenStatus('expired');
        } else {
          setTokenStatus('invalid');
        }
      } catch (err) {
        console.error('Token verification error:', err);
        setTokenStatus('invalid');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, navigate]);

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);

    if (password.length < minLength) {
      return 'Password harus minimal 8 karakter';
    }
    if (!hasUpperCase) {
      return 'Password harus mengandung setidaknya satu huruf besar.';
    }
    if (!hasNumber) {
      return 'Password harus mengandung setidaknya satu angka.';
    }
    return '';
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setPasswordMismatch(e.target.value !== password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setPasswordMismatch(true);
      return;
    }
    setLoading(true);
    setError('');

    try {
      if (!token) {
        throw new Error('Token is missing');
      }
      const success = await forgotChangePassword(token, password);
      if (success) {
        setAlert({ type: 'success', message: 'Password berhasil diubah!' });
        setTimeout(() => {
          navigate('/signin');
        }, 2000);
      } else {
        setError('Gagal mengatur ulang password. Silakan coba lagi.');
      }
    } catch (err) {
      setError('Gagal mengatur ulang password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-xl font-semibold">Memeriksa token...</p>
        </div>
      </div>
    );
  }

  if (tokenStatus === 'expired' || tokenStatus === 'invalid') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-80 max-w-md text-center">
          <h2 className="text-2xl sm:text-3xl text-black font-semibold mb-4">
            {tokenStatus === 'expired' ? 'Token Expired' : 'Invalid Token'}
          </h2>
          <p className="mb-6 text-sm sm:text-base">
            {tokenStatus === 'expired'
              ? 'Link reset password Anda sudah expired. Silakan request link baru.'
              : 'Link reset password Anda tidak valid. Silakan request link baru.'}
          </p>
          <button
            onClick={() => navigate('/forgot-password')}
            className="w-full bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-700 transition duration-200 text-sm sm:text-base"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  if (tokenStatus === 'valid') {
    return (
      <div>
        {alert && (
          <div className={`fixed top-16 z-20 right-5 p-4 rounded-md ${alert.type === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {alert.message}
          </div>
        )}

        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-80 max-w-md">
            <h2 className="text-2xl sm:text-3xl text-black font-semibold mb-2 text-center">RESET PASSWORD</h2>
            <p className="text-center mb-6 text-sm sm:text-base">Masukkan password baru di bawah ini untuk mengubah password Anda</p>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password Baru"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-300 px-4 py-2 text-black border rounded-xl focus:outline-none focus:border-indigo-500 pr-10 text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">Minimal 8 karakter.</p>
                {error && <p className="text-xs sm:text-sm text-red-500 mt-2">{error}</p>}
              </div>
              <div className="mb-6">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Konfirmasi Password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full bg-slate-300 px-4 py-2 text-black border rounded-xl focus:outline-none focus:border-indigo-500 pr-10 text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordMismatch && <p className="text-xs sm:text-sm text-red-500 mt-2">Password tidak cocok</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 rounded-xl hover:bg-purple-700 transition duration-200 text-sm sm:text-base"
              >
                {loading ? 'Mengubah password...' : 'Ubah Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default ResetPassword;
