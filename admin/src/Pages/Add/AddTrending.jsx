import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";

const AddTrending = ({ token }) => {
  const [formDataFields, setFormDataFields] = useState({
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
    ownerEmail: "",
    videoUrl: "",
    availableThings: "",
  });

  const [media, setMedia] = useState({
    mainImage: null,
    images: [],
  });

  // ------------------ HANDLE TEXT INPUT ------------------
  const handleInputChange = (e) => {
    setFormDataFields({
      ...formDataFields,
      [e.target.name]: e.target.value,
    });
  };

  // ------------------ HANDLE FILE INPUT ------------------
  const handleFileChange = (e, fieldName) => {
    // legacy single-file handlers still supported (keeps existing API)
    setMedia({
      ...media,
      [fieldName]: e.target.files[0],
    });
  };

  const handleMultipleFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setMedia((m) => ({ ...m, images: files }));
  };

  // ------------------ SUBMIT FORM ------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // require main image
    if (!media.mainImage) {
      toast.error("Main image is required!");
      return;
    }

    // require at least one additional image
    if (!media.images || media.images.length === 0) {
      toast.error("At least one additional image is required!");
      return;
    }

    const updatedFormData = {
      ...formDataFields,
      availableThings: formDataFields.availableThings
        ? formDataFields.availableThings.split(",").map((i) => i.trim())
        : [],
    };

    const formData = new FormData();

    // Append text fields
    Object.entries(updatedFormData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append media files
    // - append main image
    if (media.mainImage) formData.append("mainImage", media.mainImage);

    // - append multiple images under the `images` field
    if (media.images && media.images.length > 0) {
      media.images.forEach((file) => formData.append("images", file));
    }

    // Video URL is included in `formDataFields` and appended above

    try {
      const response = await axios.post(
        `${backendUrl}/api/trending/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Hotel added successfully!");

        // Reset fields
        setFormDataFields({
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
          ownerEmail: "",
          videoUrl: "",
          availableThings: "",
        });

        setMedia({
          mainImage: null,
          images: [],
        });

        document.querySelectorAll('input[type="file"]').forEach((input) => {
          input.value = "";
        });
      } else {
        toast.error(response.data.message || "Failed to add item.");
      }
    } catch (error) {
      console.error("Error uploading item:", error);
      toast.error(error.response?.data?.message || "Error uploading item");
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Add Hotel Details</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* TEXT INPUTS */}
        {Object.keys(formDataFields).map((key) => (
          <div key={key}>
            <label className="block text-gray-700 mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>

            {key === "category" ? (
              <select
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md outline-none"
                required
              >
                <option value="villa">Villa</option>
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="house">House</option>
              </select>
            ) : key === "rating" ? (
              <select
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md outline-none"
              >
                <option value="5">5 Star</option>
                <option value="4">4 Star</option>
                <option value="3">3 Star</option>
                <option value="2">2 Star</option>
                <option value="1">1 Star</option>
              </select>
            ) : key === "district" ? (
              <select
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md outline-none"
                required
              >
                <option value="">Select District</option>
                <option value="Colombo">Colombo</option>
                <option value="Galle">Galle</option>
                <option value="Kandy">Kandy</option>
                <option value="Jaffna">Jaffna</option>
                <option value="Matara">Matara</option>
                <option value="Negombo">Negombo</option>
                <option value="Anuradhapura">Anuradhapura</option>
                <option value="Trincomalee">Trincomalee</option>
                <option value="Batticaloa">Batticaloa</option>
                <option value="Ampara">Ampara</option>
                <option value="Nuwara Eliya">Nuwara Eliya</option>
                <option value="Ratnapura">Ratnapura</option>
                <option value="Badulla">Badulla</option>
                <option value="Kurunegala">Kurunegala</option>
                <option value="Puttalam">Puttalam</option>
                <option value="Vavuniya">Vavuniya</option>
                <option value="Mullativu">Mullativu</option>
                <option value="Monaragala">Monaragala</option>
                <option value="Matale">Matale</option>
                <option value="Kegalle">Kegalle</option>
                <option value="Polonnaruwa">Polonnaruwa</option>
                <option value="Hambantota">Hambantota</option>
                <option value="Gampaha">Gampaha</option>
                <option value="Kalutara">Kalutara</option>
              </select>
            ) : key === "price" ? (
              <input
                type="number"
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md outline-none"
                required
                placeholder="Enter price (e.g., 5000)"
                min="0"
                step="0.01"
              />
            ) : (
              <input
                type={key === "ownerEmail" ? "email" : "text"}
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded-md outline-none"
                required={[
                  "name",
                  "description",
                  "category",
                  "district",
                  "price",
                  "ownerEmail",
                ].includes(key)}
                placeholder={
                  key === "availableThings" ? "Comma separated items" : ""
                }
              />
            )}
          </div>
        ))}

        {/* MAIN IMAGE UPLOAD */}
        <div className="border p-3 rounded-md bg-blue-50">
          <label className="block text-gray-700 mb-2 font-semibold">
            Main Image (Required - Used on Cards)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setMedia({ ...media, mainImage: e.target.files[0] })
            }
            required
          />
          <p className="text-sm text-gray-600 mt-2">
            This image will be displayed on hotel cards.
          </p>
        </div>

        {/* ADDITIONAL IMAGES UPLOAD */}
        <div className="border p-3 rounded-md">
          <label className="block text-gray-700 mb-2 font-semibold">
            Additional Hotel Images (Required)
          </label>
          <input
            key="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleMultipleFiles}
            required
          />
          <p className="text-sm text-gray-500 mt-2">
            Upload additional images for the gallery. Users can click the "+N"
            badge to view all.
          </p>
        </div>

        {/* VIDEO URL */}
        <div className="border p-3 rounded-md">
          <label className="block text-gray-700 mb-1 font-semibold">
            Optional Hotel Promotional Video URL
          </label>
          <div>
            <input
              type="url"
              name="videoUrl"
              value={formDataFields.videoUrl}
              onChange={handleInputChange}
              placeholder="https://example.com/video.mp4"
              className="w-full border px-3 py-2 rounded-md outline-none"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Provide a direct video URL (e.g., .mp4) or any valid link.
          </p>
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
