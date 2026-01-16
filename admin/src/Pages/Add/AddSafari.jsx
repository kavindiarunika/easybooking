import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { safa } from "../../assets/safari"; // Fixed typo: 'safa' → 'safa'

const AddSafari = ({ token }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: [], // This will store selected types (array of strings)
    adventures: [],
    includeplaces: [],
    TeamMembers: "",
    whatsapp: "",
    totalDays: "",
    email: "",
    VehicleType: "",
    GuiderName: "",
    GuiderExperience: "",
  });

  const location = useLocation();

  useEffect(() => {
    const ownerEmail = location?.state?.ownerEmail;
    if (ownerEmail) {
      setFormData((prev) => ({ ...prev, email: ownerEmail }));
    }
  }, [location]);

  const [mainImage, setMainImage] = useState(null);
  const [otherimages, setOtherimages] = useState([]);
  const [shortVideo, setShortVideo] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [guiderImage, setGuiderImage] = useState(null);
  const [categoryType, setCategoryType] = useState(""); // Selected category key

  const handleData = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    });
  };

  // Handle checkbox changes for 'type' array
  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, type: [...formData.type, value] });
    } else {
      setFormData({
        ...formData,
        type: formData.type.filter((t) => t !== value),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      toast.error("Main image is required");
      return;
    }

    const data = new FormData();

    // Append text fields
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("TeamMembers", formData.TeamMembers);
    data.append("whatsapp", formData.whatsapp);
    data.append("totalDays", formData.totalDays);
    data.append("email", formData.email);
    data.append("VehicleType", formData.VehicleType);
    data.append("GuiderName", formData.GuiderName);
    data.append("GuiderExperience", formData.GuiderExperience);

    // Append arrays
    formData.adventures.forEach((adventure) =>
      data.append("adventures", adventure)
    );
    formData.includeplaces.forEach((place) =>
      data.append("includeplaces", place)
    );
    formData.type.forEach((t) => data.append("type", t));

    // Append files
    data.append("mainImage", mainImage);
    if (shortVideo) data.append("shortvideo", shortVideo);
    if (guiderImage) data.append("GuiderImage", guiderImage);

    vehicleImages.forEach((img) => data.append("vehicleImage", img));
    otherimages.forEach((img) => data.append("otherimages", img));

    try {
      toast.loading("Uploading safari package...");
      await axios.post(`${backendUrl}/api/safari/addsafari`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      toast.dismiss();
      toast.success("Safari package added successfully");

      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        type: [],
        adventures: [],
        includeplaces: [],
        TeamMembers: "",
        whatsapp: "",
        totalDays: "",
        email: "",
        VehicleType: "",
        GuiderName: "",
        GuiderExperience: "",
      });
      setMainImage(null);
      setOtherimages([]);
      setShortVideo(null);
      setVehicleImages([]);
      setGuiderImage(null);
      setCategoryType("");
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error adding safari package"
      );
    }
  };

  // Get the types for the selected category
  const selectedCategoryTypes = categoryType
    ? safa[categoryType]?.type || []
    : [];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Add Safari Package
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Package Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Package Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Price (₹):
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Category Select + Dynamic Types */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Category:
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={(e) => {
              setCategoryType(e.target.value);
              handleData(e); // Updates formData.category
              setFormData((prev) => ({ ...prev, type: [] })); // Reset types when category changes
            }}
            className="w-full md:w-64 h-12 px-4 border-2 border-slate-300 rounded-xl text-black focus:outline-none focus:border-blue-500"
            required
          >
            <option value="">Select a category</option>
            {Object.keys(safa).map((key) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                {/* Nicer display */}
              </option>
            ))}
          </select>

          {/* Dynamic Type Checkboxes */}
          {selectedCategoryTypes.length > 0 && (
            <div className="mt-6">
              <label className="block text-gray-700 font-medium mb-3">
                Select Types (for {formData.category}):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {selectedCategoryTypes.map((t, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={t}
                      checked={formData.type.includes(t)}
                      onChange={handleTypeChange}
                      className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{t}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleData}
            rows="5"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        {/* Other fields... (kept same for brevity, but corrected) */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Total Days:
          </label>
          <input
            type="number"
            name="totalDays"
            value={formData.totalDays}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            WhatsApp Number:
          </label>
          <input
            type="text"
            name="whatsapp"
            value={formData.whatsapp}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Vehicle Type:
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded"
            name={"VehicleType"}
            value={formData.VehicleType}
            onChange={handleData}
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

            {/* Water Vehicles */}
            <option value="Boat">Boat</option>
            <option value="SpeedBoat">Speed Boat</option>
            <option value="JetSki">Jet Ski</option>
            <option value="Canoe">Canoe</option>
            <option value="Kayak">Kayak</option>
            <option value="Yacht">Yacht</option>

            {/* Special / Travel Use */}
            <option value="SafariJeep">Safari Jeep</option>
            <option value="CamperVan">Camper Van</option>
            <option value="Caravan">Caravan</option>
            <option value="LuxuryCar">Luxury Car</option>
            <option value="OffRoad">Off Road Vehicle</option>

            {/* Air (optional – only if you plan to support later) */}
            <option value="Helicopter">Helicopter</option>
            <option value="HotAirBalloon">Hot Air Balloon</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Adventures (comma separated):
          </label>
          <input
            type="text"
            name="adventures"
            value={formData.adventures.join(", ")}
            onChange={handleArrayChange}
            placeholder="e.g. Jeep Safari, Trekking, Bird Watching"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Included Places (comma separated):
          </label>
          <input
            type="text"
            name="includeplaces"
            value={formData.includeplaces.join(", ")}
            onChange={handleArrayChange}
            placeholder="e.g. Jim Corbett, Ranthambore"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Guide Name:
          </label>
          <input
            type="text"
            name="GuiderName"
            value={formData.GuiderName}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Guide Experience (years):
          </label>
          <input
            type="number"
            name="GuiderExperience"
            value={formData.GuiderExperience}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Team Members (count):
          </label>
          <input
            type="number"
            name="TeamMembers"
            value={formData.TeamMembers}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* File Uploads */}
        <div className="md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Main Image *:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImage(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Additional Images:
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setOtherimages(Array.from(e.target.files))}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Vehicle Images:
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setVehicleImages(Array.from(e.target.files))}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Guide Image:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setGuiderImage(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">
            Short Promo Video:
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setShortVideo(e.target.files[0])}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            Add Safari Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddSafari;
