import React, { useEffect, useState } from 'react'

const Otpverify = () => {
    const [otp, setOtp] = useState("");
    //const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [timer, setTimer] = useState(120); // Timer in seconds (2 minutes)
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval); // Cleanup interval on unmount
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleResendOtp = () => {
        if (canResend) {
            console.log("Resending OTP...");
            // API call to resend OTP can go here
            setTimer(120); // Reset timer to 2 minutes
            setCanResend(false);
            setSuccess("OTP has been resent!");
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate OTP length (assuming 6-digit OTP)
        //   if (otp.length !== 6) {
        //     setError("OTP must be 6 digits.");
        //     setSuccess("");
        //     return;
        //   }

        // Clear error and show success message
        //setError("");
        setSuccess("OTP Verified Successfully!");
        console.log("Verified OTP:", otp);

        // Add redirection logic or API call here after OTP verification
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-pink-400 to-purple-500">
            <div className="absolute inset-0 overflow-hidden">
                <div className="text-8xl font-extrabold text-blue-300 opacity-30 rotate-0">
                    newGentalk ..................
                </div>
            </div>
            <div className="w-full max-w-md p-8 space-y-6 bg-white bg-opacity-90 rounded shadow-lg backdrop-blur-md">
                <h2 className="text-3xl font-bold text-center text-purple-700">
                    OTP Verification
                </h2>
                <p className="text-sm text-center font-bold text-gray-600">
                    Enter the OTP sent to your registered college email.
                </p>

                {/* {error && <p className="text-sm text-red-600 text-center">{error}</p>} */}
                {success && (
                    <p className="text-sm text-green-600 text-center">{success}</p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* OTP Input */}
                    <div>
                        <label
                            htmlFor="otp"
                            className="block text-sm font-medium text-gray-700"
                        >
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            maxLength={6}
                            name="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 mt-2 text-gray-900 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-purple-300"
                            placeholder="Enter 6-digit OTP"
                            required
                        />
                    </div>

                    {/* Resend OTP Button */}
                    <div className="text-center">
                        <button
                            type="button"
                            onClick={handleResendOtp}
                            disabled={!canResend}
                            className={`px-4 py-2 font-bold text-white rounded focus:outline-none ${canResend
                                    ? "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-pink-500 hover:to-purple-600 focus:ring focus:ring-purple-300"
                                    : "bg-gray-300 cursor-not-allowed"
                                }`}
                        >
                            Resend OTP
                        </button>
                        {!canResend && (
                            <p className="mt-2 text-sm text-gray-600">
                                Resend available in {Math.floor(timer / 60)}:
                                {String(timer % 60).padStart(2, "0")}
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded hover:from-pink-500 hover:to-purple-600 focus:outline-none focus:ring focus:ring-purple-300"
                    >
                        Verify OTP
                    </button>
                </form>

            </div>
        </div>
    );
}

export default Otpverify;