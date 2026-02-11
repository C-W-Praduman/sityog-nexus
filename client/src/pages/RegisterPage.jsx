import React, { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaEye, FaEyeSlash, FaChevronLeft } from "react-icons/fa";
import toast from "react-hot-toast";

/**
 * RegisterPage Component
 * Handles user registration (Step 1) and OTP verification (Step 2)
 */
const RegisterPage = () => {
  // Stage: 'register' or 'otp'
  const [stage, setStage] = useState("register");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  const { register, verifyOTP } = useAuth();
  const navigate = useNavigate();

  // Refs for OTP inputs to handle auto-focus
  const otpRefs = useRef([]);

  // Auto-focus first input on stage change
  useEffect(() => {
    if (stage === "otp") {
      // Reset timer when entering OTP stage
      setTimeLeft(600);

      // Auto-focus logic
      const timer = setTimeout(() => {
        if (otpRefs.current[0]) {
          otpRefs.current[0].focus();
        }
      }, 100);

      // Start countdown interval
      const interval = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [stage]);

  // Format time (seconds to MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Validation for Step 1
  const validate = () => {
    const newErrors = {};
    if (!formData.name || formData.name.trim().length < 2) {
      newErrors.name = "Full name is required";
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        formData.password,
      )
    ) {
      newErrors.password =
        "Password must be at least 8 characters with upper, lower, digit, and special char";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  // --- STEP 1: Submit Registration Info ---
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(
        formData.name,
        formData.email,
        formData.password,
      );
      toast.success("Verification code sent to your email!");
      setStage("otp");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("Account already exists. Please login.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.error || "Registration failed");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- STEP 2: Handle OTP Input Logic ---
  const handleOtpChange = (index, value) => {
    // Keep only last digit if multiple entered55
    const digit = value.length > 1 ? value.substring(value.length - 1) : value;

    if (!/^\d*$/.test(digit)) return; // Allow only numbers

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto move to next input if digit entered
    if (digit && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace to move to previous
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyOTP(formData.email, fullOtp);
      toast.success("Registration complete! Welcome to Nexus.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.error || "Verification failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden bg-[#020617]">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full z-10">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {stage === "register" ? (
            /* --- STAGE 1: ACCOUNT DETAILS --- */
            <>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Create Account
                </h1>
                <p className="text-gray-400">
                  Join the Nexus learning community
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Full Name"
                    className={`w-full bg-white/5 border ${errors.name ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>
                  )}
                </div>
                <div>
                  
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className={`w-full bg-white/5 border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="e.g. Password@123"
                      className={`w-full bg-white/5 border ${errors.password ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.password}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={`w-full bg-white/5 border ${errors.confirmPassword ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? (
                        <FaEyeSlash size={18} />
                      ) : (
                        <FaEye size={18} />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-500">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 mt-4"
                >
                  {isSubmitting ? "Sending Code..." : "Create Account"}
                </button>
              </form>
            </>
          ) : (
            /* --- STAGE 2: OTP VERIFICATION --- */
            <>
              <button
                onClick={() => setStage("register")}
                className="mb-6 flex items-center text-sm text-gray-400 hover:text-white transition-colors"
              >
                <FaChevronLeft className="mr-2" size={12} /> Back to details
              </button>

              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Verify Email
                </h1>
                <p className="text-gray-400 px-4">
                  Enter the 6-digit code sent to{" "}
                  <span className="text-blue-400 font-medium">
                    {formData.email}
                  </span>
                </p>

                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20">
                  <span
                    className={`text-xs font-bold ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-blue-400"}`}
                  >
                    Code expires in: {formatTime(timeLeft)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleVerifySubmit} className="space-y-8">
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
                      disabled={timeLeft === 0}
                      className="h-14 w-14 sm:h-16 sm:w-16 text-center text-xl sm:text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all focus:border-blue-500/50 disabled:opacity-30"
                    />
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || timeLeft === 0}
                  className="w-full bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                >
                  {timeLeft === 0
                    ? "Code Expired"
                    : isSubmitting
                      ? "Verifying..."
                      : "Verify & Complete"}
                </button>

                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Didn't receive code?{" "}
                    <button
                      type="button"
                      onClick={handleRegisterSubmit}
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </form>
            </>
          )}

          <div className="mt-8 text-center text-gray-400">
            {stage === "register" && (
              <>
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
