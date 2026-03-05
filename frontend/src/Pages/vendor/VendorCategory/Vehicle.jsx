import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { BACKEND_URL } from "../../../App";

const Vehicle = ({ token }) => {
  const navigate = useNavigate();
  const storedToken =
    token ||
    localStorage.getItem("vendorToken") ||
    localStorage.getItem("adminToken");

  const getEmailFromToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])).email;
    } catch {
      return null;
    }
  };

  const vendorEmail = storedToken ? getEmailFromToken(storedToken) : "";

  const [formData, setFormData] = useState({
    name: "",
    Price: "",
    type: "",
    description: "",
    district: "",
    passagngers: "",
    facilities: "",
    whatsapp: "",
    ownerEmail: vendorEmail,
  });
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storedToken) return toast.error("You must be logged in");

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });
    if (mainImage) data.append("mainImage", mainImage);
    otherImages.forEach((file) => data.append("otherImages", file));

    try {
      setSubmitting(true);
      const res = await axios.post(
        `${BACKEND_URL}/api/vehicle/addvehicle`,
        data,
        {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Vehicle created successfully");
      navigate("/vendor/dashboard-vehicles");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add vehicle");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Add / Update Vehicle Rent Listing</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg">
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Vehicle name"
          required
          className="p-2 border rounded"
        />
        <input
          name="Price"
          value={formData.Price}
          onChange={handleChange}
          placeholder="Price"
          type="number"
          required
          className="p-2 border rounded"
        />
        <input
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Type (e.g., car, van)"
          required
          className="p-2 border rounded"
        />
        <input
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded"
        />
        <input
          name="district"
          value={formData.district}
          onChange={handleChange}
          placeholder="District"
          required
          className="p-2 border rounded"
        />
        <input
          name="passagngers"
          value={formData.passagngers}
          onChange={handleChange}
          placeholder="Passengers"
          type="number"
          className="p-2 border rounded"
        />
        <input
          name="facilities"
          value={formData.facilities}
          onChange={handleChange}
          placeholder="Facilities (comma separated)"
          className="p-2 border rounded"
        />
        <input
          name="whatsapp"
          value={formData.whatsapp}
          onChange={handleChange}
          placeholder="WhatsApp contact"
          required
          className="p-2 border rounded"
        />
        <div>
          <label className="block mb-1">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setMainImage(e.target.files[0])}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Other Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setOtherImages([...e.target.files])}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="bg-green-500 text-white py-2 px-4 rounded"
        >
          {submitting ? "Saving..." : "Save Vehicle"}
        </button>
      </form>
    </div>
  );
};

export default Vehicle;
