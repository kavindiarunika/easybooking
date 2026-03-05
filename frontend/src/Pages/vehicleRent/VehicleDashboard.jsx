import React, { useEffect, useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const VehicleDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // add-vehicle form state
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    Price: "",
    type: "",
    description: "",
    district: "",
    passagngers: "",
    facilities: "",
    whatsapp: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [otherImages, setOtherImages] = useState([]);
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("vehicleToken");
    if (!token) {
      navigate("/vehiclesignup");
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    // fetch profile first, then load only that user's vehicles
    api
      .get("/api/vehicle-auth/me", { headers })
      .then((profileRes) => {
        const user = profileRes.data.user;
        setProfile(user);
        // now fetch vehicles filtered on backend
        return api.get(
          `/api/vehicle/all?ownerEmail=${encodeURIComponent(user.email)}`,
          { headers },
        );
      })
      .then((vehiclesRes) => {
        setVehicles(Array.isArray(vehiclesRes.data) ? vehiclesRes.data : []);
      })
      .catch((err) => {
        console.error("Dashboard fetch error", err);
        setError("Failed to load dashboard data.");
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("vehicleToken");
          navigate("/vehiclesignup");
        }
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("vehicleToken");
    navigate("/vehiclesignup");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainImageChange = (e) => {
    setMainImage(e.target.files[0]);
  };

  const handleOtherImagesChange = (e) => {
    setOtherImages(Array.from(e.target.files));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      Price: "",
      type: "",
      description: "",
      discrict: "",
      passagngers: "",
      facilities: "",
      whatsapp: "",
    });
    setMainImage(null);
    setOtherImages([]);
    setSubmitError(null);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // simple validation
    if (
      !formData.name ||
      !formData.Price ||
      !formData.type ||
      !formData.description ||
      !formData.district ||
      !formData.passagngers ||
      !formData.facilities ||
      !formData.whatsapp
    ) {
      setSubmitError("All fields are required");
      return;
    }

    if (!mainImage) {
      setSubmitError("Main image is required");
      return;
    }

    if (otherImages.length === 0) {
      setSubmitError("Please add at least one other image");
      return;
    }

    const token = localStorage.getItem("vehicleToken");
    const headers = { Authorization: `Bearer ${token}` };
    const fd = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      fd.append(key, val);
    });
    fd.append("mainImage", mainImage);
    otherImages.forEach((img) => fd.append("otherImages", img));

    try {
      setSubmitting(true);
      const res = await api.post("/api/vehicle/addvehicle", fd, { headers });
      if (res.data.success) {
        // append new vehicle to list
        setVehicles((prev) => [...prev, res.data.data]);
        resetForm();
        setShowForm(false);
      } else {
        setSubmitError(res.data.message || "Failed to add vehicle");
      }
    } catch (err) {
      console.error(err);
      setSubmitError(err.response?.data?.message || "Server error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="p-6">Loading dashboard…</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <div className="p-8 max-w-4xl mx-auto text-white">
      <p className="h-24"></p>
      <h1 className="text-3xl font-bold mb-4">Vehicle Dashboard</h1>
      {profile && (
        <div className=" flex gap-8 mb-6">
          <p>
            <strong className="text-green-200">Name:</strong> {profile.name}
          </p>
          <p>
            <strong className="text-green-200">Email:</strong> {profile.email}
          </p>
        </div>
      )}

      {/* add vehicle button/form */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setSubmitError(null);
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          {showForm ? "Cancel" : "Add Vehicle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-white">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white">Price *</label>
            <input
              type="number"
              name="Price"
              value={formData.Price}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded bg-gray-800 text-white"
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
          <div>
            <label className="block text-white">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              rows="3"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              District *
            </label>

            <select
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded"
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
          <div>
            <label className="block text-white">Passengers *</label>
            <input
              type="text"
              name="passagngers"
              value={formData.passagngers}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white">
              Facilities (comma separated) *
            </label>
            <input
              type="text"
              name="facilities"
              value={formData.facilities}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white">WhatsApp *</label>
            <input
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white">Main Image *</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleMainImageChange}
              className="w-full text-white"
              required
            />
          </div>
          <div>
            <label className="block text-white">Other Images *</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleOtherImagesChange}
              className="w-full text-white"
              required
            />
          </div>
          {submitError && <p className="text-red-400">{submitError}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {submitting ? "Saving..." : "Save Vehicle"}
          </button>
        </form>
      )}

      {/* user vehicles list */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Vehicles</h2>
        {vehicles.length === 0 ? (
          <p className="text-gray-400">You haven't added any vehicles yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vehicles.map((veh) => (
              <div key={veh._id} className="bg-gray-800 p-4 rounded shadow">
                {veh.mainImage && (
                  <img
                    src={veh.mainImage}
                    alt={veh.name}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h3 className="text-xl font-bold mb-1">{veh.name}</h3>
                <p className="text-sm">
                  <strong>Type:</strong> {veh.type}
                </p>
                <p className="text-sm">
                  <strong>Price:</strong> Rs {veh.Price}
                </p>
                <p className="text-sm text-gray-300 truncate">
                  {veh.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={handleLogout}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  );
};

export default VehicleDashboard;
