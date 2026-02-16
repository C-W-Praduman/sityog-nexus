import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { signInWithPopup, GoogleAuthProvider, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import toast from 'react-hot-toast';
import API_BASE_URL from '../config/api';
import axios from 'axios';

const RegisterPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
    if (formData.password.length < 8) newErrors.password = 'Password must be 8+ characters';
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Must include uppercase, lowercase, number, special character';
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: '' });
  };

  const handleEmailRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await register(formData.email, formData.password);
      toast.success('Account created!', { duration: 2000 });
      navigate('/upload');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already registered');
      } else {
        toast.error(error.message || 'Registration failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = async () => {
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
        toast.error('Google sign-up cancelled');
      } else {
        toast.error(error.message || 'Google sign-up failed');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 bg-[#020617]">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 font-bold cursor-pointer">
            <FaArrowLeft className="mr-2" /> Return to Nexus
          </Link>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Create Account</h1>
          <p className="text-gray-400 text-center mb-8">Join the learning community</p>

          <form onSubmit={handleEmailRegister} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange}
                className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white pr-12`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-300 mb-1">Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                className={`w-full bg-white/5 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white`}
              />
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl disabled:opacity-50 mt-6 cursor-pointer"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10"></div>
            <span className="text-xs text-gray-400">OR</span>
            <div className="flex-1 h-px bg-white/10"></div>
          </div>

          <button onClick={handleGoogleRegister} disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {isSubmitting ? 'Signing up...' : 'Sign up with Google'}
          </button>

          <p className="text-center text-gray-400 mt-8">
            Already have an account? <Link to="/login" className="text-blue-400 hover:text-blue-300 cursor-pointer">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
