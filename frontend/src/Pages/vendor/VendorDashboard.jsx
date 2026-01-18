import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { FaHotel, FaSignOutAlt, FaUser, FaPlus, FaEdit } from "react-icons/fa";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("vendorToken");

  const getVendorInfo = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const vendorInfo = storedToken ? getVendorInfo(storedToken) : null;
  const vendorEmail = vendorInfo?.email;

  const [loading, setLoading] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormData = {
    name: "",
    description: "",
    category: "villa",
    rating: "5",
    district: "",
    price: "",
    location: "",
    highlights: "",
    address: "",
    contact: "",
    ownerEmail: vendorEmail || "",
    videoUrl: "",
    availableThings: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState({
    mainImage: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    otherimages: [],
  });

  // Check authentication
  useEffect(() => {
    if (!storedToken) {
      toast.error("Please login first");
      navigate("/vendor/register");
    }
  }, [storedToken, navigate]);

  // Fetch existing profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!vendorEmail) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/trending/profile?ownerEmail=${vendorEmail}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (res.data && res.data._id) {
        setHasProfile(true);
        setSelectedId(res.data._id);
        setProfileData(res.data);
        setFormData({
          ...res.data,
          availableThings: (res.data.availableThings || []).join(", "),
        });
      } else {
        setHasProfile(false);
        setSelectedId(null);
        setProfileData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setHasProfile(false);
        setSelectedId(null);
        setProfileData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      } else {
        console.log(err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSingleFile = (e, field) => {
    setMedia({ ...media, [field]: e.target.files[0] });
  };

  const handleOtherImages = (e) => {
    setMedia({ ...media, otherimages: Array.from(e.target.files || []) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage && !hasProfile) {
      toast.error("Main image is required");
      return;
    }

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "availableThings") {
        (value ? value.split(",").map((i) => i.trim()) : []).forEach((v) =>
          fd.append(key, v)
        );
      } else {
        fd.append(key, value);
      }
    });

    if (media.mainImage) fd.append("mainImage", media.mainImage);

    ["image", "image1", "image2", "image3", "image4"].forEach((field) => {
      if (media[field]) fd.append(field, media[field]);
    });

    media.otherimages?.forEach((file) => fd.append("otherimages", file));

    try {
      let res;
      if (hasProfile && selectedId) {
        res = await axios.put(
          `${BACKEND_URL}/api/trending/update/${selectedId}`,
          fd,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
      } else {
        res = await axios.post(`${BACKEND_URL}/api/trending/add`, fd, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }

      if (res.data.success) {
        toast.success(hasProfile ? "Profile updated!" : "Property added!");
        await fetchProfile();
        setShowForm(false);
        setMedia({
          mainImage: null,
          image: null,
          image1: null,
          image2: null,
          image3: null,
          image4: null,
          otherimages: [],
        });
      } else {
        toast.error("Operation failed");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorCategory");
    toast.success("Logged out successfully");
    navigate("/vendor/register");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaHotel className="text-2xl text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">Vendor Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaUser />
              <span className="text-sm">{vendorEmail}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Property Status</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {hasProfile ? "Active" : "No Property"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Property Name</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {profileData?.name || "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-500 text-sm">Category</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2 capitalize">
              {profileData?.category || "N/A"}
            </p>
          </div>
        </div>

        {/* Property Card or Add Button */}
        {!showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {hasProfile && profileData ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Your Property</h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                  >
                    <FaEdit />
                    Edit Property
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {profileData.mainImage && (
                      <img
                        src={profileData.mainImage}
                        alt={profileData.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                  </div>
                  <div className="space-y-3">
                    <p><strong>Name:</strong> {profileData.name}</p>
                    <p><strong>Category:</strong> {profileData.category}</p>
                    <p><strong>Location:</strong> {profileData.location}</p>
                    <p><strong>District:</strong> {profileData.district}</p>
                    <p><strong>Price:</strong> Rs.{profileData.price}</p>
                    <p><strong>Rating:</strong> {profileData.rating} Star</p>
                    <p><strong>Contact:</strong> {profileData.contact}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <p><strong>Description:</strong></p>
                  <p className="text-gray-600">{profileData.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaHotel className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Property Listed Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Add your first property to start receiving bookings
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mx-auto"
                >
                  <FaPlus />
                  Add Property
                </button>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800">
                {hasProfile ? "Edit Property" : "Add New Property"}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="villa">Villa</option>
                    <option value="hotel">Hotel</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="house">House</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (Rs) *
                  </label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <select
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Star
                      </option>
                    ))}
                  </select>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Highlights
                </label>
                <textarea
                  name="highlights"
                  value={formData.highlights}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="Key features of your property"
                />
              </div>

              {/* Available Things */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  name="availableThings"
                  value={formData.availableThings}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="WiFi, Pool, AC, Parking"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Video URL (YouTube/Vimeo)
                </label>
                <input
                  type="text"
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Images Section */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-4">Property Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Image {!hasProfile && "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleSingleFile(e, "mainImage")}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required={!hasProfile}
                    />
                  </div>
                  {["image", "image1", "image2", "image3", "image4"].map((f, i) => (
                    <div key={f}>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image {i + 1}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSingleFile(e, f)}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                  ))}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Images (Multiple)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleOtherImages}
                      className="w-full border border-gray-300 rounded-lg p-2"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  {hasProfile ? "Update Property" : "Add Property"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default VendorDashboard;
