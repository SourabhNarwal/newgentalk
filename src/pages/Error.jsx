import React from 'react'
import { Link } from 'react-router-dom'

const Error = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-300">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8">Sorry, the page you are looking for does not exist.</p>
      <Link to="/">
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
          Go to Home
        </button>
      </Link>
    </div>
  </div>
  )
}

export default Error