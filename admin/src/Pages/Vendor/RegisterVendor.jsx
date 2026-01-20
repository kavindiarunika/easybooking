import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiLock, FiTag, FiMapPin, FiMap, FiCheckCircle } from "react-icons/fi";

const RegisterVendor = ({ token }) => {
  const [vendorData, setVendorData] = useState({
    vendorName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    category: "accommodation",
    country: "Sri Lanka",
    district: "",
    city: "",
    businessAddress: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankCode: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Location data for cascading dropdowns
  const locationData = {
    "Sri Lanka": {
      "Western Province": ["Colombo", "Dehiwala", "Moratuwa", "Kotte", "Maharagama", "Kesbewa"],
      "Central Province": ["Kandy", "Peradeniya", "Katugastota", "Gampola", "Nawalapitiya"],
      "Southern Province": ["Galle", "Hikkaduwa", "Ambalangoda", "Unawatuna", "Koggala"],
      "Western Province (Coastal)": ["Kalutara", "Panadura", "Beruwala", "Wadduwa", "Aluthgama"],
      "Central Highlands": ["Nuwara Eliya", "Hatton", "Bandarawela", "Ella"],
      "Sabaragamuwa": ["Ratnapura", "Balangoda", "Embilipitiya", "Kuruwita"],
      "North Central": ["Anuradhapura", "Mihintale", "Kekirawa", "Medawachchiya"],
      "Eastern": ["Trincomalee", "Batticaloa", "Ampara", "Kalmunai"],
      "Uva": ["Badulla", "Bandarawela", "Haputale", "Welimada"],
      "North Western": ["Kurunegala", "Kuliyapitiya", "Polgahawela", "Mawathagama"],
      "Northern": ["Jaffna", "Chavakachcheri", "Point Pedro", "Nallur"],
    }
  };

  const getDistricts = (country) => {
    if (!country || !locationData[country]) return [];
    return Object.keys(locationData[country]);
  };

  const getCities = (country, district) => {
    if (!country || !district || !locationData[country]?.[district]) return [];
    return locationData[country][district];
  };

  const handleData = (e) => {
    const { name, value } = e.target;
    setVendorData({
      ...vendorData,
      [name]: value,
    });
  };

  const handleCountryChange = (e) => {
    setVendorData({
      ...vendorData,
      country: e.target.value,
      district: "",
      city: "",
    });
  };

  const handleDistrictChange = (e) => {
    setVendorData({
      ...vendorData,
      district: e.target.value,
      city: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!vendorData.vendorName || !vendorData.email || !vendorData.phone || !vendorData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (vendorData.password !== vendorData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (vendorData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const registrationData = {
        vendorName: vendorData.vendorName,
        email: vendorData.email,
        phone: vendorData.phone,
        password: vendorData.password,
        category: vendorData.category,
        country: vendorData.country,
        district: vendorData.district,
        city: vendorData.city,
        businessAddress: vendorData.businessAddress,
        bankAccountName: vendorData.bankAccountName,
        bankAccountNumber: vendorData.bankAccountNumber,
        bankCode: vendorData.bankCode,
      };

      const res = await axios.post(`${backendUrl}/api/vendor/register`, registrationData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data?.success) {
        toast.success("Vendor registered successfully!");
        setVendorData({
          vendorName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          category: "accommodation",
          country: "Sri Lanka",
          district: "",
          city: "",
          businessAddress: "",
          bankAccountName: "",
          bankAccountNumber: "",
          bankCode: "",
        });
        setTimeout(() => navigate("/vendors"), 1500);
      } else {
        toast.error(res.data?.message || "Failed to register vendor");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error registering vendor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FiUser className="text-2xl text-white" />
            <h1 className="text-3xl font-bold text-white">Register New Vendor</h1>
          </div>
          <p className="text-blue-100">Add a new vendor to the platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vendor Name */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiUser className="text-blue-500" /> Vendor Name *
              </label>
              <input
                type="text"
                name="vendorName"
                value={vendorData.vendorName}
                onChange={handleData}
                placeholder="Enter vendor name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiTag className="text-purple-500" /> Category *
              </label>
              <select
                name="category"
                value={vendorData.category}
                onChange={handleData}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="accommodation">Accommodation</option>
                <option value="food">Food & Restaurant</option>
                <option value="transport">Transport</option>
                <option value="tour">Tour & Travel</option>
                <option value="entertainment">Entertainment</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMail className="text-red-500" /> Email *
              </label>
              <input
                type="email"
                name="email"
                value={vendorData.email}
                onChange={handleData}
                placeholder="vendor@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiPhone className="text-green-500" /> Phone *
              </label>
              <input
                type="tel"
                name="phone"
                value={vendorData.phone}
                onChange={handleData}
                placeholder="+94 77 123 4567"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiLock className="text-orange-500" /> Password *
              </label>
              <input
                type="password"
                name="password"
                value={vendorData.password}
                onChange={handleData}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiLock className="text-orange-500" /> Confirm Password *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={vendorData.confirmPassword}
                onChange={handleData}
                placeholder="••••••••"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMapPin className="text-blue-500" /> Country *
              </label>
              <select
                name="country"
                value={vendorData.country}
                onChange={handleCountryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                {Object.keys(locationData).map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMap className="text-green-500" /> Province/District *
              </label>
              <select
                name="district"
                value={vendorData.district}
                onChange={handleDistrictChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select Province/District</option>
                {getDistricts(vendorData.country).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMapPin className="text-purple-500" /> City *
              </label>
              <select
                name="city"
                value={vendorData.city}
                onChange={handleData}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              >
                <option value="">Select City</option>
                {getCities(vendorData.country, vendorData.district).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Business Address */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMapPin className="text-indigo-500" /> Business Address
              </label>
              <input
                type="text"
                name="businessAddress"
                value={vendorData.businessAddress}
                onChange={handleData}
                placeholder="Enter business address"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            {/* Bank Account Details */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiCheckCircle className="text-blue-500" /> Bank Account Name
              </label>
              <input
                type="text"
                name="bankAccountName"
                value={vendorData.bankAccountName}
                onChange={handleData}
                placeholder="Account holder name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiCheckCircle className="text-blue-500" /> Bank Account Number
              </label>
              <input
                type="text"
                name="bankAccountNumber"
                value={vendorData.bankAccountNumber}
                onChange={handleData}
                placeholder="Account number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiCheckCircle className="text-blue-500" /> Bank Code
              </label>
              <input
                type="text"
                name="bankCode"
                value={vendorData.bankCode}
                onChange={handleData}
                placeholder="Bank code/Swift code"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Vendor"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/vendors")}
              className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterVendor;
