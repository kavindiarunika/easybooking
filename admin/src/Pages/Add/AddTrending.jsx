import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import VendorRegister from "../../components/VendorRegister";
import { useLocation } from "react-router-dom";
import { 
  FiHome, FiFileText, FiTag, FiStar, FiDollarSign, FiMapPin, 
  FiPhone, FiMail, FiVideo, FiList, FiImage, FiGlobe, FiMap,
  FiUpload, FiPlus
} from "react-icons/fi";

const AddTrending = ({ token }) => {
  // ---------------- TEXT FIELDS ----------------
  const [formDataFields, setFormDataFields] = useState({
    name: "",
    description: "",
    category: "villa",
    rating: "5",
    country: "Sri Lanka",
    district: "",
    city: "",
    price: "",
    location: "",
    highlights: "",
    address: "",
    contact: "",
    ownerEmail: "",
    videoUrl: "",
    availableThings: "",
  });
  const [register, setregister] = useState(false);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

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

  useEffect(() => {
    const ownerEmail = location?.state?.ownerEmail;
    if (ownerEmail) {
      setregister(true);
      setFormDataFields((prev) => ({ ...prev, ownerEmail }));
    }
  }, [location]);

  // ---------------- MEDIA ----------------
  const [media, setMedia] = useState({
    mainImage: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,

    otherimages: [],
  });

  // ---------------- HANDLERS ----------------
  const handleInputChange = (e) => {
    setFormDataFields({
      ...formDataFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryChange = (e) => {
    setFormDataFields({
      ...formDataFields,
      country: e.target.value,
      district: "",
      city: "",
    });
  };

  const handleDistrictChange = (e) => {
    setFormDataFields({
      ...formDataFields,
      district: e.target.value,
      city: "",
    });
  };

  const handleSingleFile = (e, field) => {
    setMedia({ ...media, [field]: e.target.files[0] });
  };

  const handleOtherImages = (e) => {
    setMedia({ ...media, otherimages: Array.from(e.target.files || []) });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage) {
      toast.error("Main image is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // text fields
    Object.entries(formDataFields).forEach(([key, value]) => {
      if (key === "availableThings") {
        formData.append(
          key,
          value ? value.split(",").map((i) => i.trim()) : []
        );
      } else {
        formData.append(key, value);
      }
    });

    // images (ORDER IS IMPORTANT)
    // mainImage acts as the card/primary image
    formData.append("mainImage", media.mainImage);

    const imageFields = ["image1", "image2", "image3", "image4", "image"];

    imageFields.forEach((field) => {
      if (media[field]) {
        formData.append(field, media[field]);
      }
    });

    if (media.otherimages.length > 0) {
      media.otherimages.forEach((file) => {
        formData.append("otherimages", file);
      });
    }

    try {
      const res = await axios.post(`${backendUrl}/api/trending/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Stay added successfully!");

        // reset
        setFormDataFields({
          name: "",
          description: "",
          category: "villa",
          rating: "5",
          country: "Sri Lanka",
          district: "",
          city: "",
          price: "",
          location: "",
          highlights: "",
          address: "",
          contact: "",
          ownerEmail: "",
          videoUrl: "",
          availableThings: "",
        });

        setMedia({
          mainImage: null,
          image: null,
          image1: null,
          image2: null,
          image3: null,
          image4: null,

          otherimages: [],
        });

        document.querySelectorAll('input[type="file"]').forEach((i) => {
          i.value = "";
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return register ? (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Add New Stay</h1>
        <p className="text-gray-500 mt-1">Create a new hotel, villa, or restaurant listing</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiHome className="text-green-500" />
            Basic Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiHome className="text-blue-500" />
                Property Name *
              </label>
              <input
                type="text"
                name="name"
                value={formDataFields.name}
                onChange={handleInputChange}
                required
                placeholder="Enter property name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Category */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiTag className="text-purple-500" />
                Category *
              </label>
              <select
                name="category"
                value={formDataFields.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="villa">🏠 Villa</option>
                <option value="hotel">🏨 Hotel</option>
                <option value="restaurant">🍽️ Restaurant</option>
                <option value="house">🏡 House</option>
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiStar className="text-yellow-500" />
                Rating *
              </label>
              <select
                name="rating"
                value={formDataFields.rating}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>⭐ {r} Star</option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiDollarSign className="text-green-500" />
                Price (Rs.) *
              </label>
              <input
                type="number"
                name="price"
                value={formDataFields.price}
                onChange={handleInputChange}
                required
                placeholder="Enter price"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Owner Email */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiMail className="text-red-500" />
                Owner Email *
              </label>
              <input
                type="email"
                name="ownerEmail"
                value={formDataFields.ownerEmail}
                onChange={handleInputChange}
                required
                placeholder="owner@example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiFileText className="text-indigo-500" />
                Description *
              </label>
              <textarea
                name="description"
                value={formDataFields.description}
                onChange={handleInputChange}
                required
                rows={4}
                placeholder="Describe the property..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiMapPin className="text-red-500" />
            Location Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Country */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiGlobe className="text-blue-500" />
                Country *
              </label>
              <select
                name="country"
                value={formDataFields.country}
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
                District *
              </label>
              <select
                name="district"
                value={formDataFields.district}
                onChange={handleDistrictChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="">Select District</option>
                {getDistricts(formDataFields.country).map((district) => (
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
                value={formDataFields.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              >
                <option value="">Select City</option>
                {getCities(formDataFields.country, formDataFields.district).map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="text-orange-500" />
                Full Address
              </label>
              <input
                type="text"
                name="address"
                value={formDataFields.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Google Maps Link */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiMapPin className="text-blue-500" />
                Google Maps Link
              </label>
              <input
                type="text"
                name="location"
                value={formDataFields.location}
                onChange={handleInputChange}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Contact & Additional Info */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiPhone className="text-green-500" />
            Contact & Additional Info
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contact */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="text-green-500" />
                Contact Number
              </label>
              <input
                type="text"
                name="contact"
                value={formDataFields.contact}
                onChange={handleInputChange}
                placeholder="+94 77 123 4567"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiVideo className="text-red-500" />
                Video URL (YouTube)
              </label>
              <input
                type="text"
                name="videoUrl"
                value={formDataFields.videoUrl}
                onChange={handleInputChange}
                placeholder="https://youtube.com/..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>

            {/* Highlights */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiStar className="text-yellow-500" />
                Highlights
              </label>
              <textarea
                name="highlights"
                value={formDataFields.highlights}
                onChange={handleInputChange}
                rows={2}
                placeholder="Key features and highlights..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
              />
            </div>

            {/* Available Things */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiList className="text-indigo-500" />
                Available Amenities (comma separated)
              </label>
              <input
                type="text"
                name="availableThings"
                value={formDataFields.availableThings}
                onChange={handleInputChange}
                placeholder="WiFi, Pool, AC, Parking, Restaurant..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FiImage className="text-pink-500" />
            Property Images
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Image */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiUpload className="text-green-500" />
                Main Image (Card Display) *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSingleFile(e, "mainImage")}
                  required
                  className="w-full"
                />
                {media.mainImage && (
                  <p className="text-sm text-green-600 mt-2">✓ {media.mainImage.name}</p>
                )}
              </div>
            </div>

            {/* Additional Images */}
            {["image1", "image2", "image3", "image4"].map((field, index) => (
              <div key={field}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FiImage className="text-blue-500" />
                  Image {index + 1}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleSingleFile(e, field)}
                    className="w-full text-sm"
                  />
                  {media[field] && (
                    <p className="text-sm text-blue-600 mt-2">✓ {media[field].name}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Other Images */}
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiImage className="text-purple-500" />
                Additional Images (Multiple)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-purple-500 transition">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleOtherImages}
                  className="w-full"
                />
                {media.otherimages.length > 0 && (
                  <p className="text-sm text-purple-600 mt-2">✓ {media.otherimages.length} files selected</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding Stay...
              </>
            ) : (
              <>
                <FiPlus size={18} />
                Add Stay
              </>
            )}
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" />
    </div>
  ) : (
    <div>
      <VendorRegister categorytype={"stays"} token={token} />
    </div>
  );
};

export default AddTrending;
