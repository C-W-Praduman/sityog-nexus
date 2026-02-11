import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChevronLeft, FaEye, FaEyeSlash } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [stage, setStage] = useState('email'); // 'email' or 'reset'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { forgotPassword, resetPassword } = useAuth();
    const navigate = useNavigate();
    const otpRefs = useRef([]);

    useEffect(() => {
        if (stage === 'reset' && otpRefs.current[0]) {
            otpRefs.current[0].focus();
        }
    }, [stage]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        setIsSubmitting(true);
        try {
            await forgotPassword(email);
            toast.success("Reset code sent to your email!");
            setStage('reset');
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to send reset code");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOtpChange = (index, value) => {
        const digit = value.length > 1 ? value.substring(value.length - 1) : value;
        if (!/^\d*$/.test(digit)) return;

        const newOtp = [...otp];
        newOtp[index] = digit;
        setOtp(newOtp);

        if (digit && index < 5) otpRefs.current[index + 1].focus();
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1].focus();
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        const fullOtp = otp.join('');
        if (fullOtp.length < 6) return toast.error("Enter full code");
        if (newPassword !== confirmPassword) return toast.error("Passwords mismatch");
        if (newPassword.length < 8) return toast.error("Password too short");

        setIsSubmitting(true);
        try {
            await resetPassword(email, fullOtp, newPassword);
            toast.success("Password reset successfully! Login now.");
            navigate('/login');
        } catch (error) {
            toast.error(error.response?.data?.error || "Reset failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden bg-[#020617]">
            <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full z-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <Link to="/login" className="mb-6 flex items-center text-sm text-gray-400 hover:text-white transition-colors">
                        <FaChevronLeft className="mr-2" size={12} /> Back to Login
                    </Link>

                    {stage === 'email' ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                                <p className="text-gray-400">Enter your email and we'll send you a reset code.</p>
                            </div>
                            <form onSubmit={handleEmailSubmit} className="space-y-4">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Reset Code'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-white mb-2">Create New Password</h1>
                                <p className="text-gray-400">Enter the code sent to your email.</p>
                            </div>
                            <form onSubmit={handleResetSubmit} className="space-y-6">
                                <div className="flex justify-between gap-2 sm:gap-3">
                                    {otp.map((data, index) => (
                                        <input
                                            key={index}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            ref={(el) => (otpRefs.current[index] = el)}
                                            value={data}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleOtpKeyDown(index, e)}
                                            className="h-14 w-14 sm:h-16 sm:w-16 text-center text-xl sm:text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:border-blue-500/50"
                                        />
                                    ))}
                                </div>
                                <div className="space-y-4">
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="New Password"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                        />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm New Password"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all"
                                >
                                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
