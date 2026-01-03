import React from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const AddSafari = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
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

  const [mainImage, setMainImage] = useState(null);
  const [otherimages, setOtherimages] = useState([]);
  const [shortVideo, setShortVideo] = useState(null);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [guiderImage, setGuiderImage] = useState(null); // Fixed: proper useState

  const handleData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value.split(",").map((item) => item.trim()),
    });
  };

  const handleTeamMembersChange = (e) => {
    setFormData({ ...formData, TeamMembers: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Fixed: prevention() → preventDefault()

    if (!mainImage) {
      toast.error("Main image is required");
      return;
    }

    const data = new FormData();

    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
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

    // Append files
    data.append("mainImage", mainImage);
    if (shortVideo) data.append("shortvideo", shortVideo);
    if (guiderImage) data.append("GuiderImage", guiderImage);

    vehicleImages.forEach((img) => data.append("vehicleImage", img));
    otherimages.forEach((img) => data.append("otherimages", img));

    // Debugging: log FormData entries and file state
    for (let pair of data.entries()) {
      console.log("formData entry:", pair[0], pair[1]);
    }
    console.log("mainImage state:", mainImage);
    console.log("vehicleImages length:", vehicleImages.length);
    console.log("otherimages length:", otherimages.length);

    try {
      toast.loading("Uploading safari package...");
      await axios.post(`${backendUrl}/api/safari/addsafari`, data);
      toast.dismiss();
      toast.success("Safari package added successfully");

      // Optional: Reset form after success
      setFormData({
        name: "",
        description: "",
        price: "",
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
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error adding safari package"
      );
    }
  };

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
        {/* Basic Info */}
        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4 md:col-span-2">
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
          ></textarea>
        </div>

        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Vehicle Type:
          </label>
          <input
            type="text"
            name="VehicleType"
            value={formData.VehicleType}
            onChange={handleData}
            className="w-full p-3 border border-gray-300 rounded"
            required
          />
        </div>

        {/* Arrays - comma separated */}
        <div className="mb-4">
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

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Included Places (comma separated):
          </label>
          <input
            type="text"
            name="includeplaces"
            value={formData.includeplaces.join(", ")}
            onChange={handleArrayChange}
            placeholder="e.g. Jim Corbett, Ranthambore, Bandhavgarh"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* Guide Info */}
        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4 md:col-span-2">
          <label className="block text-gray-700 font-medium mb-2">
            Team Members (count):
          </label>
          <input
            type="number"
            name="TeamMembers"
            value={formData.TeamMembers}
            onChange={handleTeamMembersChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        {/* File Uploads */}
        <div className="mb-4 md:col-span-2">
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

        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4">
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

        <div className="mb-4">
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
