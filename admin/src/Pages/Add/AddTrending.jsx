import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";

const AddTrending = ({ token }) => {
  // State
  const [name, setName] = useState("");
  const [subname, setSubname] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [highlights, setHighlights] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [availableThings, setAvailableThings] = useState("");

  // Media states
  const [image, setImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [image6, setImage6] = useState(null);
  const [video, setVideo] = useState(null);

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Main image is required!");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("subname", subname);
    formData.append("description", description);
    formData.append("location", location);
    formData.append("highlights", highlights);
    formData.append("address", address);
    formData.append("contact", contact);
    formData.append("availableThings", availableThings);

    // Append images
    formData.append("image", image);
    if (image1) formData.append("image1", image1);
    if (image2) formData.append("image2", image2);
    if (image3) formData.append("image3", image3);
    if (image4) formData.append("image4", image4);
    if (image5) formData.append("image5", image5);
    if (image6) formData.append("image6", image6);

    // Append video
    if (video) formData.append("video", video);

    try {
      const response = await axios.post(`${backendUrl}/api/trending/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        toast.success("Hotel added successfully!");

        // Reset text fields
        setName("");
        setSubname("");
        setDescription("");
        setLocation("");
        setHighlights("");
        setAddress("");
        setContact("");
        setAvailableThings("");

        // Reset media states
        setImage(null);
        setImage1(null);
        setImage2(null);
        setImage3(null);
        setImage4(null);
        setImage5(null);
        setImage6(null);
        setVideo(null);

        // Clear file inputs
        document
          .querySelectorAll('input[type="file"]')
          .forEach((input) => (input.value = ""));
      } else {
        toast.error(response.data.message || "Failed to add item.");
      }
    } catch (error) {
      console.error("Error uploading item:", error);
      const errorMessage = error.response?.data?.message || "Error uploading item";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Hotel Details</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Basic Text fields */}
        <div>
          <label className="block text-gray-700 mb-1">Hotel Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Tagline / Subtitle (e.g., Luxury Resort, Boutique Hotel)
          </label>
          <input
            type="text"
            value={subname}
            onChange={(e) => setSubname(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Full Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded-md outline-none min-h-[80px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">
              General Location (e.g., City, District)
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full border px-3 py-2 rounded-md outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">
              Key Selling Points / Highlights
            </label>
            <input
              type="text"
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
              className="w-full border px-3 py-2 rounded-md outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-1">Full Street Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full border px-3 py-2 rounded-md outline-none"
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-1">Contact Phone/Email</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full border px-3 py-2 rounded-md outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-1">
            Available Amenities / Facilities (e.g., Spa, Gym, Free Wi-Fi, Pool)
          </label>
          <input
            type="text"
            value={availableThings}
            onChange={(e) => setAvailableThings(e.target.value)}
            className="w-full border px-3 py-2 rounded-md outline-none"
          />
        </div>

        {/* Media Uploads */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-medium">Media Uploads</label>

          {/* Video Upload */}
          <div className="border p-3 rounded-md">
            <label className="block text-gray-700 mb-1 font-semibold">
              Optional Hotel Promotional Video (.mp4, .mov, etc.)
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideo(e.target.files[0])}
            />
          </div>

          {/* Image Uploads */}
          <div className="border p-3 rounded-md">
            <label className="block text-gray-700 mb-2 font-semibold">
              Hotel Images (Main Image is Required)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage1(e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage2(e.target.files[0])}
              /> {/* ✅ FIXED LINE */}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage3(e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage4(e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage5(e.target.files[0])}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage6(e.target.files[0])}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 mt-4"
        >
          Add Hotel
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={4000} />
    </div>
  );
};

export default AddTrending;
