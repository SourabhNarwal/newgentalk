import React from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {/* Background Text */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="text-8xl font-extrabold text-purple-300 opacity-10 rotate-45">
          newGentalk newGentalk newGentalk newGentalk
        </div>
      </div>

      {/* Home Card */}
      <div className="relative w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded shadow-lg backdrop-blur-md text-center">
        <h1 className="text-4xl font-extrabold text-purple-700">
          Welcome to newGentalk!
        </h1>
        <p className="text-sm text-gray-600">
          Join the platform for real democratic conversations!!!
        </p>

        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/newgentalk/login')}
            className="w-full px-4 py-2 text-lg font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded hover:from-purple-600 hover:to-blue-500 focus:outline-none focus:ring focus:ring-purple-300"
          >
            Login
          </button>
          <button
            onClick={() => navigate('/newgentalk/signup')}
            className="w-full px-4 py-2 text-lg font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded hover:from-blue-500 hover:to-purple-600 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home