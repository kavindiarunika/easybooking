import React from "react";
import { useState } from "react";
import { assets } from "../../assets/Assest";
import axios from "axios";
import { BACKEND_URL } from "../../App.jsx";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [signIn, setsignIn] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

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
    category: "",
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
        // Auto-verified flow: set token and navigate to respective vendor dashboard
        const { token, category } = response.data;
        localStorage.setItem("vendorToken", token);
        localStorage.setItem("vendorCategory", category);

        toast.success("Registration successful. Redirecting...");

        switch (category) {
          case "stays":
            navigate("/vendor/dashboard-stays", {
              state: { openCreate: true },
            });
            break;
          case "ontrip":
            navigate("/vendor/dashboard-ontrip", {
              state: { openCreate: true },
            });
            break;
          case "vehicle_rent":
            navigate("/vendor/dashboard-vehicles", {
              state: { openCreate: true },
            });
            break;
          default:
            navigate("/");
        }
      } else if (response.data.success) {
        // fallback (legacy OTP flow) — show OTP form
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

        // Store session info
        localStorage.setItem("vendorToken", token);
        localStorage.setItem("vendorCategory", category);

        toast.success("Login successful");

        // Use navigate based on the category stored in MongoDB
        switch (category) {
          case "stays":
            navigate("/vendor/dashboard-stays");
            break;
          case "ontrip":
            navigate("/vendor/dashboard-ontrip");
            break;
          case "vehicle_rent":
            navigate("/vendor/dashboard-vehicles");
            break;
          default:
            toast.error("Unknown vendor category");
            break;
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

  // Forgot Password - Reset Password
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
        { email: forgotEmail, otp: forgotOtp, newPassword }
      );
      if (response.data.success) {
        toast.success("Password reset successfully. You can now login.");
        setShowForgotPassword(false);
        setForgotOtpSent(false);
        setForgotEmail("");
        setForgotOtp("");
        setNewPassword("");
        setConfirmPassword("");
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

  return (
    <div>
      <div className="flex h-[700px] w-full">
        <div className="w-full hidden md:inline-block">
          <img className="h-full" src={assets.Hero} alt="leftSideImage" />
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          {signIn ? (
            <form
              onSubmit={handleLoginSubmit}
              className="md:w-96 w-80 flex flex-col items-center justify-center"
            >
              <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
              <p className="text-sm text-gray-500/90 mt-3 mb-4">
                Welcome back! Please sign in to continue
              </p>

              <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <svg
                  width="16"
                  height="11"
                  viewBox="0 0 16 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                    fill="#6B7280"
                  />
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="Email id"
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
                <svg
                  width="13"
                  height="17"
                  viewBox="0 0 13 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                    fill="#6B7280"
                  />
                </svg>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  required
                />
              </div>

              <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
                <div className="flex items-center gap-2">
                  <input className="h-5" type="checkbox" id="checkbox" />
                  <label className="text-sm" htmlFor="checkbox">
                    Remember me
                  </label>
                </div>
                <button
                  type="button"
                  className="text-sm underline hover:text-indigo-500"
                  onClick={() => setShowForgotPassword(true)}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="mt-8 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
              >
                Login
              </button>
              <p className="text-gray-500/90 text-sm mt-4">
                Don’t have an account?{" "}
                <a
                  className="text-indigo-400 hover:underline"
                  onClick={() => setsignIn(false)}
                >
                  Sign up
                </a>
              </p>
            </form>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="md:w-96 w-80 flex flex-col items-center justify-center"
            >
              <h2 className="text-4xl text-gray-900 font-medium">Sign up</h2>
              <p className="text-sm text-gray-500/90 mt-3 mb-4">
                Welcome To SmartsBooking!
              </p>

              {/* Email */}
              <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email id"
                  className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
                  required
                />
              </div>

              {/* Category Select */}
              <div className="mt-4 flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="bg-transparent text-gray-700 outline-none text-sm w-full h-full "
                  required
                >
                  <option value="" className="text-white">
                    Select type
                  </option>
                  <option value="stays">Stays</option>
                  <option value="ontrip">OnTrip</option>
                  <option value="vehicle_rent" className="hidden">
                    Vehicle Rent
                  </option>
                </select>
              </div>

              {/* Password */}
              <div className="mt-4 flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 gap-2">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="mt-8 w-full h-11 rounded-full text-white bg-green-500 hover:opacity-90 transition-opacity"
              >
                {loading ? "Sending OTP..." : "Register"}
              </button>
              {otpSent && (
                <>
                  <div className="flex items-center w-full border border-gray-300/60 h-12 rounded-full pl-6 mt-4">
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      className="bg-transparent text-gray-500/80 outline-none text-sm w-full h-full"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleverifyOtp}
                    className="mt-6 w-full h-11 rounded-full text-white bg-indigo-500 hover:opacity-90"
                  >
                    Verify OTP
                  </button>
                </>
              )}

              <p className="text-gray-500/90 text-sm mt-4">
                Do you have an account?{" "}
                <span
                  className="text-indigo-400 hover:underline cursor-pointer"
                  onClick={() => setsignIn(true)}
                >
                  Sign In
                </span>
              </p>
            </form>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
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
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {!forgotOtpSent ? (
              <form onSubmit={handleForgotSendOtp}>
                <p className="text-sm text-gray-500 mb-4">
                  Enter your email address and we'll send you an OTP to reset your password.
                </p>
                <div className="flex items-center w-full border border-gray-300 h-12 rounded-full pl-6 gap-2 mb-4">
                  <svg
                    width="16"
                    height="11"
                    viewBox="0 0 16 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                      fill="#6B7280"
                    />
                  </svg>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full pr-4"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full h-11 rounded-full text-white bg-indigo-500 hover:bg-indigo-600 transition disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail("");
                  }}
                  className="w-full mt-3 text-sm text-gray-500 hover:underline"
                >
                  Back to login
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <p className="text-sm text-gray-500 mb-4">
                  Enter the OTP sent to your email and set your new password.
                </p>
                <div className="flex items-center w-full border border-gray-300 h-12 rounded-full pl-6 gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full pr-4"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center w-full border border-gray-300 h-12 rounded-full pl-6 gap-2 mb-4">
                  <svg
                    width="13"
                    height="17"
                    viewBox="0 0 13 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                      fill="#6B7280"
                    />
                  </svg>
                  <input
                    type="password"
                    placeholder="New Password"
                    className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full pr-4"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="flex items-center w-full border border-gray-300 h-12 rounded-full pl-6 gap-2 mb-4">
                  <svg
                    width="13"
                    height="17"
                    viewBox="0 0 13 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                      fill="#6B7280"
                    />
                  </svg>
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="bg-transparent text-gray-700 placeholder-gray-500 outline-none text-sm w-full h-full pr-4"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full h-11 rounded-full text-white bg-green-500 hover:bg-green-600 transition disabled:opacity-50"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setForgotOtpSent(false)}
                  className="w-full mt-3 text-sm text-indigo-500 hover:underline"
                >
                  Change email
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
