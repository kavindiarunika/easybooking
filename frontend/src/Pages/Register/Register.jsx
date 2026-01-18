import React from "react";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../App.jsx";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import { FaHotel, FaEnvelope, FaPhone, FaLock, FaBuilding, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { assets } from "../../assets/Assest";

const Register = () => {
  const navigate = useNavigate();
  const [signIn, setsignIn] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [formData, setformData] = useState({
    email: "",
    phone: "",
    packageName: "",
    hotelName: "",
    hotelType: "",
    vehicleType: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setformData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/registervendor`,
        formData
      );

      if (response.data.success && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("vendorToken", token);
        
        // Determine category and redirect accordingly
        const selectedCategory = formData.hotelName;
        const isGoTrip = ["car", "van", "safari-jeep", "tuktuk"].includes(selectedCategory);
        
        if (isGoTrip) {
          localStorage.setItem("vendorCategory", "gotrip");
          toast.success("Registration successful. Redirecting to GoTrip Dashboard...");
          navigate("/vendor/dashboard-gotrip", {
            state: { openCreate: true },
          });
        } else {
          localStorage.setItem("vendorCategory", "stays");
          toast.success("Registration successful. Redirecting to Stays Dashboard...");
          navigate("/vendor/dashboard-stays", {
            state: { openCreate: true },
          });
        }
      } else if (response.data.success) {
        toast.success(
          "Vendor registered successfully. OTP sent to your email."
        );
        setOtpSent(true);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error in vendor registration"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleverifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/api/vendor/sendotp`, {
        email: formData.email,
        otp,
      });
      if (response.data.success) {
        toast.success("OTP verified successfully. You can now login.");
        setOtpSent(false);
        setsignIn(true);
        setOtp("");
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error verifying OTP");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/login`,
        loginData
      );

      if (response.data.success && response.data.token) {
        const { token, category } = response.data;

        localStorage.setItem("vendorToken", token);
        
        // Determine dashboard based on category
        const isGoTrip = ["car", "van", "safari-jeep", "tuktuk"].includes(category);
        
        if (isGoTrip) {
          localStorage.setItem("vendorCategory", "gotrip");
          toast.success("Login successful");
          navigate("/vendor/dashboard-gotrip");
        } else {
          localStorage.setItem("vendorCategory", "stays");
          toast.success("Login successful");
          navigate("/vendor/dashboard-stays");
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login error");
    }
  };

  // Forgot Password - Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/forgot-password`,
        { email: forgotEmail }
      );
      if (response.data.success) {
        toast.success("OTP sent to your email");
        setForgotOtpSent(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/reset-password`,
        {
          email: forgotEmail,
          otp: forgotOtp,
          newPassword,
        }
      );
      if (response.data.success) {
        toast.success("Password reset successful. Please login.");
        setShowForgotPassword(false);
        setForgotOtpSent(false);
        setForgotEmail("");
        setForgotOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setsignIn(true);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setForgotLoading(false);
    }
  };

  const hotelTypes = [
    { value: "hotel", label: "Hotel", icon: "🏨" },
    { value: "resort", label: "Resort", icon: "🏝️" },
    { value: "villa", label: "Villa", icon: "🏡" },
    { value: "homestay", label: "Homestay", icon: "🏠" },
    { value: "guesthouse", label: "Guest House", icon: "🏘️" },
    { value: "apartment", label: "Apartment", icon: "🏢" },
  ];

  const vehicleTypes = [
    { value: "car", label: "Car", icon: "🚗" },
    { value: "van", label: "Van", icon: "🚐" },
    { value: "ac-bus", label: "A/C Bus", icon: "🚌" },
    { value: "tuk-tuk", label: "Tuk Tuk", icon: "🛺" },
    { value: "boat", label: "Boat", icon: "🚤" },
    { value: "safari-jeep", label: "Safari Jeep", icon: "🚙" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <FaArrowLeft />
        <span>Back to Home</span>
      </Link>

      <div className="relative w-full max-w-5xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="lg:w-5/12 bg-gradient-to-br from-blue-600 to-purple-700 p-8 lg:p-12 flex flex-col justify-center items-center text-white">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <img src={assets.logo} alt="SmartsBooking Logo" className="w-20 h-20 object-contain" />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  SmartsBooking
                </h1>
                <p className="text-white/80 text-lg mb-8">
                  Partner with us and grow your hospitality business
                </p>
                
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">✓</span>
                    </div>
                    <span>Increase your bookings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">✓</span>
                    </div>
                    <span>Easy management dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg">✓</span>
                    </div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Forms */}
            <div className="lg:w-7/12 p-8 lg:p-12">
              {signIn ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-white/60">Sign in to your vendor account</p>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-white/30 bg-white/10" />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </button>

                  {/* Switch to Register */}
                  <p className="text-center text-white/60">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setsignIn(false)}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      Create Account
                    </button>
                  </p>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
                    <p className="text-white/60">Join as a vendor partner</p>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Stay or Vehicle Package Name */}
                  <div className="relative">
                    <FaHotel className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      name="packageName"
                      placeholder="Stay or Vehicle Package Name"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.packageName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="relative">
                    <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <select
                      name="hotelName"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all appearance-none cursor-pointer"
                      value={formData.hotelName}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className="bg-slate-800 text-white">Select Category</option>
                      <optgroup label="Stays" className="bg-slate-800 text-white">
                        <option value="restaurant" className="bg-slate-800 text-white">Restaurant</option>
                        <option value="villas" className="bg-slate-800 text-white">Villas</option>
                        <option value="houses" className="bg-slate-800 text-white">Houses</option>
                        <option value="hotels" className="bg-slate-800 text-white">Hotels</option>
                      </optgroup>
                      <optgroup label="GoTrip" className="bg-slate-800 text-white">
                        <option value="car" className="bg-slate-800 text-white">Car</option>
                        <option value="van" className="bg-slate-800 text-white">Van</option>
                        <option value="safari-jeep" className="bg-slate-800 text-white">Safari Jeep</option>
                        <option value="tuktuk" className="bg-slate-800 text-white">Tuk Tuk</option>
                      </optgroup>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                      ▼
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* OTP Section */}
                  {otpSent && (
                    <div className="space-y-4 pt-4 border-t border-white/20">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all text-center text-lg tracking-widest"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleverifyOtp}
                        className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-xl hover:bg-indigo-600 transition-all"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}

                  {/* Switch to Login */}
                  <p className="text-center text-white/60">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setsignIn(true)}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {forgotOtpSent ? "Reset Password" : "Forgot Password"}
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotOtpSent(false);
                  setForgotEmail("");
                  setForgotOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-white/50 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            {!forgotOtpSent ? (
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <p className="text-white/60 text-sm">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-blue-500 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-white/60 text-sm">
                  Enter the OTP sent to your email and set your new password.
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all text-center tracking-widest"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  required
                />
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-green-500 text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
