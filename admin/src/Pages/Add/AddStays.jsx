import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiHome,
  FiFileText,
  FiDollarSign,
  FiImage,
  FiMapPin,
  FiMap,
  FiX,
  FiCheck,
} from "react-icons/fi";

const AddStays = ({ token }) => {
  const [stayData, setStayData] = useState({
    title: "",
    description: "",
    price: "",
    country: "Sri Lanka",
    district: "",
    city: "",
    amenities: [],
    amenityInput: "",
  });

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStayData({
      ...stayData,
      [name]: value,
    });
  };

  const handleCountryChange = (e) => {
    setStayData({
      ...stayData,
      country: e.target.value,
      district: "",
      city: "",
    });
  };

  const handleDistrictChange = (e) => {
    setStayData({
      ...stayData,
      district: e.target.value,
      city: "",
    });
  };

  const handleAddAmenity = () => {
    if (stayData.amenityInput.trim()) {
      setStayData({
        ...stayData,
        amenities: [...stayData.amenities, stayData.amenityInput.trim()],
        amenityInput: "",
      });
    }
  };

  const handleRemoveAmenity = (index) => {
    setStayData({
      ...stayData,
      amenities: stayData.amenities.filter((_, i) => i !== index),
    });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    // Create preview URLs
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!stayData.title || !stayData.description || !stayData.price || !stayData.city) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (images.length === 0) {
      toast.error("Please select at least one image");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", stayData.title);
      formData.append("description", stayData.description);
      formData.append("price", stayData.price);
      formData.append("country", stayData.country);
      formData.append("district", stayData.district);
      formData.append("city", stayData.city);
      formData.append("amenities", JSON.stringify(stayData.amenities));

      // Add images
      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await axios.post(`${backendUrl}/api/trending/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data?.success) {
        toast.success("Stay added successfully!");
        // Reset form
        setStayData({
          title: "",
          description: "",
          price: "",
          country: "Sri Lanka",
          district: "",
          city: "",
          amenities: [],
          amenityInput: "",
        });
        setImages([]);
        setPreviewUrls([]);
        setTimeout(() => navigate("/home"), 1500);
      } else {
        toast.error(res.data?.message || "Failed to add stay");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding stay");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FiHome className="text-2xl text-white" />
            <h1 className="text-3xl font-bold text-white">Add New Stay</h1>
          </div>
          <p className="text-green-100">Create a new stay listing for the platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiHome className="text-green-500" /> Stay Title *
              </label>
              <input
                type="text"
                name="title"
                value={stayData.title}
                onChange={handleInputChange}
                placeholder="e.g., Beautiful Beach Villa in Colombo"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiFileText className="text-blue-500" /> Description *
              </label>
              <textarea
                name="description"
                value={stayData.description}
                onChange={handleInputChange}
                placeholder="Describe the stay in detail..."
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                required
              />
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiDollarSign className="text-yellow-500" /> Price per Night (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                value={stayData.price}
                onChange={handleInputChange}
                placeholder="5000"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Country */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMapPin className="text-red-500" /> Country *
              </label>
              <select
                name="country"
                value={stayData.country}
                onChange={handleCountryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
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
                <FiMap className="text-purple-500" /> Province/District *
              </label>
              <select
                name="district"
                value={stayData.district}
                onChange={handleDistrictChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="">Select Province/District</option>
                {getDistricts(stayData.country).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMapPin className="text-indigo-500" /> City *
              </label>
              <select
                name="city"
                value={stayData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                required
              >
                <option value="">Select City</option>
                {getCities(stayData.country, stayData.district).map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Amenities */}
            <div className="md:col-span-2">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Amenities</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={stayData.amenityInput}
                  onChange={(e) => setStayData({ ...stayData, amenityInput: e.target.value })}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
                  placeholder="e.g., WiFi, AC, Swimming Pool..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={handleAddAmenity}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {stayData.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{amenity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveAmenity(index)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Images */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiImage className="text-orange-500" /> Images *
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageSelect}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                required
              />
              <p className="text-sm text-gray-500 mt-2">Select multiple images for your stay</p>

              {/* Image Previews */}
              {previewUrls.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Preview ({previewUrls.length} images)</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative rounded-lg overflow-hidden h-32 bg-gray-200">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FiCheck size={20} />
              {loading ? "Adding Stay..." : "Add Stay"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/home")}
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

export default AddStays;
