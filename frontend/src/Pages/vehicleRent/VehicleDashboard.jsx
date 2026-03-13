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
  const [editingId, setEditingId] = useState(null);
  const [previewVehicle, setPreviewVehicle] = useState(null);
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

  const handleDeleteVehicle = async (id) => {
    if (!window.confirm("Delete this vehicle? This cannot be undone.")) return;

    const token = localStorage.getItem("vehicleToken");
    if (!token) {
      navigate("/vehiclesignup");
      return;
    }

    try {
      await api.delete(`/api/vehicle/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles((prev) => prev.filter((veh) => veh._id !== id));
    } catch (err) {
      console.error("Delete vehicle error", err);
      setError("Failed to delete vehicle. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const startEditingVehicle = (vehicle) => {
    setEditingId(vehicle._id);
    setFormData({
      name: vehicle.name || "",
      Price: vehicle.Price || "",
      type: vehicle.type || "",
      description: vehicle.description || "",
      district: vehicle.district || "",
      passagngers: vehicle.passagngers || "",
      facilities: Array.isArray(vehicle.facilities)
        ? vehicle.facilities.join(", ")
        : "",
      whatsapp: vehicle.whatsapp || "",
    });
    setMainImage(null);
    setOtherImages([]);
    setSubmitError(null);
    setShowForm(true);
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
      district: "",
      passagngers: "",
      facilities: "",
      whatsapp: "",
    });
    setMainImage(null);
    setOtherImages([]);
    setEditingId(null);
    setSubmitError(null);
  };

  const closePreview = () => setPreviewVehicle(null);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // basic validation for required fields
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

    const token = localStorage.getItem("vehicleToken");
    const headers = { Authorization: `Bearer ${token}` };
    const fd = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      fd.append(key, val);
    });

    // When editing, image fields are optional; if provided, they will replace existing ones.
    if (mainImage) {
      fd.append("mainImage", mainImage);
    }
    if (otherImages.length > 0) {
      otherImages.forEach((img) => fd.append("otherImages", img));
    }

    try {
      setSubmitting(true);

      let res;
      if (editingId) {
        res = await api.put(`/api/vehicle/update/${editingId}`, fd, {
          headers,
        });
      } else {
        // Add new vehicle requires images
        if (!mainImage) {
          setSubmitError("Main image is required");
          return;
        }
        if (otherImages.length === 0) {
          setSubmitError("Please add at least one other image");
          return;
        }
        res = await api.post("/api/vehicle/addvehicle", fd, { headers });
      }

      if (res.data.success) {
        const updatedVehicle = res.data.data;
        setVehicles((prev) => {
          if (editingId) {
            return prev.map((v) =>
              v._id === updatedVehicle._id ? updatedVehicle : v,
            );
          }
          return [...prev, updatedVehicle];
        });

        resetForm();
        setShowForm(false);
      } else {
        setSubmitError(res.data.message || "Failed to save vehicle");
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
            if (showForm) {
              resetForm();
              setShowForm(false);
            } else {
              resetForm();
              setShowForm(true);
            }
          }}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
        >
          {showForm ? (editingId ? "Cancel edit" : "Cancel") : "Add Vehicle"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddSubmit} className="space-y-4 mb-6">
          <h2 className="text-2xl font-semibold">
            {editingId ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* left: images */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <label className="block text-white font-medium mb-2">
                  Main Image {editingId ? "(optional)" : "*"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleMainImageChange}
                  className="w-full text-white"
                  required={!editingId}
                />
                {editingId && (
                  <p className="text-xs text-gray-400 mt-2">
                    Leave blank to keep the current main image.
                  </p>
                )}
                {mainImage && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-300 mb-2">Selected file:</p>
                    <div className="text-xs text-gray-200">
                      {mainImage.name}
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6">
                <label className="block text-white font-medium mb-2">
                  Other Images {editingId ? "(optional)" : "*"}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleOtherImagesChange}
                  className="w-full text-white"
                  required={!editingId}
                />
                {editingId && (
                  <p className="text-xs text-gray-400 mt-2">
                    Leave blank to keep the current other images.
                  </p>
                )}
                {otherImages.length > 0 && (
                  <div className="mt-4 text-sm text-gray-200">
                    {otherImages.length} file{otherImages.length > 1 ? "s" : ""}{" "}
                    selected
                  </div>
                )}
              </div>
            </div>

            {/* right: fields */}
            <div className="space-y-4">
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
                <label className="block text-white">District *</label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded bg-gray-800 text-white"
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
            </div>
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

      {previewVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl bg-slate-900 rounded-lg shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-lg font-semibold text-white">
                Preview Vehicle
              </h3>
              <button
                type="button"
                onClick={() => setPreviewVehicle(null)}
                className="text-slate-300 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              {previewVehicle.mainImage && (
                <img
                  src={previewVehicle.mainImage}
                  alt={previewVehicle.name}
                  className="w-full h-56 object-cover rounded"
                />
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Name
                  </div>
                  <div className="text-white font-semibold">
                    {previewVehicle.name}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Type
                  </div>
                  <div className="text-white font-semibold">
                    {previewVehicle.type}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Price
                  </div>
                  <div className="text-white font-semibold">
                    Rs {previewVehicle.Price}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    District
                  </div>
                  <div className="text-white font-semibold">
                    {previewVehicle.district}
                  </div>
                </div>
              </div>

              {previewVehicle.description && (
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Description
                  </div>
                  <div className="text-gray-200">
                    {previewVehicle.description}
                  </div>
                </div>
              )}

              {previewVehicle.facilities?.length > 0 && (
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Facilities
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {previewVehicle.facilities.map((f) => (
                      <span
                        key={f}
                        className="text-xs bg-slate-800 text-slate-200 px-2 py-1 rounded"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {previewVehicle.otherImages?.length > 0 && (
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Additional Images
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
                    {previewVehicle.otherImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`${previewVehicle.name} ${idx + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setPreviewVehicle(null)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* user vehicles list */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Your Vehicles</h2>
        {vehicles.length === 0 ? (
          <p className="text-gray-400">You haven't added any vehicles yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {vehicles.map((veh) => (
              <div
                key={veh._id}
                className="bg-gray-800 p-4 rounded shadow relative"
              >
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
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewVehicle(veh)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-900 bg-blue-400 hover:bg-blue-500 rounded"
                  >
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => startEditingVehicle(veh)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVehicle(veh._id)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-red-100 bg-red-600 hover:bg-red-700 rounded"
                  >
                    Delete
                  </button>
                </div>
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
