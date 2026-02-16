import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import axios from 'axios';

const LoginPage = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const validate = () => {
        const newErrors = {};
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsSubmitting(true);
        try {
            await login(formData.email, formData.password);
            toast.success("Welcome back!", { duration: 2000 });
            navigate('/upload');
        } catch (error) {
            if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                toast.error('Invalid email or password');
            } else {
                toast.error(error.message || 'Login failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsSubmitting(true);
        try {
            const provider = new GoogleAuthProvider();
            provider.addScope('profile');
            provider.addScope('email');
            await signInWithPopup(auth, provider);
            
            toast.success('Welcome!', { duration: 2000 });
            navigate('/upload');
        } catch (error) {
            if (error.code === 'auth/popup-closed-by-user') {
                toast.error('Google sign-in cancelled');
            } else {
                toast.error(error.message || 'Google login failed');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden bg-[#020617]">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
            </div>

            <div className="max-w-md w-full z-10">
                <div className="mb-6">
                    <Link
                        to="/"
                        className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold transition-all group cursor-pointer"
                    >
                        <FaArrowLeft className="mr-2 transform group-hover:-translate-x-1 transition-transform" />
                        Return to Nexus
                    </Link>
                </div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                        <p className="text-gray-400">Sign in to your account</p>
                    </div>

                    <form onSubmit={handleEmailLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="name@college.edu"
                                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500/50' : 'focus:ring-blue-500/50'} transition-all`}
                            />
                            {errors.email && <p className="mt-1.5 text-xs font-bold text-red-500 animate-pulse">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Enter your password"
                                    className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500/50' : 'focus:ring-blue-500/50'} transition-all pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-2">
                                <Link to="/forgot-password" size="sm" className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer font-medium">
                                    Forgot Password?
                                </Link>
                            </div>
                            {errors.password && <p className="mt-1.5 text-xs font-bold text-red-500 animate-pulse">{errors.password}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                        >
                            {isSubmitting ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="my-6 flex items-center gap-2">
                        <div className="flex-1 h-px bg-white/10"></div>
                        <span className="text-xs text-gray-400">OR</span>
                        <div className="flex-1 h-px bg-white/10"></div>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        {isSubmitting ? 'Signing in...' : 'Continue with Google'}
                    </button>

                    <div className="mt-8 text-center text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors cursor-pointer">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
