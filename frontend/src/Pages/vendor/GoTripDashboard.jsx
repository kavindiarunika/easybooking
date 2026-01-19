import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { FaCar, FaSignOutAlt, FaUser, FaPlus, FaEdit, FaHome } from "react-icons/fa";

const GoTripDashboard = () => {
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
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormData = {
    name: "",
    Price: "",
    type: "car",
    description: "",
    discrict: "",
    passagngers: "",
    facilities: "",
    whatsapp: "",
    ownerEmail: vendorEmail || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState({
    mainImage: null,
    otherImages: [],
  });

  // Check authentication
  useEffect(() => {
    if (!storedToken) {
      toast.error("Please login first");
      navigate("/vendor/register");
    }
  }, [storedToken, navigate]);

  // Fetch existing vehicle
  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    if (!vendorEmail) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/vehicle/profile?ownerEmail=${vendorEmail}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (res.data && res.data._id) {
        setHasVehicle(true);
        setSelectedId(res.data._id);
        setVehicleData(res.data);
        setFormData({
          ...res.data,
          facilities: (res.data.facilities || []).join(", "),
        });
      } else {
        setHasVehicle(false);
        setSelectedId(null);
        setVehicleData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setHasVehicle(false);
        setSelectedId(null);
        setVehicleData(null);
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

  const handleMainImage = (e) => {
    setMedia({ ...media, mainImage: e.target.files[0] });
  };

  const handleOtherImages = (e) => {
    setMedia({ ...media, otherImages: Array.from(e.target.files || []) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage && !hasVehicle) {
      toast.error("Main image is required");
      return;
    }

    if (!media.otherImages.length && !hasVehicle) {
      toast.error("Other images are required");
      return;
    }

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    if (media.mainImage) fd.append("mainImage", media.mainImage);

    media.otherImages?.forEach((file) => fd.append("otherImages", file));

    try {
      let res;
      if (hasVehicle && selectedId) {
        res = await axios.put(
          `${BACKEND_URL}/api/vehicle/update/${selectedId}`,
          fd,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
      } else {
        res = await axios.post(`${BACKEND_URL}/api/vehicle/addvehicle`, fd, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }

      if (res.data.success) {
        toast.success(hasVehicle ? "Vehicle updated!" : "Vehicle added!");
        await fetchVehicle();
        setShowForm(false);
        setMedia({
          mainImage: null,
          otherImages: [],
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-600 to-teal-600 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaCar className="text-2xl text-white" />
            <h1 className="text-xl font-bold text-white">GoTrip Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-white/80">
              <FaUser />
              <span className="text-sm">{vendorEmail}</span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition"
            >
              <FaHome />
              Back to Home
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-500 transition"
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
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <h3 className="text-gray-500 text-sm">Vehicle Status</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {hasVehicle ? "Active" : "No Vehicle"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-teal-500">
            <h3 className="text-gray-500 text-sm">Vehicle Name</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {vehicleData?.name || "N/A"}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-emerald-500">
            <h3 className="text-gray-500 text-sm">Vehicle Type</h3>
            <p className="text-2xl font-bold text-gray-800 mt-2 capitalize">
              {vehicleData?.type || "N/A"}
            </p>
          </div>
        </div>

        {/* Vehicle Card or Add Button */}
        {!showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            {hasVehicle && vehicleData ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Your Vehicle</h2>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    <FaEdit />
                    Edit Vehicle
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    {vehicleData.mainImage && (
                      <img
                        src={vehicleData.mainImage}
                        alt={vehicleData.name}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    )}
                    {/* Other Images */}
                    {vehicleData.otherImages && vehicleData.otherImages.length > 0 && (
                      <div className="grid grid-cols-4 gap-2 mt-4">
                        {vehicleData.otherImages.map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Vehicle ${idx + 1}`}
                            className="w-full h-16 object-cover rounded"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <p><strong>Name:</strong> {vehicleData.name}</p>
                    <p><strong>Type:</strong> <span className="capitalize">{vehicleData.type}</span></p>
                    <p><strong>Price:</strong> Rs.{vehicleData.Price}/day</p>
                    <p><strong>District:</strong> {vehicleData.discrict}</p>
                    <p><strong>Passengers:</strong> {vehicleData.passagngers}</p>
                    <p><strong>WhatsApp:</strong> {vehicleData.whatsapp}</p>
                    <div>
                      <strong>Facilities:</strong>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {vehicleData.facilities?.map((f, i) => (
                          <span key={i} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p><strong>Description:</strong></p>
                  <p className="text-gray-600">{vehicleData.description}</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FaCar className="text-6xl text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Vehicle Listed Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Add your vehicle to start receiving bookings
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mx-auto"
                >
                  <FaPlus />
                  Add Vehicle
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
                {hasVehicle ? "Edit Vehicle" : "Add New Vehicle"}
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
                    Vehicle Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vehicle Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="safari-jeep">Safari Jeep</option>
                    <option value="tuktuk">Tuk Tuk</option>
                  </select>
                </div>

                {/* District */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    District *
                  </label>
                  <input
                    type="text"
                    name="discrict"
                    value={formData.discrict}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price per Day (Rs) *
                  </label>
                  <input
                    type="number"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* Passengers */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Passengers *
                  </label>
                  <input
                    type="number"
                    name="passagngers"
                    value={formData.passagngers}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    WhatsApp Number *
                  </label>
                  <input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    placeholder="+94 XX XXX XXXX"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                    required
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
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Facilities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facilities (comma separated) *
                </label>
                <input
                  type="text"
                  name="facilities"
                  value={formData.facilities}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                  placeholder="AC, GPS, Bluetooth, USB Charging"
                  required
                />
              </div>

              {/* Images Section */}
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-800 mb-4">Vehicle Images</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Image {!hasVehicle && "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImage}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required={!hasVehicle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Other Images (Multiple) {!hasVehicle && "*"}
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleOtherImages}
                      className="w-full border border-gray-300 rounded-lg p-2"
                      required={!hasVehicle}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  {hasVehicle ? "Update Vehicle" : "Add Vehicle"}
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

export default GoTripDashboard;
