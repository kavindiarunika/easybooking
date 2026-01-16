import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const AddTraveling = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    district: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [otherimages, setOtherimages] = useState([]);
  const [loading, setLoading] = useState(false);

  const changeHandle = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mainImage) {
      toast.error("Main image is required");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("district", formData.district);
    data.append("mainImage", mainImage);
    otherimages.forEach((img) => data.append("otherimages", img));

    try {
      setLoading(true);
      toast.loading("Uploading travel place...");

      await axios.post(`${backendUrl}/api/travelplaces/addtravelplace`, data, {
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      toast.dismiss();
      toast.success("Travel place added successfully");

      setFormData({ name: "", description: "", district: "" });
      setMainImage(null);
      setImages([]);
    } catch (error) {
      toast.dismiss();
      toast.error("Error adding travel place");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Add Traveling Place
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Place Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={changeHandle}
              placeholder="Sigiriya"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={changeHandle}
              placeholder="Ancient rock fortress..."
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            />
          </div>

          {/* District */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              District
            </label>
            <select
              name="district"
              value={formData.district}
              onChange={changeHandle}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
              required
            >
              <option value="">Select district</option>
              <option value="colombo">Colombo</option>
              <option value="galle">Galle</option>
              <option value="kandy">Kandy</option>
              <option value="nuwaraeliya">Nuwara Eliya</option>
              <option value="jaffna">Jaffna</option>
              <option value="matale">Matale</option>
              <option value="trincomalee">Trincomalee</option>
              <option value="anuradhapura">Anuradhapura</option>
              <option value="polonnaruwa">Polonnaruwa</option>
              <option value="hambantota">Hambantota</option>
              <option value="badulla">Badulla</option>
              <option value="monaragala">Monaragala</option>
              <option value="gampaha">Gampaha</option>
              <option value="kalutara">Kalutara</option>
              <option value="ratnapura">Ratnapura</option>
              <option value="kegalle">Kegalle</option>
              <option value="puttalam">Puttalam</option>
              <option value="kurunegala">Kurunegala</option>
              <option value="dambulla">Dambulla</option>
              <option value="kalutara">Kaluthara</option>
            </select>
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Main Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0])}
              className="w-full text-gray-700"
              required
            />
          </div>

          {/* Gallery Images */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Gallery Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setOtherimages([...e.target.files])}
              className="w-full text-gray-700"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Add Travel Place"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTraveling;
