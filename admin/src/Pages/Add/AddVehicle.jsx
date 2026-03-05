import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddVehicle = ({ token }) => {
  const [vehicleData, setVehicleData] = useState({
    name: "",
    Price: "",
    type: "",
    description: "",
    discrict: "",
    passagngers: "",
    facilities: "",
    whatsapp: "",
    ownerEmail: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicleData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImage = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleOtherImages = (e) => {
    const files = Array.from(e.target.files);
    setOtherImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic validation: only fields that are required by backend schema plus ownerEmail
    if (
      !vehicleData.name ||
      !vehicleData.Price ||
      !vehicleData.type ||
      !vehicleData.district ||
      !vehicleData.whatsapp ||
      !vehicleData.ownerEmail
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!mainImage) {
      toast.error("Main image is required");
      return;
    }

    if (otherImages.length === 0) {
      toast.error("Please select at least one other image");
      return;
    }

    const formData = new FormData();
    Object.entries(vehicleData).forEach(([key, val]) => {
      formData.append(key, val);
    });

    formData.append("mainImage", mainImage);
    otherImages.forEach((img) => formData.append("otherImages", img));

    try {
      setLoading(true);
      const res = await axios.post(
        `${backendUrl}/api/vehicle/addvehicle`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        toast.success("Vehicle added successfully");
        // reset form
        setVehicleData({
          name: "",
          Price: "",
          type: "",
          description: "",
          discrict: "",
          passagngers: "",
          facilities: "",
          whatsapp: "",
          ownerEmail: "",
        });
        setMainImage(null);
        setOtherImages([]);
        setTimeout(() => navigate("/"), 1500);
      } else {
        toast.error(res.data.message || "Failed to add vehicle");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error adding vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Add New Vehicle
      </h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={vehicleData.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price (Rs) *
            </label>
            <input
              type="number"
              name="Price"
              value={vehicleData.Price}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Type *
            </label>

            <select
              name="type"
              value={vehicleData.type}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded bg-white"
              required
            >
              <option value="">Select vehicle type</option>

              <option value="Car">Car</option>
              <option value="Van">Van</option>
              <option value="SUV">SUV</option>
              <option value="Pickup Truck">Pickup Truck</option>
              <option value="Bus">Bus</option>
              <option value="Mini Bus">Mini Bus</option>
              <option value="Lorry">Lorry</option>
              <option value="Tipper">Tipper</option>
              <option value="Three Wheeler">Three Wheeler</option>
              <option value="Motorbike">Motorbike</option>
              <option value="Scooter">Scooter</option>
              <option value="Bicycle">Bicycle</option>
              <option value="Electric Car">Electric Car</option>
              <option value="Electric Bike">Electric Bike</option>
              <option value="Tractor">Tractor</option>
              <option value="Trailer">Trailer</option>
              <option value="Crane">Crane</option>
              <option value="Forklift">Forklift</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Fire Truck">Fire Truck</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={vehicleData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              District *
            </label>

            <select
              name="district"
              value={vehicleData.district}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded bg-white"
              required
            >
              <option value="">Select district</option>

              <option value="Ampara">Ampara</option>
              <option value="Anuradhapura">Anuradhapura</option>
              <option value="Badulla">Badulla</option>
              <option value="Batticaloa">Batticaloa</option>
              <option value="Colombo">Colombo</option>
              <option value="Galle">Galle</option>
              <option value="Gampaha">Gampaha</option>
              <option value="Hambantota">Hambantota</option>
              <option value="Jaffna">Jaffna</option>
              <option value="Kalutara">Kalutara</option>
              <option value="Kandy">Kandy</option>
              <option value="Kegalle">Kegalle</option>
              <option value="Kilinochchi">Kilinochchi</option>
              <option value="Kurunegala">Kurunegala</option>
              <option value="Mannar">Mannar</option>
              <option value="Matale">Matale</option>
              <option value="Matara">Matara</option>
              <option value="Monaragala">Monaragala</option>
              <option value="Mullaitivu">Mullaitivu</option>
              <option value="Nuwara Eliya">Nuwara Eliya</option>
              <option value="Polonnaruwa">Polonnaruwa</option>
              <option value="Puttalam">Puttalam</option>
              <option value="Ratnapura">Ratnapura</option>
              <option value="Trincomalee">Trincomalee</option>
              <option value="Vavuniya">Vavuniya</option>
            </select>
          </div>
          {/* owner email field */}
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Owner Email *
            </label>
            <input
              type="email"
              name="ownerEmail"
              value={vehicleData.ownerEmail}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Passengers *
            </label>
            <input
              type="number"
              name="passagngers"
              value={vehicleData.passagngers}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Facilities (comma separated) *
            </label>
            <input
              type="text"
              name="facilities"
              value={vehicleData.facilities}
              onChange={handleChange}
              placeholder="e.g., AC, music system, GPS"
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              WhatsApp Contact *
            </label>
            <input
              type="text"
              name="whatsapp"
              value={vehicleData.whatsapp}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded"
              required
            />
          </div>
          {/* Image uploads */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Main Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImage}
              className="w-full"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-gray-700 font-medium mb-2">
              Other Images *
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleOtherImages}
              className="w-full"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          disabled={loading}
        >
          {loading ? "Adding Vehicle..." : "Add Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;
