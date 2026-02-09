import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACKEND_URL } from "../../App";
import { productAssets } from "../../assets/Product/productAssets";

const ProductRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    businessName: "",
    ownerName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleRegisterChange = (e) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/api/product-vendor/login`, {
        email: loginForm.email,
        password: loginForm.password,
      });
      if (res.data?.vendorToken) {
        // store under both keys so existing ProtectedRoute recognizes the login
        localStorage.setItem("productVendorToken", res.data.vendorToken);
        localStorage.setItem("vendorToken", res.data.vendorToken);
        localStorage.setItem("productVendorEmail", loginForm.email);
        toast.success("Logged in successfully");
        navigate("/vendor/dashboard-products");
      } else {
        toast.success(res.data?.message || "Logged in successfully");
        navigate("/vendor/dashboard-products");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !registerForm.businessName ||
      !registerForm.ownerName ||
      !registerForm.email ||
      !registerForm.password
    ) {
      toast.error("Please fill required fields");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        businessName: registerForm.businessName,
        ownerName: registerForm.ownerName,
        email: registerForm.email,
        phone: registerForm.phone,
        password: registerForm.password,
      };

      const res = await axios.post(
        `${BACKEND_URL}/api/vendor/product-register`,
        payload,
      );
      if (res.data?.vendorToken) {
        // store under both keys so ProtectedRoute will allow access
        localStorage.setItem("productVendorToken", res.data.vendorToken);
        localStorage.setItem("vendorToken", res.data.vendorToken);
        localStorage.setItem("productVendorEmail", registerForm.email);
        toast.success("Registered successfully");
        navigate("/product");
      } else {
        toast.success(res.data?.message || "Registered successfully");
        navigate("/vendor/dashboard-products");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-white/30 min-h-screen text-white p-4 md:p-24">
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full md:w-auto">
        {/*------------left----------------- */}
        <div className="hidden md:block">
          <img
            src={productAssets.login}
            alt="Login"
            className="object-cover -mt-8"
          />
        </div>

        {/*------------right----------------- */}
        <div className="w-full md:w-auto md:mt-8">
          <div className="w-full md:w-[500px] bg-black/50 rounded-lg p-6 md:p-12 border border-gray-700">
            {/* Toggle Tabs */}
            <div className="flex gap-6 md:gap-12 mb-6 border-b-4 border-green-600">
              <button
                onClick={() => setIsLogin(false)}
                className={`pb-3 px-3 md:px-4 font-semibold text-sm md:text-base transition ${
                  !isLogin
                    ? "border-b-2 border-green-600 text-green-400 prata-regular"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`pb-3 px-3 md:px-4 font-semibold text-sm md:text-base transition ${
                  isLogin
                    ? "border-b-2 border-green-600 text-green-400 prata-regular"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Login
              </button>
            </div>

            {!isLogin ? (
              <>
                {/* REGISTER FORM */}
                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 prata-regular text-center">
                  Welcome to{" "}
                  <span className="text-green-300 prata-regular">
                    SmartsBooking
                  </span>
                </h2>

                <form
                  onSubmit={handleRegister}
                  className="space-y-3 md:space-y-4"
                >
                  <div>
                    <label className="block text-xs md:text-sm text-gray-300 mb-1">
                      Business Name
                    </label>
                    <input
                      name="businessName"
                      value={registerForm.businessName}
                      onChange={handleRegisterChange}
                      className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs md:text-sm text-gray-300 mb-1">
                      Owner / Contact Name
                    </label>
                    <input
                      name="ownerName"
                      value={registerForm.ownerName}
                      onChange={handleRegisterChange}
                      className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs md:text-sm text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                    <div>
                      <label className="block text-xs md:text-sm text-gray-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 items-center mt-6 md:mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold disabled:opacity-50 transition"
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                   
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* LOGIN FORM */}
                <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 prata-regular text-center">
                  Hello! Welcome back
                </h2>

                <form onSubmit={handleLogin} className="space-y-3 md:space-y-4">
                  <div>
                    <label className="block text-xs md:text-sm text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs md:text-sm text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className="w-full p-2 rounded border border-gray-600 bg-gray-800/50 text-white focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-6 md:mt-8">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold disabled:opacity-50 transition"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                   
                  </div>
                </form>
              </>
            )}
          </div>
          <ToastContainer position="top-center" />
        </div>
      </div>
    </div>
  );
};

export default ProductRegister;
