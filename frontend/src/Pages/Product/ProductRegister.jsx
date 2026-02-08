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

      const res = await axios.post(`${BACKEND_URL}/api/product-vendor/register`, payload);

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
    <div className=" flex items-center justify-center bg-white/30 text-white p-24">
      <div className="flex flex-row gap-8">
        {/*------------left----------------- */}
        <div>
          <img
            src={productAssets.login}
            alt="Login"
            className=" object-cover"
          />
        </div>

        {/*------------right----------------- */}
        <div className="">
          <div className="w-full max-w-4xl bg-gray-800 rounded-lg p-12 border border-gray-700">
            {/* Toggle Tabs */}
            <div className="flex  gap-12 mb-6 border-b border-gray-700">
              <button
                onClick={() => setIsLogin(false)}
                className={`pb-3 px-4 font-semibold transition ${
                  !isLogin
                    ? "border-b-2 border-blue-600 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Register
              </button>
              <button
                onClick={() => setIsLogin(true)}
                className={`pb-3 px-4 font-semibold transition ${
                  isLogin
                    ? "border-b-2 border-blue-600 text-blue-400"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                Login
              </button>
            </div>

            {!isLogin ? (
              <>
                {/* REGISTER FORM */}
                <h2 className="text-2xl font-semibold mb-4 prata-regular text-center">
                  Welcome to{" "}
                  <span className="text-green-300 prata-regular">
                    SmartsBooking
                  </span>
                </h2>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Business Name
                    </label>
                    <input
                      name="businessName"
                      value={registerForm.businessName}
                      onChange={handleRegisterChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600 active:border-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Owner / Contact Name
                    </label>
                    <input
                      name="ownerName"
                      value={registerForm.ownerName}
                      onChange={handleRegisterChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={registerForm.email}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        name="phone"
                        value={registerForm.phone}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={registerForm.password}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-1">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={registerForm.confirmPassword}
                        onChange={handleRegisterChange}
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 px-4 py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {loading ? "Registering..." : "Register"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="bg-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                {/* LOGIN FORM */}
                <h2 className="text-2xl font-semibold mb-4">
                  Product Vendor Login
                </h2>
                <p className="text-sm text-gray-300 mb-6">
                  Sign in to manage your products.
                </p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-blue-600 px-4 py-2 rounded font-semibold disabled:opacity-50"
                    >
                      {loading ? "Logging in..." : "Login"}
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="bg-gray-700 px-4 py-2 rounded"
                    >
                      Cancel
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
