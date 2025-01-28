import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';

const NewPassword = ({server}) => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState("");
    const [info, setInfo] = useState(""); // For success messages
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setInfo("");  // Clear previous informational messages

        try {
            // Send forgot password data to the server
            const response = await axios.post(`${server}/forgot-password`, {
                email,
                password: newPassword,
            });
            
            // If submission is successful, navigate to the verification page
            if (response.status === 200) {
               
                setInfo("A verification email has been sent. Please check your inbox.");
                setTimeout(() => {
                    navigate('/newgentalk/verification', { state: { email } });
                }, 3000);
            }
        } catch (err) {
            // Handle server errors
            if (err.response?.status === 404) {
                if (err.response.data.message === "User not found") {
                    setError("User not found. Please check your email or sign up for an account.");
                } else {
                    setError("An error occurred. Please try again.");
                }
            } else {
                setError("An unexpected error occurred. Please try again later.");
            }
        }
    };

    return (
        <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-500 to-blue-600">
            {/* Background Text */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="text-8xl font-extrabold text-blue-300 opacity-10 rotate-45">
                    newGentalk newGentalk newGentalk newGentalk newGentalk
                </div>
            </div>

            {/* Forgot Password Card */}
            <div className="relative w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded shadow-lg backdrop-blur-md">
                <h2 className="text-3xl font-bold text-center text-teal-700">
                    Forgot Password
                </h2>
                <p className="text-center text-sm text-gray-600">
                    Enter your email and new password to reset your password.
                </p>

                {/* Error Message */}
                {error && (
                    <p className="text-center text-sm text-red-600">
                        {error}
                    </p>
                )}

                {/* Info Message */}
                {info && (
                    <p className="text-center text-sm text-green-600">
                        {info}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Field */}
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-teal-300"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* New Password Field */}
                    <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            name="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-teal-300"
                            placeholder="Enter your new password"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-teal-600 to-blue-500 rounded hover:from-blue-500 hover:to-teal-600 focus:outline-none focus:ring focus:ring-teal-300"
                    >
                        Submit
                    </button>
                </form>
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Go to {" "}
                        <Link to="/newgentalk/" className="font-bold text-blue-600 hover:underline">
                            Home Page
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default NewPassword