
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import { 
  FiHome, FiFileText, FiTag, FiStar, FiDollarSign, FiMapPin, 
  FiPhone, FiMail, FiVideo, FiList, FiImage, FiGlobe, FiMap,
  FiUpload, FiEdit2, FiX
} from "react-icons/fi";

// Location Data
const locationData = {
  "Sri Lanka": {
    "Western Province": ["Colombo", "Gampaha", "Kalutara"],
    "Central Province": ["Kandy", "Matara", "Nuwara Eliya"],
    "Southern Province": ["Galle", "Matara", "Hambantota"],
    "Northern Province": ["Jaffna", "Mullaitivu"],
    "Eastern Province": ["Trincomalee", "Batticaloa", "Ampara"],
    "North Western Province": ["Kurunegala", "Puttalam"],
    "North Central Province": ["Polonnaruwa", "Anuradhapura"],
    "Uva Province": ["Badulla", "Monaragala"],
    "Sabaragamuwa Province": ["Ratnapura", "Kegalle"],
  },
};

const getDistricts = (country) => {
  return Object.keys(locationData[country] || {});
};

const getCities = (country, district) => {
  return locationData[country]?.[district] || [];
};

const EditTrending = ({ token }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});

  // image states (MATCH BACKEND)
  const [media, setMedia] = useState({
    mainImage: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    otherimages: []
  });

  // ---------- FETCH ----------
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/trending/trenddata`);
      setItems(res.data || []);
      setFilteredItems(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch trending items");
    } finally {
      setLoading(false);
    }
  };

  // ---------- SELECT ----------
  const selectItem = (it) => {
    setSelected(it._id);
    setForm({
      name: it.name || "",
      description: it.description || "",
      category: it.category || "villa",
      rating: it.rating || 5,
      country: it.country || "",
      district: it.district || "",
      city: it.city || "",
      price: it.price || 0,
      location: it.location || "",
      highlights: it.highlights || "",
      address: it.address || "",
      contact: it.contact || "",
      ownerEmail: it.ownerEmail || "",
      videoUrl: it.videoUrl || "",
      availableThings: (it.availableThings || []).join(", "),
      count: it.count ?? 0,
    });

    setMedia({
      mainImage: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      otherimages: []
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------- INPUT ----------
  const handleInput = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSingleFile = (e, field) => {
    setMedia((m) => ({ ...m, [field]: e.target.files[0] || null }));
  };

  const handleOtherImages = (e) => {
    setMedia((m) => ({
      ...m,
      otherimages: Array.from(e.target.files || []),
    }));
  };

  const handleCountryChange = (e) => {
    const country = e.target.value;
    setForm((p) => ({ ...p, country, district: "", city: "" }));
  };

  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setForm((p) => ({ ...p, district, city: "" }));
  };

  // ---------- SEARCH ----------
  useEffect(() => {
    const t = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return setFilteredItems(items);

      setFilteredItems(
        items.filter((it) =>
          [it.name, it.district, it.address, it.ownerEmail, it.description]
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
      );
    }, 250);

    return () => clearTimeout(t);
  }, [searchQuery, items]);

  const cancelEdit = () => {
    setSelected(null);
    setForm({});
  };

  // ---------- UPDATE ----------
  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const fd = new FormData();

    // text fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // images
    if (media.mainImage) fd.append("mainImage", media.mainImage);

    const orderedImages = ["image1", "image2", "image3", "image4"];

    orderedImages.forEach((f) => {
      if (media[f]) fd.append(f, media[f]);
    });

    if (media.otherimages.length > 0) {
      media.otherimages.forEach((file) => fd.append("otherimages", file));
    }

    try {
      const res = await axios.put(
        `${backendUrl}/api/trending/update/${selected}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Trending item updated");

        setItems((prev) =>
          prev.map((it) => (it._id === selected ? res.data.data : it))
        );

        cancelEdit();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating item");
    }
  };

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <FiEdit2 className="text-green-600" /> Edit Stay Listing
      </h2>
      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT: Stay List */}
        <div className="md:w-1/3 w-full space-y-4">
          <input
            placeholder="Search stays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 w-full p-3 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
          {loading && <p>Loading...</p>}
          <div className="space-y-3">
            {filteredItems.map((it) => (
              <div key={it._id} className={`rounded-xl border shadow-sm p-4 flex flex-col gap-1 bg-white ${selected === it._id ? 'ring-2 ring-green-500' : ''}`}>
                <div className="flex items-center gap-2">
                  <FiHome className="text-green-500" />
                  <span className="font-semibold text-lg">{it.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FiMapPin /> {it.district}, {it.country}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <FiMail /> {it.ownerEmail}
                </div>
                <button
                  onClick={() => selectItem(it)}
                  className="mt-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg flex items-center gap-1 hover:from-yellow-500 hover:to-yellow-600 transition"
                >
                  <FiEdit2 /> Edit
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Edit Form */}
        <div className="md:w-2/3 w-full">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <FiEdit2 size={48} />
              <p className="mt-2">Select a stay to edit</p>
            </div>
          ) : (
            <form onSubmit={submitUpdate} className="space-y-8">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiHome className="text-green-500" /> Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiHome className="text-blue-500" /> Property Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleInput}
                        required
                        placeholder="Enter property name"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    {/* Category */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiTag className="text-purple-500" /> Category
                      </label>
                      <select
                        name="category"
                        value={form.category}
                        onChange={handleInput}
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
                        <FiStar className="text-yellow-500" /> Rating
                      </label>
                      <select
                        name="rating"
                        value={form.rating}
                        onChange={handleInput}
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
                        <FiDollarSign className="text-green-500" /> Price (Rs.)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleInput}
                        required
                        placeholder="Enter price"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    {/* Owner Email */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiMail className="text-red-500" /> Owner Email
                      </label>
                      <input
                        type="email"
                        name="ownerEmail"
                        value={form.ownerEmail}
                        onChange={handleInput}
                        required
                        placeholder="owner@example.com"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiFileText className="text-indigo-500" /> Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleInput}
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
                    <FiMapPin className="text-red-500" /> Location Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Country */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiGlobe className="text-blue-500" /> Country
                      </label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleCountryChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      >
                        <option value="">Select Country</option>
                        {Object.keys(locationData).map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    {/* District */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiMap className="text-green-500" /> District
                      </label>
                      <select
                        name="district"
                        value={form.district}
                        onChange={handleDistrictChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      >
                        <option value="">Select District</option>
                        {getDistricts(form.country).map((district) => (
                          <option key={district} value={district}>{district}</option>
                        ))}
                      </select>
                    </div>
                    {/* City */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="text-purple-500" /> City
                      </label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleInput}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      >
                        <option value="">Select City</option>
                        {getCities(form.country, form.district).map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="text-orange-500" /> Full Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={form.address}
                        onChange={handleInput}
                        placeholder="Enter full address"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    {/* Google Maps Link */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiMapPin className="text-blue-500" /> Google Maps Link
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={form.location}
                        onChange={handleInput}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact & Additional Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiPhone className="text-green-500" /> Contact & Additional Info
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Contact */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiPhone className="text-green-500" /> Contact Number
                      </label>
                      <input
                        type="text"
                        name="contact"
                        value={form.contact}
                        onChange={handleInput}
                        placeholder="+94 77 123 4567"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    {/* Video URL */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiVideo className="text-red-500" /> Video URL (YouTube)
                      </label>
                      <input
                        type="text"
                        name="videoUrl"
                        value={form.videoUrl}
                        onChange={handleInput}
                        placeholder="https://youtube.com/..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                    {/* Highlights */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiStar className="text-yellow-500" /> Highlights
                      </label>
                      <textarea
                        name="highlights"
                        value={form.highlights}
                        onChange={handleInput}
                        rows={2}
                        placeholder="Key features and highlights..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition resize-none"
                      />
                    </div>
                    {/* Available Things */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiList className="text-indigo-500" /> Available Amenities (comma separated)
                      </label>
                      <input
                        type="text"
                        name="availableThings"
                        value={form.availableThings}
                        onChange={handleInput}
                        placeholder="WiFi, Pool, AC, Parking, Restaurant..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Images Section */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiImage className="text-pink-500" /> Property Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Main Image */}
                    <div className="md:col-span-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <FiUpload className="text-green-500" /> Main Image (Card Display)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-green-500 transition">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSingleFile(e, "mainImage")}
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
                          <FiImage className="text-blue-500" /> Image {index + 1}
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
                        <FiImage className="text-purple-500" /> Additional Images (Multiple)
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

                {/* Submit Buttons */}
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <FiX /> Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                  >
                    <FiEdit2 /> Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
        <ToastContainer position="top-center" />
      </div>
  );
};

export default EditTrending;
