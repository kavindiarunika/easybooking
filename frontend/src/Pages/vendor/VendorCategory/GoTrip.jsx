import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../../App.jsx";
import { safa } from "../../../assets/safari.js";
const GoTrip = () => {
  const navigate = useNavigate();

  // UI State
  const [adventuresInput, setAdventuresInput] = useState("");
  const [includeplacesInput, setIncludeplacesInput] = useState("");
  const [hasProfile, setHasProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [safariData, setSafariData] = useState({
    name: "",
    description: "",
    category: "",
    type: [],
    price: "",
    totalDays: "",
    VehicleType: "",
    email: "",
    whatsapp: "",
    GuiderName: "",
    GuiderExperience: "",
    TeamMembers: "",
  });

  const [typeError, setTypeError] = useState(false);

  // Helper to resolve type options for a given selected category.
  // This handles both exact keys in `safa` and simpler category values by attempting a fuzzy match.
  const getTypesForCategory = (category) => {
    if (!category) return [];
    if (safa[category]) return safa[category].type || [];
    const found = Object.keys(safa).find((k) =>
      k.toLowerCase().includes(String(category).toLowerCase())
    );
    return found ? safa[found].type || [] : [];
  };

  const toggleType = (t) => {
    setSafariData((prev) => {
      const exists = prev.type.includes(t);
      return {
        ...prev,
        type: exists ? prev.type.filter((x) => x !== t) : [...prev.type, t],
      };
    });
  };
  // File States
  const [mainImage, setMainImage] = useState(null);
  const [otherimages, setOtherimages] = useState([]);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [guiderImage, setGuiderImage] = useState(null);
  // Short video (optional)
  const [shortVideo, setShortVideo] = useState(null);

  const storedToken =
    localStorage.getItem("vendorToken") || localStorage.getItem("adminToken");

  const getEmailFromToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])).email;
    } catch {
      return null;
    }
  };

  const vendorEmail = storedToken ? getEmailFromToken(storedToken) : null;

  useEffect(() => {
    if (vendorEmail) {
      fetchProfile();
    }
  }, [vendorEmail]);

  // Ref to focus the Package Name input when creating a new profile
  const nameInputRef = useRef(null);

  useEffect(() => {
    if (hasProfile === false) {
      nameInputRef.current?.focus();
    }
  }, [hasProfile]);

  const fetchProfile = async () => {
    if (!vendorEmail) {
      setHasProfile(false);
      return;
    }

    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/safari/safari?ownerEmail=${vendorEmail}`,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      if (response.data && response.data._id) {
        setHasProfile(true);
        setSafariData(response.data);
        setAdventuresInput((response.data.adventures || []).join(", "));
        setIncludeplacesInput((response.data.includeplaces || []).join(", "));
      } else {
        setHasProfile(false);
      }
    } catch (error) {
      // If backend returns 404 it means no profile exists for this vendor — treat as empty profile
      if (error.response?.status === 404) {
        console.info("No profile found for vendor:", vendorEmail);
        toast.info("No profile found — you can create your profile below.");
        setHasProfile(false);
      } else {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile. Please try again later.");
        setHasProfile(false);
      }
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    console.debug("GoTrip: handlesubmit called", {
      hasProfile,
      safariData,
      mainImage,
      adventuresInput,
      includeplacesInput,
    });

    // Client-side validation to avoid server 400 errors
    if (!safariData.name || !safariData.description || !safariData.category) {
      toast.error("Please fill required fields: name, description, category");
      return;
    }

    // ensure types (at least one) and adventures/includeplaces provided
    if (!(safariData.type && safariData.type.length > 0)) {
      setTypeError(true);
      toast.error("Please select at least one type for the selected category");
      // Clear the error after a short delay, so it's not permanent
      setTimeout(() => setTypeError(false), 5000);
      return;
    }
    if (!adventuresInput || !includeplacesInput) {
      toast.error(
        "Please provide adventures and places to include (comma separated)"
      );
      return;
    }

    if (!hasProfile && !mainImage) {
      toast.error("Please upload a main image before creating a profile");
      return;
    }

    setSubmitting(true);
    const data = new FormData();

    Object.keys(safariData).forEach((key) => {
      if (
        ![
          "type",
          "adventures",
          "includeplaces",
          "_id",
          "mainImage",
          "GuiderImage",
          "vehicleImage",
          "otherimages",
        ].includes(key)
      ) {
        data.append(key, safariData[key]);
      }
    });

    data.append("ownerEmail", vendorEmail);
    if (safariData.type && safariData.type.length > 0) {
      safariData.type.forEach((t) => data.append("type", t));
    }
    adventuresInput
      .split(",")
      .forEach((i) => i.trim() && data.append("adventures", i.trim()));
    includeplacesInput
      .split(",")
      .forEach((i) => i.trim() && data.append("includeplaces", i.trim()));

    if (mainImage) data.append("mainImage", mainImage);
    if (guiderImage) data.append("GuiderImage", guiderImage);
    if (shortVideo) data.append("shortvideo", shortVideo);
    if (vehicleImages && vehicleImages.length > 0) {
      vehicleImages.forEach((img) => data.append("vehicleImage", img));
    }
    if (otherimages && otherimages.length > 0) {
      otherimages.forEach((img) => data.append("otherimages", img));
    }

    try {
      const config = { headers: { Authorization: `Bearer ${storedToken}` } };
      if (hasProfile) {
        await axios.put(
          `${BACKEND_URL}/api/safari/updatesafari/${safariData._id}`,
          data,
          config
        );
        toast.success("Profile Updated Successfully!");
      } else {
        await axios.post(`${BACKEND_URL}/api/safari/addsafari`, data, config);
        toast.success("Profile Created Successfully!");
      }
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      const message = err.response?.data?.message || "Error saving profile";
      // If backend returns missing field list, show them in toast to guide the user
      if (err.response?.status === 400 && err.response?.data?.missing) {
        toast.error(`${message}: ${err.response.data.missing.join(", ")}`);
      } else {
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Check if user is authenticated
  if (!storedToken || !vendorEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please login first to create or edit your profile.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Checking profile status
  if (hasProfile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Checking Profile Status...
          </h2>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- VIEW 1: PROFILE DASHBOARD (If profile exists and NOT editing) ---
  if (hasProfile && !isEditing) {
    return (
      <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 mb-10">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Your Safari Profile
            </h2>
            <p className="text-gray-500 text-sm mt-1">Email: {vendorEmail}</p>
          </div>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition"
          >
            Edit Account Details
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              Package Name
            </p>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {safariData.name || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              Price
            </p>
            <p className="text-xl font-bold text-black mt-2">
              Rs. {safariData.price || "N/A"}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              Status
            </p>
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold inline-block mt-2">
              ✓ Active
            </span>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-500 text-sm font-semibold uppercase">
              Total Days
            </p>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {safariData.totalDays || "N/A"} Days
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
            <h3 className="font-bold text-blue-900 mb-2">
               Locations ({safariData.includeplaces?.length || 0})
            </h3>
            <p className="text-gray-700">
              {(safariData.includeplaces || []).join(", ") ||
                "No locations added"}
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-600">
            <h3 className="font-bold text-orange-900 mb-2">
              Adventures ({safariData.adventures?.length || 0})
            </h3>
            <p className="text-gray-700">
              {(safariData.adventures || []).join(", ") ||
                "No adventures added"}
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">
               Guider Information
            </h3>
            <p className="text-gray-700">
              <strong>Name:</strong> {safariData.GuiderName || "N/A"}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Experience:</strong>{" "}
              {safariData.GuiderExperience || "N/A"} years
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-bold text-gray-800 mb-2">Contact Details</h3>
            <p className="text-gray-700">
              <strong>WhatsApp:</strong> {safariData.whatsapp || "N/A"}
            </p>
            <p className="text-gray-700 mt-2">
              <strong>Email:</strong> {safariData.email || "N/A"}
            </p>
          </div>
        </div>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-2">📝 Description</h3>
          <p className="text-gray-700">
            {safariData.description || "No description added"}
          </p>
        </div>
      </div>
    );
  }

  // --- VIEW 2: CREATE OR EDIT FORM ---
  return (
    <div className="max-w-5xl mx-auto bg-white p-8 shadow-xl rounded-2xl my-10 border border-gray-100 mb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-800">
          {hasProfile
            ? "Edit Your Safari Profile"
            : "Create Your Safari Profile"}
        </h2>
        {hasProfile && (
          <button
            onClick={() => setIsEditing(false)}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ✕ Cancel
          </button>
        )}
      </div>

      {/* Banner shown when no profile exists */}
      {!hasProfile && (
        <div
          className="mb-6 mt-2 rounded p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800"
          role="status"
          aria-live="polite"
        >
          No profile found for this account — fill the form below to create one.
        </div>
      )}

      <form onSubmit={handlesubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Package Name *
            </label>
            <input
              type="text"
              ref={nameInputRef}
              value={safariData.name}
              placeholder="e.g., Jungle Safari Adventure"
              onChange={(e) =>
                setSafariData({ ...safariData, name: e.target.value })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Price Rs.
            </label>
            <input
              type="number"
              value={safariData.price}
              placeholder="e.g., 5000"
              onChange={(e) =>
                setSafariData({ ...safariData, price: e.target.value })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Description *
          </label>
          <textarea
            value={safariData.description}
            placeholder="Describe your safari package in detail..."
            onChange={(e) =>
              setSafariData({ ...safariData, description: e.target.value })
            }
            required
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Category *
          </label>
          <select
            value={safariData.category}
            onChange={(e) =>
              setSafariData({
                ...safariData,
                category: e.target.value,
                type: [],
              })
            }
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {/* Offer categories from the canonical `safa` map but allow free-form previous values */}
            {Object.keys(safa).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Types for the selected category */}
        {safariData.category && (
          <div className="mt-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Type (select one or more) *
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getTypesForCategory(safariData.category).length > 0 ? (
                getTypesForCategory(safariData.category).map((t) => (
                  <label
                    key={t}
                    className="inline-flex items-center space-x-2 text-gray-700"
                  >
                    <input
                      type="checkbox"
                      checked={safariData.type.includes(t)}
                      onChange={() => toggleType(t)}
                      className="form-checkbox h-4 w-4 text-blue-600"
                    />
                    <span>{t}</span>
                  </label>
                ))
              ) : (
                <p className="text-sm text-gray-500">
                  No types available for this category. Please choose a
                  different category.
                </p>
              )}
            </div>

            {typeError && (
              <p className="text-red-600 text-sm mt-2">
                Please select at least one type for the selected category.
              </p>
            )}
          </div>
        )}

        {/* Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Total Days *
            </label>
            <input
              type="number"
              value={safariData.totalDays}
              placeholder="e.g., 3"
              onChange={(e) =>
                setSafariData({ ...safariData, totalDays: e.target.value })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Type *
            </label>
            <select
              value={safariData.VehicleType}
              onChange={(e) =>
                setSafariData({ ...safariData, VehicleType: e.target.value })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
              <option value="Jeep">Jeep</option>
              <option value="Van">Van</option>
              <option value="MiniBus">Mini Bus</option>
              <option value="Bus">Bus</option>
              <option value="Pickup">Pickup Truck</option>
              <option value="Truck">Truck</option>

              {/* Two / Three Wheel */}
              <option value="Motorbike">Motorbike</option>
              <option value="Scooter">Scooter</option>
              <option value="Bicycle">Bicycle</option>
              <option value="ElectricBike">Electric Bike</option>
              <option value="TukTuk">Tuk Tuk</option>
              <option value="ATV">ATV / Quad Bike</option>

              <option value="Boat">Boat</option>
              <option value="SpeedBoat">Speed Boat</option>
              <option value="JetSki">Jet Ski</option>
              <option value="Canoe">Canoe</option>
              <option value="Kayak">Kayak</option>
              <option value="Yacht">Yacht</option>

              <option value="SafariJeep">Safari Jeep</option>
              <option value="CamperVan">Camper Van</option>
              <option value="Caravan">Caravan</option>
              <option value="LuxuryCar">Luxury Car</option>
              <option value="OffRoad">Off Road Vehicle</option>

              <option value="Helicopter">Helicopter</option>
              <option value="HotAirBalloon">Hot Air Balloon</option>
            </select>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email *
            </label>
            <input
              type="email"
              value={safariData.email}
              placeholder="your@email.com"
              onChange={(e) =>
                setSafariData({ ...safariData, email: e.target.value })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              WhatsApp Number *
            </label>
            <input
              type="tel"
              value={safariData.whatsapp}
              placeholder="e.g., +919876543210"
              onChange={(e) =>
                setSafariData({ ...safariData, whatsapp: e.target.value })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Guider Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Guider Name *
            </label>
            <input
              type="text"
              value={safariData.GuiderName}
              placeholder="e.g., John Doe"
              onChange={(e) =>
                setSafariData({ ...safariData, GuiderName: e.target.value })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Guider Experience (years) *
            </label>
            <input
              type="number"
              value={safariData.GuiderExperience}
              placeholder="e.g., 5"
              onChange={(e) =>
                setSafariData({
                  ...safariData,
                  GuiderExperience: e.target.value,
                })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Team Members */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Team Members *
          </label>
          <input
            type="number"
            value={safariData.TeamMembers}
            placeholder="e.g., 4"
            onChange={(e) =>
              setSafariData({ ...safariData, TeamMembers: e.target.value })
            }
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Images upload fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Main Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Guider Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGuiderImage(e.target.files[0])}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Short Video (optional)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setShortVideo(e.target.files[0])}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional short promotional video (max 50MB).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Vehicle Images (multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setVehicleImages(Array.from(e.target.files))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Other Images (multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setOtherimages(Array.from(e.target.files))}
              className="w-full"
            />
          </div>
        </div>

        {/* Places to Include */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Places to Include (comma separated) *
          </label>
          <textarea
            value={includeplacesInput}
            placeholder="e.g., Ranthambore, Bandhavgarh, Pench"
            onChange={(e) => setIncludeplacesInput(e.target.value)}
            required
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Adventures */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Adventures (comma separated) *
          </label>
          <textarea
            value={adventuresInput}
            placeholder="e.g., Jungle Trekking, Wildlife Photography, Camping"
            onChange={(e) => setAdventuresInput(e.target.value)}
            required
            rows="3"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t">
          <button
            type="submit"
            disabled={submitting}
            onClick={(e) => {
              // If browser validation fails, show native messages and an extra toast
              const form = e.currentTarget.form;
              if (form && !form.checkValidity()) {
                e.preventDefault();
                form.reportValidity();
                toast.error("Please fill the required fields to continue.");
              }
            }}
            className={`w-full py-4 rounded-xl text-white font-bold text-lg transition ${
              submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 active:scale-95"
            }`}
          >
            {submitting
              ? "Processing..."
              : hasProfile
              ? "Update Profile"
              : "Create Profile"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoTrip;
