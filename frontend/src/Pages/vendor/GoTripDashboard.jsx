import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import {
  FaCar,
  FaSignOutAlt,
  FaUser,
  FaPlus,
  FaEdit,
  FaHome,
  FaMapMarkerAlt,
  FaStar,
  FaPhoneAlt,
  FaDollarSign,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";

const GoTripDashboard = () => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("vendorToken");

  const getVendorInfo = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const vendorInfo = storedToken ? getVendorInfo(storedToken) : null;
  const vendorEmail = vendorInfo?.email;

  const [loading, setLoading] = useState(false);
  const [hasVehicle, setHasVehicle] = useState(false);
  const [vehicleData, setVehicleData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormData = {
    name: "",
    Price: "",
    type: "car",
    description: "",
    discrict: "",
    passagngers: "",
    facilities: "",
    whatsapp: "",
    ownerEmail: vendorEmail || "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState({
    mainImage: null,
    otherImages: [],
  });

  // Check authentication
  useEffect(() => {
    if (!storedToken) {
      toast.error("Please login first");
      navigate("/vendor/register");
    }
  }, [storedToken, navigate]);

  // Fetch existing vehicle
  useEffect(() => {
    fetchVehicle();
  }, []);

  const fetchVehicle = async () => {
    if (!vendorEmail) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/vehicle/profile?ownerEmail=${vendorEmail}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      );

      if (res.data && res.data._id) {
        setHasVehicle(true);
        setSelectedId(res.data._id);
        setVehicleData(res.data);
        setFormData({
          ...res.data,
          facilities: (res.data.facilities || []).join(", "),
        });
      } else {
        setHasVehicle(false);
        setSelectedId(null);
        setVehicleData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setHasVehicle(false);
        setSelectedId(null);
        setVehicleData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      } else {
        console.log(err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMainImage = (e) => {
    setMedia({ ...media, mainImage: e.target.files[0] });
  };

  const handleOtherImages = (e) => {
    setMedia({ ...media, otherImages: Array.from(e.target.files || []) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage && !hasVehicle) {
      toast.error("Main image is required");
      return;
    }

    if (!media.otherImages.length && !hasVehicle) {
      toast.error("Other images are required");
      return;
    }

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      fd.append(key, value);
    });

    if (media.mainImage) fd.append("mainImage", media.mainImage);

    media.otherImages?.forEach((file) => fd.append("otherImages", file));

    try {
      let res;
      if (hasVehicle && selectedId) {
        res = await axios.put(
          `${BACKEND_URL}/api/vehicle/update/${selectedId}`,
          fd,
          { headers: { Authorization: `Bearer ${storedToken}` } },
        );
      } else {
        res = await axios.post(`${BACKEND_URL}/api/vehicle/addvehicle`, fd, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }

      if (res.data.success) {
        toast.success(hasVehicle ? "Vehicle updated!" : "Vehicle added!");
        await fetchVehicle();
        setShowForm(false);
        setMedia({
          mainImage: null,
          otherImages: [],
        });
      } else {
        toast.error("Operation failed");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorCategory");
    toast.success("Logged out successfully");
    navigate("/vendor/register");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-10">
      <p className="h-30 w-full"></p>

      {/* Back + Title */}
      <div className=" flex flex-row items-center justify-between  gap-4 mb-4">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-6"
          >
            <IoArrowBackOutline size={26} />
          </button>

          <h1 className="text-2xl font-bold text-cyan-400 mb-6">
            {vehicleData?.name || "GoTrip Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-gray-300">{vendorEmail}</div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="mb-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          <div className="col-span-2 row-span-2 aspect-[16/9] rounded-xl overflow-hidden  relative">
            <img
              src={vehicleData?.mainImage || ""}
              alt="main"
              className="w-full h-[50vh] sm:h-[80vh] object-cover"
            />
          </div>

          {[vehicleData?.otherImages || []]
            .flat()
            .slice(0, 3)
            .map((img, i) => (
              <div
                key={i}
                className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={img}
                  alt={`img-${i + 1}`}
                  className="w-full h-[10vh] sm:h-[50vh] object-cover"
                />
              </div>
            ))}

          {Array.isArray(vehicleData?.otherImages) && vehicleData.otherImages.length > 3 && (
            <div className="absolute top-[60vh] right-20 text-center text-green-400 font-bold text-sm  sm:text-xl hover:text-amber-300">
              <button
                onClick={() => setShowForm((s) => !s)}
                className="h-[10vh] sm:h-[20vh] p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                View More Photos
                <CiSaveDown1 className="inline ml-2 w-4 h-4 sm:w-12 sm:h-12" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaMapMarkerAlt className="text-red-500" />
            <div>
              <p className="font-semibold">District</p>
              <p className="text-blue-200">{vehicleData?.discrict}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaStar className="text-yellow-400" />
            <div>
              <p className="font-semibold">Facilities</p>
              <p className="text-blue-200">{(vehicleData?.facilities || []).join(", ")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaPhoneAlt className="text-blue-400" />
            <div>
              <p className="font-semibold">Contact</p>
              <p className="text-blue-200">{vehicleData?.whatsapp}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaDollarSign className="text-emerald-400" />
            <div>
              <p className="font-semibold">Price (Rs.)</p>
              <p className="text-blue-200">{vehicleData?.Price}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-blue-200">{vehicleData?.description}</p>
          </div>
        </div>

        {/* Right column - Add/Edit form */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-white">Manage Vehicle</h3>
          <h3 className="text-m font-semibold mb-4 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 inline-block shadow-sm">
            Quick tips: Fill required fields and upload clear photos
          </h3>

          {!showForm && (
            <div className="space-y-4">
              {hasVehicle && vehicleData ? (
                <div className="space-y-2">
                  <p className="font-semibold">{vehicleData.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex-1 bg-amber-400 text-gray-900 p-3 rounded-lg font-semibold"
                    >
                      Edit Vehicle
                    </button>
                    <button
                      onClick={() => {
                        setVehicleData(null);
                        setHasVehicle(false);
                        setShowForm(true);
                      }}
                      className="px-4 py-3 border border-gray-600 rounded-lg"
                    >
                      Replace
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-amber-400 text-gray-900 p-3 rounded-lg font-semibold"
                >
                  Add Vehicle
                </button>
              )}
            </div>
          )}

          {showForm && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-200">Vehicle Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-gray-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 text-gray-200">Vehicle Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white w-full"
                  >
                    <option value="car">Car</option>
                    <option value="van">Van</option>
                    <option value="safari-jeep">Safari Jeep</option>
                    <option value="tuktuk">Tuk Tuk</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-gray-200">Price (Rs)</label>
                  <input
                    type="text"
                    name="Price"
                    value={formData.Price}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 text-gray-200">District</label>
                  <input
                    type="text"
                    name="discrict"
                    value={formData.discrict}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white w-full"
                  />
                </div>
                <div>
                  <label className="mb-1 text-gray-200">Passengers</label>
                  <input
                    type="number"
                    name="passagngers"
                    value={formData.passagngers}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-200">WhatsApp</label>
                <input
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-gray-700 text-white"
                />
              </div>

              <div>
                <label className="mb-1 text-gray-200">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-md bg-gray-700 text-white"
                  rows={4}
                />
              </div>

              <div className="border-t pt-4">
                <label className="mb-2 block text-gray-200">Images</label>

                {/* Main Image */}
                <div className="mb-4">
                  <label className="mb-2 block text-sm text-gray-300">
                    Main Image
                  </label>
                  <label className="relative flex items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 overflow-hidden">
                    {media.mainImage ? (
                      <img
                        src={URL.createObjectURL(media.mainImage)}
                        alt="main-preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 16l4-4a3 3 0 014 0l4 4m0 0l4-4m-4 4V4"
                          />
                        </svg>
                        <p className="text-xs text-gray-400 mt-2">
                          Click to upload main image
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMainImage}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Additional Images
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <label
                        key={idx}
                        className="relative flex items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 overflow-hidden"
                      >
                        {/* Preview Image */}
                        {media.otherImages && media.otherImages[idx] ? (
                          <img
                            src={URL.createObjectURL(media.otherImages[idx])}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center">
                            <svg
                              className="w-8 h-8 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 16l4-4a3 3 0 014 0l4 4m0 0l4-4m-4 4V4"
                              />
                            </svg>

                            <p className="text-xs text-gray-400 mt-2">
                              Click to upload
                            </p>
                          </div>
                        )}

                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            setMedia((prev) => ({
                              ...prev,
                              otherImages: files,
                            }));
                          }}
                          className="hidden"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <label className="cursor-pointer inline-block w-full">
                    <div className="p-4 border-2 border-dashed rounded-lg text-center text-gray-300">
                      Click or drop additional images
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleOtherImages}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-400 text-gray-900 p-3 rounded-lg font-semibold"
                >
                  {loading ? "Uploading..." : hasVehicle ? "Update Vehicle" : "Add Vehicle"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-3 border rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
         
                  )}        </div>
      </div>

      {/* Floating contact buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        {vehicleData?.whatsapp && (
          <a
            href={`https://wa.me/${String(vehicleData.whatsapp).replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 p-4 rounded-full hover:bg-green-600"
          >
            <FaWhatsapp size={28} />
          </a>
        )}
        {vehicleData?.whatsapp && (
          <a
            href={`mailto:${vehicleData.whatsapp}?subject=Inquiry about ${vehicleData?.name || ""}`}
            className="bg-white text-black p-4 rounded-full hover:bg-blue-600"
          >
            <FaEnvelope size={28} />
          </a>
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default GoTripDashboard;
