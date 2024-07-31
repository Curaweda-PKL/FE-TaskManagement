import React from 'react';
import { Link } from 'react-router-dom';

function Signup() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white px-6 py-10 rounded-xl shadow-xl w-80">
        <h2 className="text-2xl text-black font-semibold mb-4 text-center mb-8">SIGN UP</h2>
        <form>
          <div className="mb-2">
            <input type="text" placeholder="Username" className="w-full bg-slate-300 px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-500"/>
          </div>
          <div className="mb-2">
            <input type="password" placeholder="Password" className="w-full bg-slate-300 px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-500"/>
          </div>
          <div className="mb-6 relative">
            <input type="text" placeholder="Confirm Password" className="w-full bg-slate-300 px-4 py-2 border rounded-full focus:outline-none focus:border-indigo-500"/>
          </div>
          <button className="w-full bg-purple-500 text-white py-2 rounded-full hover:bg-purple-700 transition duration-200">
            Create an Account
          </button>
        </form>
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
