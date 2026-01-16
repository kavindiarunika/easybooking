import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const VendorRegister = ({ categorytype, token }) => {
  const [vendorData, setVendorData] = useState({
    email: "",
    phone: "",
    password: "",
    category: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleData = (e) => {
    setVendorData({
      ...vendorData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      toast.loading("Registering vendor...");

      const response = await axios.post(
        `${backendUrl}/api/vendor/registerByAdmin`,
        vendorData,
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      toast.dismiss();
      toast.success("Vendor registered successfully");

      switch (vendorData.category) {
        case "stays":
          // navigate to AddTrending and pass ownerEmail so admin can create the profile
          navigate("/addtrending", { state: { ownerEmail: vendorData.email } });
          break;

        case "ontrip":
          // navigate to AddSafari and pass ownerEmail so admin can create the profile
          navigate("/addsafari", { state: { ownerEmail: vendorData.email } });
          break;

        default:
          console.error("Unknown category");
      }

      setVendorData({
        email: "",
        phone: "",
        password: "",
        category: "",
      });
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Register Vendor (Admin)
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={vendorData.email}
              onChange={handleData}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={vendorData.phone}
              onChange={handleData}
              required
              placeholder="+91 9876543210"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={vendorData.password}
              onChange={handleData}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={vendorData.category}
              onChange={handleData}
              required
              className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              <option value="">Select type</option>
              <option value={categorytype}>Stays</option>
            </select>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Registering..." : "Register Vendor"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRegister;
