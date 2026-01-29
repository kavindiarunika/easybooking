import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../App";
import "react-toastify/dist/ReactToastify.css";
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
  FaCog,
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

  // Location data - Countries with their districts and cities
  const locationData = {
    "Sri Lanka": {
      Colombo: [
        "Colombo",
        "Dehiwala",
        "Moratuwa",
        "Kotte",
        "Maharagama",
        "Kesbewa",
      ],
      Gampaha: [
        "Negombo",
        "Gampaha",
        "Kelaniya",
        "Wattala",
        "Ja-Ela",
        "Minuwangoda",
      ],
      Kandy: ["Kandy", "Peradeniya", "Katugastota", "Gampola", "Nawalapitiya"],
      Galle: ["Galle", "Hikkaduwa", "Ambalangoda", "Unawatuna", "Koggala"],
      Matara: ["Matara", "Weligama", "Mirissa", "Dickwella", "Tangalle"],
      Hambantota: ["Hambantota", "Tissamaharama", "Tangalle", "Ambalantota"],
      Kalutara: ["Kalutara", "Panadura", "Beruwala", "Wadduwa", "Aluthgama"],
      "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Bandarawela", "Ella"],
      Ratnapura: ["Ratnapura", "Balangoda", "Embilipitiya", "Kuruwita"],
      Anuradhapura: ["Anuradhapura", "Mihintale", "Kekirawa", "Medawachchiya"],
      Polonnaruwa: ["Polonnaruwa", "Kaduruwela", "Hingurakgoda"],
      Kurunegala: ["Kurunegala", "Kuliyapitiya", "Polgahawela", "Mawathagama"],
      Puttalam: ["Puttalam", "Chilaw", "Wennappuwa", "Kalpitiya"],
      Trincomalee: ["Trincomalee", "Kinniya", "Kantale"],
      Batticaloa: ["Batticaloa", "Kattankudy", "Eravur"],
      Ampara: ["Ampara", "Kalmunai", "Akkaraipattu"],
      Badulla: ["Badulla", "Bandarawela", "Haputale", "Welimada"],
      Monaragala: ["Monaragala", "Wellawaya", "Bibile"],
      Jaffna: ["Jaffna", "Chavakachcheri", "Point Pedro", "Nallur"],
      Kilinochchi: ["Kilinochchi"],
      Mannar: ["Mannar", "Talaimannar"],
      Vavuniya: ["Vavuniya"],
      Mullaitivu: ["Mullaitivu"],
      Matale: ["Matale", "Dambulla", "Sigiriya", "Ukuwela"],
      Kegalle: ["Kegalle", "Mawanella", "Rambukkana"],
    },
    India: {
      Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      Karnataka: ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
      "Tamil Nadu": [
        "Chennai",
        "Coimbatore",
        "Madurai",
        "Tiruchirappalli",
        "Salem",
      ],
      Kerala: [
        "Kochi",
        "Thiruvananthapuram",
        "Kozhikode",
        "Thrissur",
        "Kollam",
      ],
      Delhi: ["New Delhi", "Delhi NCR"],
      Gujarat: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
      Rajasthan: ["Jaipur", "Jodhpur", "Udaipur", "Ajmer"],
      "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Howrah"],
      Goa: ["Panaji", "Margao", "Vasco da Gama", "Mapusa"],
    },
    Maldives: {
      Male: ["Male City", "Hulhumale", "Villimale"],
      "Ari Atoll": ["Mahibadhoo", "Maamigili"],
      "Baa Atoll": ["Eydhafushi", "Thulhaadhoo"],
      "Noonu Atoll": ["Manadhoo", "Holhudhoo"],
      "Addu Atoll": ["Hithadhoo", "Feydhoo", "Maradhoo"],
    },
    Thailand: {
      Bangkok: ["Bangkok", "Nonthaburi", "Pak Kret"],
      "Chiang Mai": ["Chiang Mai City", "San Kamphaeng", "Doi Saket"],
      Phuket: ["Phuket Town", "Patong", "Kata", "Karon"],
      Krabi: ["Krabi Town", "Ao Nang", "Railay"],
      Pattaya: ["Pattaya City", "Jomtien", "Na Jomtien"],
      "Koh Samui": ["Chaweng", "Lamai", "Bophut"],
    },
    Indonesia: {
      Bali: ["Denpasar", "Ubud", "Seminyak", "Kuta", "Sanur"],
      Jakarta: ["Central Jakarta", "South Jakarta", "North Jakarta"],
      Yogyakarta: ["Yogyakarta City", "Sleman"],
      "West Java": ["Bandung", "Bogor", "Bekasi"],
      "East Java": ["Surabaya", "Malang"],
    },
    Malaysia: {
      "Kuala Lumpur": ["KL City Centre", "Bukit Bintang", "Bangsar"],
      Selangor: ["Petaling Jaya", "Shah Alam", "Subang Jaya"],
      Penang: ["George Town", "Batu Ferringhi", "Butterworth"],
      Johor: ["Johor Bahru", "Iskandar Puteri"],
      Sabah: ["Kota Kinabalu", "Sandakan"],
      Sarawak: ["Kuching", "Miri"],
    },
    Singapore: {
      "Central Region": ["Orchard", "Marina Bay", "Chinatown", "Little India"],
      "East Region": ["Changi", "Tampines", "Bedok"],
      "West Region": ["Jurong", "Clementi"],
      "North Region": ["Woodlands", "Yishun"],
      "North-East Region": ["Sengkang", "Punggol"],
    },
    Philippines: {
      "Metro Manila": ["Manila", "Makati", "Quezon City", "Taguig", "Pasig"],
      Cebu: ["Cebu City", "Mandaue", "Lapu-Lapu"],
      Palawan: ["Puerto Princesa", "El Nido", "Coron"],
      Boracay: ["Boracay Island"],
      Davao: ["Davao City"],
    },
    Vietnam: {
      "Ho Chi Minh": ["District 1", "District 3", "District 7", "Binh Thanh"],
      Hanoi: ["Hoan Kiem", "Ba Dinh", "Tay Ho"],
      "Da Nang": ["Da Nang City", "Hoi An"],
      "Nha Trang": ["Nha Trang City"],
      "Phu Quoc": ["Duong Dong"],
    },
    Nepal: {
      Bagmati: ["Kathmandu", "Lalitpur", "Bhaktapur"],
      Gandaki: ["Pokhara", "Gorkha"],
      Lumbini: ["Lumbini", "Butwal"],
    },
    Bangladesh: {
      Dhaka: ["Dhaka City", "Gazipur", "Narayanganj"],
      Chittagong: ["Chittagong City", "Cox's Bazar"],
      Sylhet: ["Sylhet City"],
    },
    Pakistan: {
      Punjab: ["Lahore", "Faisalabad", "Rawalpindi"],
      Sindh: ["Karachi", "Hyderabad"],
      Islamabad: ["Islamabad"],
    },
    "United Arab Emirates": {
      Dubai: ["Dubai City", "Deira", "Jumeirah", "Marina"],
      "Abu Dhabi": ["Abu Dhabi City", "Al Ain"],
      Sharjah: ["Sharjah City"],
      Ajman: ["Ajman City"],
    },
    "Saudi Arabia": {
      Riyadh: ["Riyadh City"],
      Makkah: ["Mecca", "Jeddah"],
      "Eastern Province": ["Dammam", "Dhahran", "Khobar"],
    },
    "United Kingdom": {
      England: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
      Scotland: ["Edinburgh", "Glasgow"],
      Wales: ["Cardiff", "Swansea"],
      "Northern Ireland": ["Belfast"],
    },
    "United States": {
      California: ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
      "New York": ["New York City", "Buffalo", "Albany"],
      Florida: ["Miami", "Orlando", "Tampa"],
      Texas: ["Houston", "Dallas", "Austin", "San Antonio"],
      Nevada: ["Las Vegas", "Reno"],
    },
    Australia: {
      "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
      Victoria: ["Melbourne", "Geelong"],
      Queensland: ["Brisbane", "Gold Coast", "Cairns"],
      "Western Australia": ["Perth", "Fremantle"],
    },
    Canada: {
      Ontario: ["Toronto", "Ottawa", "Mississauga"],
      "British Columbia": ["Vancouver", "Victoria"],
      Quebec: ["Montreal", "Quebec City"],
      Alberta: ["Calgary", "Edmonton"],
    },
    Germany: {
      Bavaria: ["Munich", "Nuremberg"],
      Berlin: ["Berlin City"],
      Hamburg: ["Hamburg City"],
      Hesse: ["Frankfurt", "Wiesbaden"],
    },
    France: {
      "Île-de-France": ["Paris", "Versailles"],
      "Provence-Alpes-Côte d'Azur": ["Nice", "Marseille", "Cannes"],
      "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble"],
    },
    Other: {
      Other: ["Other"],
    },
  };

  // Get districts for selected country
  const getDistricts = () => {
    if (formData.country && locationData[formData.country]) {
      return Object.keys(locationData[formData.country]);
    }
    return [];
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
      } else {
        setHasProfile(false);
        setSelectedId(null);
        setProfileData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Profile not found - this is normal for new vendors
        setHasProfile(false);
        setSelectedId(null);
        setProfileData(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
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

    // Prevent creating duplicate properties - one per email only
    if (!hasProfile && !selectedId) {
      // Creating new property
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
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <FaHotel className="text-2xl text-blue-600" />
            <h1 className="text-xl font-bold text-gray-800">
              Vendor Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <FaUser />
              <span className="text-sm">{vendorEmail}</span>
            </div>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              <FaHome />
              Back to Home
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Terms & Conditions Card */}
        <div className="bg-white rounded-xl shadow p-6 mt-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">
            Smartsbooking Terms & Conditions
          </h2>

          <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
            <p>
              <span className="font-medium">Smartsbooking.com</span> does not
              charge any commission from any party.
            </p>

            <p>
              Your organization must agree to provide a
              <span className="font-semibold text-green-600">
                {" "}
                10% discount{" "}
              </span>
              to customers who come through us.
            </p>

            <p>
              The annual fee for all our services is
              <span className="font-semibold"> Rs. 5,000/=</span> and it must be
              paid on the due date.
            </p>
          </div>

          <div className="mt-5 flex justify-end">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
              I Understand
            </button>
          </div>
        </div>
      </main>

      <div className="min-h-screen bg-gray-100">
        {/* Main Content */}
        <main className="flex-1 transition-all duration-300 p-8">
          {/* Quick Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Status</p>
                  <p className="text-3xl font-bold text-blue-600 mt-2">
                    {hasProfile ? "Active" : "Inactive"}
                  </p>
                </div>
                <FaTh className="text-4xl text-blue-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Property Name
                  </p>
                  <p className="text-xl font-bold text-green-600 mt-2">
                    {profileData?.name || "N/A"}
                  </p>
                </div>
                <FaClipboardList className="text-4xl text-green-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Category</p>
                  <p className="text-xl font-bold text-purple-600 mt-2 capitalize">
                    {profileData?.category || "N/A"}
                  </p>
                </div>
                <FaChartBar className="text-4xl text-purple-200" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">Price</p>
                  <p className="text-xl font-bold text-orange-600 mt-2">
                    Rs. {profileData?.price || "N/A"}
                  </p>
                </div>
                <FaBell className="text-4xl text-orange-200" />
              </div>
            </div>
          </div>

          {!showForm && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {hasProfile && profileData ? (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                      Your Property
                    </h2>
                    <button
                      onClick={() => setShowForm(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      <FaEdit />
                      Edit Property
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {profileData.mainImage && (
                        <img
                          src={profileData.mainImage}
                          alt={profileData.name}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}
                    </div>
                    <div className="space-y-3">
                      <p>
                        <strong>Name:</strong> {profileData.name}
                      </p>
                      <p>
                        <strong>Category:</strong> {profileData.category}
                      </p>
                      <p>
                        <strong>Location:</strong> {profileData.location}
                      </p>
                      <p>
                        <strong>District:</strong> {profileData.district}
                      </p>
                      <p>
                        <strong>Price:</strong> Rs.{profileData.price}
                      </p>
                      <p>
                        <strong>Rating:</strong> {profileData.rating} Star
                      </p>
                      <p>
                        <strong>Contact:</strong> {profileData.contact}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p>
                      <strong>Description:</strong>
                    </p>
                    <p className="text-gray-600">{profileData.description}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaHotel className="text-6xl text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No Property Listed Yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    Add your first property to start receiving bookings
                  </p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition mx-auto"
                  >
                    <FaPlus />
                    Add Property
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Add/Edit Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {hasProfile ? "Edit Property" : "Add New Property"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕ Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Property Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="villa">Villa</option>
                      <option value="hotel">Hotel</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="house">House</option>
                    </select>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country *
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Country</option>
                      <option value="Sri Lanka">🇱🇰 Sri Lanka</option>
                      <option value="India">🇮🇳 India</option>
                      <option value="Maldives">🇲🇻 Maldives</option>
                      <option value="Thailand">🇹🇭 Thailand</option>
                      <option value="Indonesia">🇮🇩 Indonesia</option>
                      <option value="Malaysia">🇲🇾 Malaysia</option>
                      <option value="Singapore">🇸🇬 Singapore</option>
                      <option value="Philippines">🇵🇭 Philippines</option>
                      <option value="Vietnam">🇻🇳 Vietnam</option>
                      <option value="Nepal">🇳🇵 Nepal</option>
                      <option value="Bangladesh">🇧🇩 Bangladesh</option>
                      <option value="Pakistan">🇵🇰 Pakistan</option>
                      <option value="United Arab Emirates">🇦🇪 UAE</option>
                      <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                      <option value="United Kingdom">🇬🇧 United Kingdom</option>
                      <option value="United States">🇺🇸 United States</option>
                      <option value="Australia">🇦🇺 Australia</option>
                      <option value="Canada">🇨🇦 Canada</option>
                      <option value="Germany">🇩🇪 Germany</option>
                      <option value="France">🇫🇷 France</option>
                      <option value="Other">🌍 Other</option>
                    </select>
                  </div>

                  {/* District */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      District/State *
                    </label>
                    <select
                      name="district"
                      value={formData.district}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.country}
                    >
                      <option value="">Select District/State</option>
                      {getDistricts().map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      required
                      disabled={!formData.district}
                    >
                      <option value="">Select City</option>
                      {getCities().map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location/Address *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (Rs) *
                    </label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={formData.rating}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Star
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number *
                    </label>
                    <input
                      type="text"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Highlights
                  </label>
                  <textarea
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="Key features of your property"
                  />
                </div>

                {/* Available Things */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities (comma separated)
                  </label>
                  <input
                    type="text"
                    name="availableThings"
                    value={formData.availableThings}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    placeholder="WiFi, Pool, AC, Parking"
                  />
                </div>

                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video URL (YouTube/Vimeo)
                  </label>
                  <input
                    type="text"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Images Section */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-800 mb-4">
                    Property Images
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Main Image {!hasProfile && "*"}
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleSingleFile(e, "mainImage")}
                        className="w-full border border-gray-300 rounded-lg p-2"
                        required={!hasProfile}
                      />
                    </div>
                    {["image", "image1", "image2", "image3", "image4"].map(
                      (f, i) => (
                        <div key={f}>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Image {i + 1}
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleSingleFile(e, f)}
                            className="w-full border border-gray-300 rounded-lg p-2"
                          />
                        </div>
                      ),
                    )}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Images (Multiple)
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleOtherImages}
                        className="w-full border border-gray-300 rounded-lg p-2"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                        <span>Uploading...</span>
                      </>
                    ) : hasProfile ? (
                      "Update Property"
                    ) : (
                      "Add Property"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    disabled={uploading}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default VendorDashboard;
