import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeClosed } from 'phosphor-react';

function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password) => {
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

  const handleConfirmPasswordChange = (e) => {
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
      alert('Password berhasil diubah.');
      navigate('/signin');
    } catch (err) {
      setError('Gagal mengatur ulang password. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-80 max-w-md">
        <h2 className="text-2xl sm:text-3xl text-black font-semibold mb-2 text-center">RESET PASSWORD</h2>
        <p className='text-center mb-6 text-sm sm:text-base'>Enter a new password below to change your password</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-gray-600 mb-2 text-sm sm:text-base"></p>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
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
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              Minimal 8 karakter.        
            </p>
            {error && <p className="text-xs sm:text-sm text-red-500 mt-2">{error}</p>}
          </div>
          <div className="mb-6">
            <p className="text-gray-600 mb-2 text-sm sm:text-base">Confirm Password</p>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
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
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;