import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiLock, FiTag, FiGlobe, FiMapPin, FiMap } from "react-icons/fi";

const AddVendor = ({ token }) => {
  const [vendorData, setVendorData] = useState({
    email: "",
    phone: "",
    password: "",
    category: "",
    country: "Sri Lanka",
    district: "",
    city: "",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Location data for cascading dropdowns
  const locationData = {
    "Sri Lanka": {
      "Colombo": ["Colombo", "Dehiwala", "Moratuwa", "Kotte", "Maharagama", "Kesbewa"],
      "Gampaha": ["Negombo", "Gampaha", "Kelaniya", "Wattala", "Ja-Ela", "Minuwangoda"],
      "Kandy": ["Kandy", "Peradeniya", "Katugastota", "Gampola", "Nawalapitiya"],
      "Galle": ["Galle", "Hikkaduwa", "Ambalangoda", "Unawatuna", "Koggala"],
      "Matara": ["Matara", "Weligama", "Mirissa", "Dickwella", "Tangalle"],
      "Hambantota": ["Hambantota", "Tissamaharama", "Tangalle", "Ambalantota"],
      "Kalutara": ["Kalutara", "Panadura", "Beruwala", "Wadduwa", "Aluthgama"],
      "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Bandarawela", "Ella"],
      "Ratnapura": ["Ratnapura", "Balangoda", "Embilipitiya", "Kuruwita"],
      "Anuradhapura": ["Anuradhapura", "Mihintale", "Kekirawa", "Medawachchiya"],
      "Polonnaruwa": ["Polonnaruwa", "Kaduruwela", "Hingurakgoda"],
      "Kurunegala": ["Kurunegala", "Kuliyapitiya", "Polgahawela", "Mawathagama"],
      "Puttalam": ["Puttalam", "Chilaw", "Wennappuwa", "Kalpitiya"],
      "Trincomalee": ["Trincomalee", "Kinniya", "Kantale"],
      "Batticaloa": ["Batticaloa", "Kattankudy", "Eravur"],
      "Ampara": ["Ampara", "Kalmunai", "Akkaraipattu"],
      "Badulla": ["Badulla", "Bandarawela", "Haputale", "Welimada"],
      "Monaragala": ["Monaragala", "Wellawaya", "Bibile"],
      "Jaffna": ["Jaffna", "Chavakachcheri", "Point Pedro", "Nallur"],
      "Kilinochchi": ["Kilinochchi"],
      "Mannar": ["Mannar", "Talaimannar"],
      "Vavuniya": ["Vavuniya"],
      "Mullaitivu": ["Mullaitivu"],
      "Matale": ["Matale", "Dambulla", "Sigiriya", "Ukuwela"],
      "Kegalle": ["Kegalle", "Mawanella", "Rambukkana"]
    },
    "India": {
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
      "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
      "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
      "Delhi": ["New Delhi", "Delhi NCR"],
      "Goa": ["Panaji", "Margao", "Vasco da Gama"]
    },
    "Maldives": {
      "Male": ["Male City", "Hulhumale", "Villimale"],
      "Ari Atoll": ["Mahibadhoo", "Maamigili"],
      "Baa Atoll": ["Eydhafushi", "Thulhaadhoo"]
    },
    "Thailand": {
      "Bangkok": ["Bangkok", "Nonthaburi"],
      "Phuket": ["Phuket Town", "Patong", "Kata"],
      "Chiang Mai": ["Chiang Mai City", "San Kamphaeng"]
    },
    "Other": {
      "Other": ["Other"]
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
    setVendorData({
      ...vendorData,
      [e.target.name]: e.target.value,
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

    try {
      setLoading(true);
      toast.loading("Creating vendor account...");

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
      toast.success("Vendor account created successfully!");

      switch (vendorData.category) {
        case "stays":
          navigate("/addtrending", { state: { ownerEmail: vendorData.email } });
          break;
        case "ontrip":
          navigate("/addsafari", { state: { ownerEmail: vendorData.email } });
          break;
        default:
          navigate("/vendors");
      }

      setVendorData({
        email: "",
        phone: "",
        password: "",
        category: "",
        country: "Sri Lanka",
        district: "",
        city: "",
      });
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Vendor</h1>
        <p className="text-gray-500 mt-1">Create a new vendor account</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiMail className="text-blue-500" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={vendorData.email}
              onChange={handleData}
              required
              placeholder="vendor@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiPhone className="text-green-500" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={vendorData.phone}
              onChange={handleData}
              required
              placeholder="+94 77 123 4567"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiLock className="text-purple-500" />
              Password
            </label>
            <input
              type="password"
              name="password"
              value={vendorData.password}
              onChange={handleData}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            />
          </div>

          {/* Category */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <FiTag className="text-orange-500" />
              Vendor Category
            </label>
            <select
              name="category"
              value={vendorData.category}
              onChange={handleData}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
              <option value="">Select Category</option>
              <option value="stays">🏠 Stays (Hotels, Villas, Houses)</option>
              <option value="ontrip">🐘 Safari / Tours</option>
            </select>
          </div>

          {/* Location Section */}
          <div className="border-t pt-5 mt-5">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <FiMapPin className="text-red-500" />
              Location Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Country */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiGlobe className="text-blue-500" />
                  Country
                </label>
                <select
                  name="country"
                  value={vendorData.country}
                  onChange={handleCountryChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  {Object.keys(locationData).map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiMap className="text-green-500" />
                  District
                </label>
                <select
                  name="district"
                  value={vendorData.district}
                  onChange={handleDistrictChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Select District</option>
                  {getDistricts(vendorData.country).map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiMapPin className="text-purple-500" />
                  City
                </label>
                <select
                  name="city"
                  value={vendorData.city}
                  onChange={handleData}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="">Select City</option>
                  {getCities(vendorData.country, vendorData.district).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <FiUser size={18} />
                  Create Vendor Account
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVendor;
