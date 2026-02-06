import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { IoArrowBackOutline } from "react-icons/io5";
import { CiSaveDown1 } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {
  FaHotel,
  FaSignOutAlt,
  FaUser,
  FaPlus,
  FaEdit,
  FaHome,
  FaTh,
  FaClipboardList,
  FaChartBar,
  FaBell,
  FaMapMarkerAlt,
  FaStar,
  FaAddressBook,
  FaPhoneAlt,
  FaDollarSign,
  FaWhatsapp,
  FaEnvelope,
} from "react-icons/fa";

const VendorDashboard = () => {
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
  const [hasProfile, setHasProfile] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const initialFormData = {
    name: "",
    description: "",
    category: "villa",
    rating: "5",
    district: "",
    city: "",
    price: "",
    location: "",
    country: "",
    highlights: "",
    address: "",
    contact: "",
    ownerEmail: vendorEmail || "",
    videoUrl: "",
    availableThings: "",
  };

  const locationData = {
    "Sri Lanka": {
      Colombo: ["Colombo", "Dehiwala", "Moratuwa", "Maharagama", "Homagama"],

      Gampaha: ["Gampaha", "Negombo", "Ja-Ela", "Kelaniya", "Wattala"],

      Kalutara: ["Kalutara", "Panadura", "Horana", "Beruwala", "Matugama"],

      Kandy: ["Kandy", "Peradeniya", "Katugastota", "Gampola"],

      Matale: ["Matale", "Dambulla", "Ukuwela"],

      NuwaraEliya: ["Nuwara Eliya", "Hatton", "Talawakele"],

      Galle: ["Galle", "Hikkaduwa", "Ambalangoda", "Elpitiya"],

      Hambantota: ["Hambantota", "Tangalle", "Tissamaharama", "Beliatta"],

      Matara: ["Matara", "Weligama", "Dikwella", "Akuressa"],

      Jaffna: ["Jaffna", "Chavakachcheri", "Point Pedro"],

      Kilinochchi: ["Kilinochchi", "Pallai"],

      Mullaitivu: ["Mullaitivu", "Puthukudiyiruppu"],

      Vavuniya: ["Vavuniya", "Nedunkeni"],

      Mannar: ["Mannar", "Murunkan"],

      Trincomalee: ["Trincomalee", "Kinniya", "Mutur"],

      Batticaloa: ["Batticaloa", "Kattankudy", "Eravur"],

      Ampara: ["Ampara", "Kalmunai", "Akkaraipattu", "Sainthamaruthu"],

      Anuradhapura: ["Anuradhapura", "Kekirawa", "Tambuttegama"],

      Polonnaruwa: ["Polonnaruwa", "Kaduruwela", "Hingurakgoda"],

      Kurunegala: ["Kurunegala", "Kuliyapitiya", "Narammala", "Pannala"],

      Puttalam: ["Puttalam", "Chilaw", "Wennappuwa"],

      Badulla: ["Badulla", "Bandarawela", "Ella", "Hali Ela"],

      Monaragala: ["Monaragala", "Wellawaya", "Bibile"],

      Ratnapura: ["Ratnapura", "Balangoda", "Eheliyagoda"],

      Kegalle: ["Kegalle", "Mawanella", "Warakapola"],
    },
    Other: { Other: ["Other"] },
  };

  // Get districts for selected country
  const getDistricts = () => {
    if (formData.country && locationData[formData.country]) {
      return Object.keys(locationData[formData.country]);
    }
    return [];
  };

  const [images, setImages] = useState({});

  const handleSingleFiles = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    // Store both preview and actual file
    setImages((prev) => ({
      ...prev,
      [field]: URL.createObjectURL(file),
    }));
    setMedia((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  // Get cities for selected district
  const getCities = () => {
    if (
      formData.country &&
      formData.district &&
      locationData[formData.country]?.[formData.district]
    ) {
      return locationData[formData.country][formData.district];
    }
    return [];
  };

  const [formData, setFormData] = useState(initialFormData);
  const [uploading, setUploading] = useState(false);
  const [media, setMedia] = useState({
    mainImage: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    otherimages: [],
  });

  const [showVideo, setShowVideo] = useState(false);
  const [showMoreImages, setShowMoreImages] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!storedToken) {
      toast.error("Please login first");
      navigate("/vendor/register");
    }
  }, [storedToken, navigate]);

  // Fetch existing profile
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!vendorEmail) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/trending/profile?ownerEmail=${vendorEmail}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      );

      if (res.data && res.data._id) {
        setHasProfile(true);
        setSelectedId(res.data._id);
        setProfileData(res.data);
        setFormData({
          ...res.data,
          availableThings: (res.data.availableThings || []).join(", "),
        });
        // Pre-populate image previews from existing profile
        const existingImages = {};
        ["mainImage", "image", "image1", "image2", "image3", "image4"].forEach(
          (field) => {
            if (res.data[field]) {
              existingImages[field] = res.data[field];
            }
          },
        );
        setImages(existingImages);
      } else {
        setHasProfile(false);
        setSelectedId(null);
        setProfileData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
        setImages({});
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setHasProfile(false);
        setSelectedId(null);
        setProfileData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
        setImages({});
      } else {
        console.error(
          "Error fetching profile:",
          err.response?.data || err.message,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setFormData({ ...formData, country: value, district: "", city: "" });
    } else if (name === "district") {
      setFormData({ ...formData, district: value, city: "" });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSingleFile = (e, field) => {
    setMedia({ ...media, [field]: e.target.files[0] });
  };

  const handleOtherImages = (e) => {
    setMedia({ ...media, otherimages: Array.from(e.target.files || []) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage && !hasProfile) {
      toast.error("Main image is required");
      return;
    }

    if (!hasProfile && !selectedId) {
      if (hasProfile) {
        toast.error(
          "You already have a property. Please edit the existing one instead.",
        );
        return;
      }
    }

    setUploading(true);
    const uploadToast = toast.loading("Uploading your property... Please wait");

    const fd = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "availableThings") {
        (value ? value.split(",").map((i) => i.trim()) : []).forEach((v) =>
          fd.append(key, v),
        );
      } else {
        fd.append(key, value);
      }
    });

    if (media.mainImage) fd.append("mainImage", media.mainImage);

    ["image", "image1", "image2", "image3", "image4"].forEach((field) => {
      if (media[field]) fd.append(field, media[field]);
    });

    media.otherimages?.forEach((file) => fd.append("otherimages", file));

    try {
      let res;
      if (hasProfile && selectedId) {
        res = await axios.put(
          `${BACKEND_URL}/api/trending/update/${selectedId}`,
          fd,
          { headers: { Authorization: `Bearer ${storedToken}` } },
        );
      } else {
        res = await axios.post(`${BACKEND_URL}/api/trending/add`, fd, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }

      if (res.data.success) {
        toast.dismiss(uploadToast);
        toast.success(hasProfile ? "Profile updated!" : "Property added!");
        await fetchProfile();
        setShowForm(false);
        setMedia({
          mainImage: null,
          image: null,
          image1: null,
          image2: null,
          image3: null,
          image4: null,
          otherimages: [],
        });
      } else {
        toast.dismiss(uploadToast);
        toast.error("Operation failed");
      }
    } catch (err) {
      toast.dismiss(uploadToast);
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
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
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
            {profileData?.name || "Vendor Dashboard"}
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
              src={profileData?.mainImage || profileData?.image || ""}
              alt="main"
              className="w-full h-[50vh] sm:h-[80vh] object-cover"
            />
          </div>

          {[
            profileData?.image1,
            profileData?.image2,
            profileData?.image3,
            profileData?.image4,
          ]
            .filter(Boolean)
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

          {Array.isArray(profileData?.otherimages) &&
            profileData.otherimages.length > 0 && (
              <div className="absolute top-[60vh] right-20 text-center text-green-400 font-bold text-sm  sm:text-xl hover:text-amber-300">
                <button
                  onClick={() => setShowMoreImages(!showMoreImages)}
                  className="h-[10vh] sm:h-[20vh] p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {showMoreImages ? "Hide Photos" : "View More Photos"}
                  <CiSaveDown1 className="inline ml-2 w-4 h-4 sm:w-12 sm:h-12" />
                </button>
              </div>
            )}
        </div>

        {/* Fullscreen gallery modal */}
        {showMoreImages && Array.isArray(profileData?.otherimages) && (
          <div className="sm:fixed inset-0 bg-black/70 z-50 flex  p-0 sm:p-4 ">
            <div className="bg-gray-900 rounded-lg w-full max-w-[95vw] sm:max-w-3xl md:max-w-6xl max-h-[90vh] overflow-y-auto mx-auto px-3 sm:px-0">
              <div className="flex justify-center sm:justify-end p-3 sm:p-2 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                <button
                  aria-label="Close gallery"
                  onClick={() => setShowMoreImages(false)}
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <IoMdClose size={22} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-2 p-3 sm:p-4 justify-items-center">
                {(Array.isArray(profileData?.otherimages)
                  ? profileData.otherimages
                  : []
                ).map((src, idx) => (
                  <div
                    key={idx}
                    className="w-full rounded overflow-hidden bg-gray-800 flex justify-center p-2"
                  >
                    <img
                      src={src}
                      alt={`other-${idx}`}
                      className="w-full max-w-[92%] max-h-[60vh] h-auto object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaMapMarkerAlt className="text-red-500" />
            <div>
              <p className="font-semibold">Location</p>
              <p className="text-blue-200">{profileData?.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaStar className="text-yellow-400" />
            <div>
              <p className="font-semibold">Highlights</p>
              <p className="text-blue-200">{profileData?.highlights}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaAddressBook className="text-green-400" />
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-blue-200">{profileData?.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaAddressBook className="text-green-400" />
            <div>
              <p className="font-semibold">Locations</p>
              <p className="text-blue-200">{profileData?.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaPhoneAlt className="text-blue-400" />
            <div>
              <p className="font-semibold">Contact</p>
              <p className="text-blue-200">{profileData?.contact}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
            <FaDollarSign className="text-emerald-400" />
            <div>
              <p className="font-semibold">Price (Rs.)</p>
              <p className="text-blue-200">{profileData?.price}</p>
            </div>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-blue-200">{profileData?.description}</p>
          </div>

          {/* Video thumbnail if available */}
          {profileData?.videoUrl && (
            <div className="cursor-pointer" onClick={() => setShowVideo(true)}>
              <img
                src={`https://img.youtube.com/vi/${profileData?.videoUrl.split("v=").pop() || ""}/hqdefault.jpg`}
                alt="video"
                className="rounded-xl"
              />
            </div>
          )}
        </div>

        {/* Right column - Add/Edit form */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-white">Manage Property</h3>
          <h3 className="text-m font-semibold mb-4 px-4 py-2 rounded-lg bg-amber-100 text-amber-700 inline-block shadow-sm">
            Quick tips: Fill required fields and upload clear photos
          </h3>

          {!showForm && (
            <div className="space-y-4">
              {hasProfile && profileData ? (
                <div className="space-y-2">
                  <p className="font-semibold">{profileData.name}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex-1 bg-amber-400 text-gray-900 p-3 rounded-lg font-semibold"
                    >
                      Edit Property
                    </button>
                    <button
                      onClick={() => {
                        setProfileData(null);
                        setHasProfile(false);
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
                  Add Property
                </button>
              )}
            </div>
          )}

          {showForm && (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-200">Property Name</label>
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
                  <label className="mb-1 text-gray-200">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white w-full"
                  >
                    <option value="villa">Villa</option>
                    <option value="hotel">Hotel</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="house">House</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label className="mb-1 text-gray-200">Price (Rs)</label>
                  <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 text-gray-200">Country</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white w-full"
                  >
                    <option value="">Select Country</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="India">India</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 text-gray-200">District</label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="p-2 rounded-md bg-gray-700 text-white w-full"
                    disabled={!formData.country}
                  >
                    <option value="">Select</option>
                    {getDistricts().map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-200">
                  {" "}
                  add google map Location link
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-gray-700 text-white"
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-gray-200">Address</label>
                <input
                  type="text"
                  name="location"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="p-2 rounded-md bg-gray-700 text-white"
                />
              </div>

              <div className="flex flex-col">
                <label className="mb-1 text-gray-200">Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
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
                    {images.mainImage ? (
                      <img
                        src={images.mainImage}
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
                      onChange={(e) => handleSingleFiles(e, "mainImage")}
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
                    {["image", "image1", "image2", "image3", "image4"].map(
                      (field) => (
                        <label
                          key={field}
                          className="relative flex items-center justify-center h-36 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 overflow-hidden"
                        >
                          {/* Preview Image */}
                          {images[field] ? (
                            <img
                              src={images[field]}
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
                            onChange={(e) => handleSingleFiles(e, field)}
                            className="hidden"
                          />
                        </label>
                      ),
                    )}
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
                  disabled={uploading}
                  className="flex-1 bg-amber-400 text-gray-900 p-3 rounded-lg font-semibold"
                >
                  {uploading
                    ? "Uploading..."
                    : hasProfile
                      ? "Update Property"
                      : "Add Property"}
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
          )}
        </div>
      </div>

      {/* Floating contact buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        {profileData?.contact && (
          <a
            href={`https://wa.me/${String(profileData.contact).replace(/\D/g, "")}`}
            target="_blank"
            rel="noreferrer"
            className="bg-green-500 p-4 rounded-full hover:bg-green-600"
          >
            <FaWhatsapp size={28} />
          </a>
        )}
        {profileData?.contact && (
          <a
            href={`mailto:${profileData.contact}?subject=Inquiry about ${profileData?.name || ""}`}
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

export default VendorDashboard;
