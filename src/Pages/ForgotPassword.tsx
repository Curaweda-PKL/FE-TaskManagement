import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      alert('Email instruksi reset password telah dikirim.');
      navigate('/resetpassword');
    } catch (err) {
      setError('Gagal mengirim email. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="bg-white px-6 py-8 sm:py-10 rounded-xl shadow-xl w-80">
        <h2 className="text-xl sm:text-2xl text-black font-semibold mb-3 sm:mb-4 text-center">FORGOT PASSWORD</h2>
        <div className="text-center mt-3 sm:mt-4">
          <p className="text-gray-600 text-sm sm:text-base">We'll send an email with instructions to reset your password.</p>
        </div>
        {error && <p className="text-red-500 text-center mt-2 text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 sm:mt-6">
          <div className="mb-4">
            <p className="text-gray-600 mb-2 text-sm sm:text-base"></p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-300 px-4 py-2 text-black border rounded-full focus:outline-none focus:border-indigo-500 text-sm sm:text-base"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-700 transition duration-200 text-sm sm:text-base"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Email'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;