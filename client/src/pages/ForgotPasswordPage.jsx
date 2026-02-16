import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChevronLeft, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");

        setIsSubmitting(true);
        try {
            await forgotPassword(email);
            toast.success("Reset link sent to your email!");
            setIsSent(true);
        } catch (error) {
            console.error("Forgot PW Error:", error);
            const errorMsg = error.message || "Failed to send reset code";
            toast.error(errorMsg);
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
                    <Link to="/login" className="mb-6 flex items-center text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <FaChevronLeft className="mr-2" size={12} /> Back to Login
                    </Link>

                    {!isSent ? (
                        <>
                            <div className="mb-8">
                                <h1 className="text-2xl font-bold text-white mb-2">Forgot Password?</h1>
                                <p className="text-gray-400">Enter your email and we'll send you a link to reset your password.</p>
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
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {isSubmitting ? 'Sending...' : (
                                        <>
                                            <FaPaperPlane size={14} /> Send Reset Link
                                        </>
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaPaperPlane className="text-blue-500" size={24} />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-4">Check Your Email</h1>
                            <p className="text-gray-400 mb-8">
                                We've sent a password reset link to <span className="text-white font-medium">{email}</span>. 
                                Please check your inbox and follow the instructions.
                            </p>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-xl transition-all cursor-pointer"
                            >
                                Return to Login
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
