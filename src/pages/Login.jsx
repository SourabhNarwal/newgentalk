import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate=useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    navigate('/chatroom');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
    {/* Background Text */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="text-8xl font-extrabold text-blue-300 opacity-10 rotate-45">
        newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk
      </div>
    </div>

    {/* Login Card */}
    <div className="relative w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded shadow-lg backdrop-blur-md">
      <h2 className="text-3xl font-bold text-center text-purple-700">
        Welcome to newGentalk!!!
      </h2>
      <h4 className="text-xl font-bold text-center text-yellow-500" >Only for college students</h4>
      <p className="text-center text-sm text-gray-600">
        Login to join <span className='font-bold '>Real Democratic Conversations...</span>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-300"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-300"
            placeholder="Enter your password"
            required
          />
          <Link to="/signup" className="font-bold text-blue-600 hover:underline">
          forgot password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-600 to-blue-500 rounded hover:from-blue-500 hover:to-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
        >
          Login
        </button>
      </form>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
         
          <Link to="/signup" className="font-bold text-blue-600 hover:underline">
          Sign up
          </Link>
        </p>
      </div>
    </div>
  </div>
  )
}

export default Login;