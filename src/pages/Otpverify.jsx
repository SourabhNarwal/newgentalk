import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Otpverify = ({server}) => {
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const [timer, setTimer] = useState(120); // 2 minutes timer
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || ''; // Email passed from the previous page
  
    // Start countdown timer
    useEffect(() => {
      if (timer > 0) {
        const interval = setInterval(() => {
          setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
      } else {
        setIsResendDisabled(false); // Enable the resend button after timer ends
      }
    }, [timer]);
  
    const handleVerifyOtp = async (e) => {
      e.preventDefault();
      setError('');
      setInfo('');
  
      if (!/^\d{6}$/.test(otp)) {
        setError('OTP must be a 6-digit number.');
        return;
      }
  
      try {
        const response = await axios.post(`${server}/verify-otp`, {
          email,otp,},{ withCredentials: true }
        );
  
        if (response.status === 200) {
          setInfo('OTP verified successfully! Redirecting to chatroom...');
          setTimeout(() => {
            navigate('/chatroom');
          }, 2000);
        }
      } catch (err) {
        if (err.response?.status === 400 && err.response.data.message === 'Invalid OTP') {
          setError('The OTP entered is incorrect. Please try again.');
        } else {
          setError('An unexpected error occurred. Please try again later.');
        }
      }
    };
  
    const handleResendOtp = async () => {
      setError('');
      setInfo('');
      setIsResendDisabled(true);
      setTimer(120); // Reset the timer
  
      try {
        const response = await axios.post(`${server}/resend-otp`, { email });
        if (response.status === 200) {
          setInfo('OTP has been resent successfully. Please check your email.');
        }
      } catch (err) {
        setError('Failed to resend OTP. Please try again later.');
      }
    };
  
    return (
      <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
        {/* Background Text */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="text-8xl font-extrabold text-indigo-300 opacity-10 rotate-45">
            newGentalk newGentalk newGentalk newGentalk
          </div>
        </div>
  
        {/* OTP Verification Card */}
        <div className="relative w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded shadow-lg backdrop-blur-md">
          <h2 className="text-3xl font-bold text-center text-indigo-700">
            OTP Verification
          </h2>
          <p className="text-center text-sm text-gray-600">
            Enter the 6-digit OTP sent to your email: <span className="font-bold">{email}</span>
          </p>
  
          {/* Error Message */}
          {error && (
            <p className="text-center text-sm text-red-600">{error}</p>
          )}
  
          {/* Info Message */}
          {info && (
            <p className="text-center text-sm text-green-600">{info}</p>
          )}
  
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* OTP Field */}
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-indigo-300"
                placeholder="6-digit OTP"
                required
              />
            </div>
  
            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-500 rounded hover:from-purple-500 hover:to-indigo-600 focus:outline-none focus:ring focus:ring-indigo-300"
            >
              Verify OTP
            </button>
          </form>
  
          {/* Resend OTP */}
          <div className="text-center">
            {isResendDisabled ? (
              <p className="text-sm text-gray-600">
                Resend OTP in <span className="font-bold">{Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</span>
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-sm font-bold text-indigo-600 hover:underline"
              >
                Resend OTP
              </button>
            )}
          </div>
          <div className="text-center">
        <p className="text-sm text-gray-600">
          Go to {" "}
          <Link to="/" className="font-bold text-blue-600 hover:underline">
          Home Page
          </Link>
        </p>
      </div>
        </div>
      </div>
    );
}

export default Otpverify;