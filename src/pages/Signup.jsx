import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [gender, setGender] = useState("");
  //const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("Email:", email);
    console.log("Password:", password);
    navigate('/signup/verification');
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-400 to-blue-500">
        {/* Background Text */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="pl-5 text-8xl font-extrabold text-gray-500 opacity-50 rotate-0">
        newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk newGentalk
      </div>
    </div>
      <div className="w-full max-w-lg p-8 space-y-4 bg-white bg-opacity-90 rounded shadow-lg backdrop-blur-md">
        <h2 className="text-3xl font-bold text-center text-blue-700">
          Create an Account
        </h2>
        <h4 className="text-xl font-bold text-center text-yellow-500" >Only for college students</h4>
        <p className="text-center text-sm text-gray-600">
          <span className='font-bold '>create to join Real Democratic Conversations...</span>
       </p>
        {success && (
          <p className="text-sm text-green-600 text-center">{success}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address <span className='text-sm text-gray-600 font-bold text-red-500'>
                (*Only student college email is valid)</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded 
              focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select id="gender" name="gender" value={gender} onChange={(e) => setGender(e.target.value)}
              className="w-full px-4 py-2 mt-2 bg-gray-100 border border-gray-300 rounded focus:outline-none 
              focus:ring focus:ring-blue-300"
              required
            >
              <option value="" disabled> Select your gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input type="password" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded 
              focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirm-password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Re-enter your password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-blue-600 to-green-500 rounded hover:from-green-500 hover:to-blue-600 focus:outline-none focus:ring focus:ring-green-300"
          >
            Sign Up
          </button>
        </form>
        <div className="text-center">
        <p className="text-sm text-gray-600">
          Do you have an account?{" "}
         
          <Link to="/" className="font-bold text-blue-600 hover:underline">
          Login
          </Link>
        </p>
      </div>
      </div>
    </div>
  )
}

export default Signup;