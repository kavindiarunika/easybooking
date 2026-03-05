import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";

export default function VehicleSignUp() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [message, setMessage] = useState(null);

  // forgot password state
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotStep, setForgotStep] = useState("email"); // "email" or "reset"
  const [forgotForm, setForgotForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotMessage, setForgotMessage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleForgotChange = (e) => {
    setForgotForm({ ...forgotForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url =
        mode === "login"
          ? "/api/vehicle-auth/login"
          : "/api/vehicle-auth/register";
      const body = { email: form.email, password: form.password };
      if (mode === "register") body.name = form.name;
      const res = await api.post(url, body);
      if (res.data.success) {
        setMessage({ type: "success", text: res.data.message || "Success" });
        if (mode === "login" && res.data.token) {
          localStorage.setItem("vehicleToken", res.data.token);
          // redirect to dashboard on successful login
          navigate("/vehicle/dashboard");
        }
      } else {
        setMessage({ type: "error", text: res.data.message || "Failed" });
      }
    } catch (err) {
      console.error(err);
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Server error",
      });
    }
  };

  const handleForgotEmail = async (e) => {
    e.preventDefault();
    if (!forgotForm.email) {
      setForgotMessage({ type: "error", text: "Email is required" });
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post("/api/vehicle-auth/forgot-password", {
        email: forgotForm.email,
      });
      if (res.data.success) {
        setForgotMessage({
          type: "success",
          text: res.data.message || "OTP sent to your email",
        });
        setForgotStep("reset");
      } else {
        setForgotMessage({ type: "error", text: res.data.message });
      }
    } catch (err) {
      console.error(err);
      setForgotMessage({
        type: "error",
        text: err.response?.data?.message || "Failed to send OTP",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotReset = async (e) => {
    e.preventDefault();
    const { otp, newPassword, confirmNewPassword } = forgotForm;
    if (!otp || !newPassword || !confirmNewPassword) {
      setForgotMessage({ type: "error", text: "Please fill all fields" });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotMessage({ type: "error", text: "Passwords do not match" });
      return;
    }
    if (newPassword.length < 6) {
      setForgotMessage({ type: "error", text: "Password must be 6+ chars" });
      return;
    }
    setForgotLoading(true);
    try {
      const res = await api.post("/api/vehicle-auth/reset-password", {
        email: forgotForm.email,
        otp,
        newPassword,
      });
      if (res.data.success) {
        setForgotMessage({
          type: "success",
          text: res.data.message || "Password reset successful",
        });
        setForgotMode(false);
        setForgotStep("email");
        setForgotForm({
          email: "",
          otp: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      } else {
        setForgotMessage({ type: "error", text: res.data.message });
      }
    } catch (err) {
      console.error(err);
      setForgotMessage({
        type: "error",
        text: err.response?.data?.message || "Reset failed",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full px-4">
      <form onSubmit={handleSubmit} className="flex w-full flex-col max-w-96">
        <a
          href="https://prebuiltui.com"
          className="mb-8"
          title="Go to PrebuiltUI"
        >
          <svg
            className="size-10"
            width="30"
            height="33"
            viewBox="0 0 30 33"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m8 4.55 6.75 3.884 6.75-3.885M8 27.83v-7.755L1.25 16.19m27 0-6.75 3.885v7.754M1.655 8.658l13.095 7.546 13.095-7.546M14.75 31.25V16.189m13.5 5.976V10.212a2.98 2.98 0 0 0-1.5-2.585L16.25 1.65a3.01 3.01 0 0 0-3 0L2.75 7.627a3 3 0 0 0-1.5 2.585v11.953a2.98 2.98 0 0 0 1.5 2.585l10.5 5.977a3.01 3.01 0 0 0 3 0l10.5-5.977a3 3 0 0 0 1.5-2.585"
              stroke="#1d293d"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>

        <h2 className="text-4xl font-medium text-white">
          {mode === "login" ? "Sign in" : "Create account"}
        </h2>

        <p className="mt-4 text-base  text-gray-400/90">
          {mode === "login"
            ? "Please enter email and password to access."
            : "Fill in the information to register."}
        </p>

        {mode === "register" && (
          <div className="mt-6 text-white">
            <label className="font-medium text-white">Name</label>
            <input
              placeholder="Your full name"
              className="mt-2 rounded-md ring ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none px-3 py-3 w-full"
              required
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>
        )}

        {forgotMode ? (
          <>
            {forgotStep === "email" ? (
              <>
                <div className="mt-10">
                  <label className="font-medium text-white">Email</label>
                  <input
                    placeholder="Enter your email"
                    className="mt-2 rounded-md ring text-white ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none px-3 py-3 w-full"
                    required
                    type="email"
                    name="email"
                    value={forgotForm.email}
                    onChange={handleForgotChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleForgotEmail}
                  disabled={forgotLoading}
                  className="mt-8 py-3 w-full cursor-pointer rounded-md bg-green-600 text-white transition hover:bg-green-700"
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : (
              <>
                <div className="mt-10">
                  <label className="font-medium text-white">OTP</label>
                  <input
                    placeholder="Enter OTP"
                    className="mt-2 rounded-md ring text-white ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none px-3 py-3 w-full"
                    required
                    type="text"
                    name="otp"
                    value={forgotForm.otp}
                    onChange={handleForgotChange}
                  />
                </div>
                <div className="mt-6">
                  <label className="font-medium text-white">New Password</label>
                  <input
                    placeholder="New password"
                    className="mt-2 rounded-md ring text-white ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none px-3 py-3 w-full"
                    required
                    type="password"
                    name="newPassword"
                    value={forgotForm.newPassword}
                    onChange={handleForgotChange}
                  />
                </div>
                <div className="mt-6">
                  <label className="font-medium text-white">
                    Confirm Password
                  </label>
                  <input
                    placeholder="Confirm new password"
                    className="mt-2 rounded-md ring text-white ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none px-3 py-3 w-full"
                    required
                    type="password"
                    name="confirmNewPassword"
                    value={forgotForm.confirmNewPassword}
                    onChange={handleForgotChange}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleForgotReset}
                  disabled={forgotLoading}
                  className="mt-8 py-3 w-full cursor-pointer rounded-md bg-green-600 text-white transition hover:bg-green-700"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </>
        ) : (
          <>
            <div className="mt-10">
              <label className="font-medium text-white">Email</label>
              <input
                placeholder="Please enter your email"
                className="mt-2 rounded-md ring text-white ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none px-3 py-3 w-full"
                required
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="mt-6">
              <label className="font-medium text-white">Password</label>
              <input
                placeholder="Please enter your password"
                className="mt-2 rounded-md ring text-white ring-gray-200 focus:ring-2 focus:ring-green-600 outline-none px-3 py-3 w-full"
                required
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="mt-8 py-3 w-full cursor-pointer rounded-md bg-green-600 text-white transition hover:bg-green-700"
            >
              {mode === "login" ? "Login" : "Register"}
            </button>
          </>
        )}
        {message && (
          <p
            className={`text-center py-4 ${
              message.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {message.text}
          </p>
        )}
        {forgotMode && forgotMessage && (
          <p
            className={`text-center py-4 ${
              forgotMessage.type === "error" ? "text-red-500" : "text-green-500"
            }`}
          >
            {forgotMessage.text}
          </p>
        )}

        {forgotMode ? (
          <p className="text-center py-4 text-white">
            <button
              type="button"
              className="text-green-600 hover:underline"
              onClick={() => {
                setForgotMode(false);
                setForgotStep("email");
                setForgotMessage(null);
              }}
            >
              ← Back to login
            </button>
          </p>
        ) : (
          <p className="text-center py-8 text-white">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-green-600 hover:underline"
                  onClick={() => {
                    setMode("register");
                    setMessage(null);
                  }}
                >
                  Sign up
                </button>
                <br />
                <button
                  type="button"
                  className="text-green-600 hover:underline mt-2"
                  onClick={() => {
                    setForgotMode(true);
                    setForgotStep("email");
                    setForgotMessage(null);
                  }}
                >
                  Forgot password?
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-green-600 hover:underline"
                  onClick={() => {
                    setMode("login");
                    setMessage(null);
                  }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        )}
      </form>
    </main>
  );
}
