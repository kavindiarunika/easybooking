import React from "react";
import { useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../App.jsx";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import {
  FaHotel,
  FaEnvelope,
  FaPhone,
  FaLock,
  FaBuilding,
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaGlobe,
  FaMapMarkerAlt,
  FaCity,
} from "react-icons/fa";
import { assets } from "../../assets/Assest";
import { MdLocalOffer } from "react-icons/md";

const Register = () => {
  const navigate = useNavigate();
  const [signIn, setsignIn] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotOtp, setForgotOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotOtpSent, setForgotOtpSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const [formData, setformData] = useState({
    email: "",
    phone: "",
    country: "",
    district: "",
    city: "",
    packageName: "",
    hotelName: "",
    hotelType: "",
    vehicleType: "",
    password: "",
  });

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

  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "country") {
      setformData({ ...formData, country: value, district: "", city: "" });
    } else if (name === "district") {
      setformData({ ...formData, district: value, city: "" });
    } else {
      setformData({ ...formData, [name]: value });
    }
  };

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate required fields
    if (!formData.email || !formData.phone || !formData.password) {
      toast.error("Email, phone, and password are required");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending registration data:", formData);
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/registervendor`,
        formData,
      );

      console.log("Registration response:", response.data);

      if (response.data.success && response.data.token) {
        const { token } = response.data;
        localStorage.setItem("vendorToken", token);

        // Determine category and redirect accordingly
        const selectedCategory = formData.hotelName;
        const isGoTrip = ["car", "van", "safari-jeep", "tuktuk"].includes(
          selectedCategory,
        );

        if (isGoTrip) {
          localStorage.setItem("vendorCategory", "gotrip");
          toast.success(
            "Registration successful. Redirecting to GoTrip Dashboard...",
          );
          navigate("/vendor/dashboard-gotrip", {
            state: { openCreate: true },
          });
        } else {
          localStorage.setItem("vendorCategory", "stays");
          toast.success(
            "Registration successful. Redirecting to Stays Dashboard...",
          );
          navigate("/vendor/dashboard-stays", {
            state: { openCreate: true },
          });
        }
      } else if (response.data.success) {
        toast.success(
          "Vendor registered successfully. OTP sent to your email.",
        );
        setOtpSent(true);
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message || "Error in vendor registration",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleverifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/api/vendor/sendotp`, {
        email: formData.email,
        otp,
      });
      if (response.data.success) {
        toast.success("OTP verified successfully. You can now login.");
        setOtpSent(false);
        setsignIn(true);
        setOtp("");
      } else {
        toast.error(response.data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error verifying OTP");
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/login`,
        loginData,
      );

      if (response.data.success && response.data.token) {
        const { token, category } = response.data;

        localStorage.setItem("vendorToken", token);

        // Determine dashboard based on category
        const isGoTrip = ["car", "van", "safari-jeep", "tuktuk"].includes(
          category,
        );

        if (isGoTrip) {
          localStorage.setItem("vendorCategory", "gotrip");
          toast.success("Login successful");
          navigate("/vendor/dashboard-gotrip");
        } else {
          localStorage.setItem("vendorCategory", "stays");
          toast.success("Login successful");
          navigate("/vendor/dashboard-stays");
        }
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Login error");
    }
  };

  // Forgot Password - Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/forgot-password`,
        { email: forgotEmail },
      );
      if (response.data.success) {
        toast.success("OTP sent to your email");
        setForgotOtpSent(true);
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending OTP");
    } finally {
      setForgotLoading(false);
    }
  };

  // Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/vendor/reset-password`,
        {
          email: forgotEmail,
          otp: forgotOtp,
          newPassword,
        },
      );
      if (response.data.success) {
        toast.success("Password reset successful. Please login.");
        setShowForgotPassword(false);
        setForgotOtpSent(false);
        setForgotEmail("");
        setForgotOtp("");
        setNewPassword("");
        setConfirmPassword("");
        setsignIn(true);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error resetting password");
    } finally {
      setForgotLoading(false);
    }
  };

  const hotelTypes = [
    { value: "hotel", label: "Hotel", icon: "🏨" },
    { value: "resort", label: "Resort", icon: "🏝️" },
    { value: "villa", label: "Villa", icon: "🏡" },
    { value: "homestay", label: "Homestay", icon: "🏠" },
    { value: "guesthouse", label: "Guest House", icon: "🏘️" },
    { value: "apartment", label: "Apartment", icon: "🏢" },
  ];

  const vehicleTypes = [
    { value: "car", label: "Car", icon: "🚗" },
    { value: "van", label: "Van", icon: "🚐" },
    { value: "ac-bus", label: "A/C Bus", icon: "🚌" },
    { value: "tuk-tuk", label: "Tuk Tuk", icon: "🛺" },
    { value: "boat", label: "Boat", icon: "🚤" },
    { value: "safari-jeep", label: "Safari Jeep", icon: "🚙" },
  ];

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-8 filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      {/* Back to Home */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        <FaArrowLeft />
        <span>Back to Home</span>
      </Link>

      <div className="relative w-full max-w-5xl">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20">
          <div className="flex flex-col lg:flex-row">
            {/* Left Side - Branding */}
            <div className="lg:w-5/12 bg-green-200/20 p-8 lg:p-12 flex flex-col justify-center items-center text-white">
              <div className="text-center">
                <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <img
                    src={assets.logo}
                    alt="SmartsBooking Logo"
                    className="w-20 h-20 object-contain"
                  />
                </div>
                <h1 className="text-3xl lg:text-4xl font-bold mb-4">
                  SmartsBooking
                </h1>

                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg .prata-regular">
                        <MdLocalOffer />
                      </span>
                    </div>
                    <span>Increase your bookings</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg .prata-regula">
                        <MdLocalOffer />
                      </span>
                    </div>
                    <span>Easy management dashboard</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-lg .prata-regula">
                        <MdLocalOffer />
                      </span>
                    </div>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Forms */}
            <div className="lg:w-7/12 p-8 lg:p-12">
              {signIn ? (
                /* Login Form */
                <form onSubmit={handleLoginSubmit} className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Welcome Back
                    </h2>
                    <p className="text-white/60">
                      Sign in to your vendor account
                    </p>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-4 pl-12 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-white/70 cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-white/30 bg-white/10"
                      />
                      Remember me
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-green-400 text-white font-semibold py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    Sign In
                  </button>

                  {/* Switch to Register */}
                  <p className="text-center text-white/60">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setsignIn(false)}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      Create Account
                    </button>
                  </p>
                </form>
              ) : (
                /* Registration Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-white mb-2">
                      Create Account
                    </h2>
                    <p className="text-white/60">Join as a vendor partner</p>
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative">
                    <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Country */}
                  <div className="relative">
                    <FaGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <select
                      name="country"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all appearance-none cursor-pointer"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className="bg-slate-800 text-white">
                        Select Country
                      </option>
                      <option
                        value="Sri Lanka"
                        className="bg-slate-800 text-white"
                      >
                        🇱🇰 Sri Lanka
                      </option>
                      <option value="India" className="bg-slate-800 text-white">
                        🇮🇳 India
                      </option>
                      <option
                        value="Maldives"
                        className="bg-slate-800 text-white"
                      >
                        🇲🇻 Maldives
                      </option>
                      <option
                        value="Thailand"
                        className="bg-slate-800 text-white"
                      >
                        🇹🇭 Thailand
                      </option>
                      <option
                        value="Indonesia"
                        className="bg-slate-800 text-white"
                      >
                        🇮🇩 Indonesia
                      </option>
                      <option
                        value="Malaysia"
                        className="bg-slate-800 text-white"
                      >
                        🇲🇾 Malaysia
                      </option>
                      <option
                        value="Singapore"
                        className="bg-slate-800 text-white"
                      >
                        🇸🇬 Singapore
                      </option>
                      <option
                        value="Philippines"
                        className="bg-slate-800 text-white"
                      >
                        🇵🇭 Philippines
                      </option>
                      <option
                        value="Vietnam"
                        className="bg-slate-800 text-white"
                      >
                        🇻🇳 Vietnam
                      </option>
                      <option value="Nepal" className="bg-slate-800 text-white">
                        🇳🇵 Nepal
                      </option>
                      <option
                        value="Bangladesh"
                        className="bg-slate-800 text-white"
                      >
                        🇧🇩 Bangladesh
                      </option>
                      <option
                        value="Pakistan"
                        className="bg-slate-800 text-white"
                      >
                        🇵🇰 Pakistan
                      </option>
                      <option
                        value="United Arab Emirates"
                        className="bg-slate-800 text-white"
                      >
                        🇦🇪 United Arab Emirates
                      </option>
                      <option
                        value="Saudi Arabia"
                        className="bg-slate-800 text-white"
                      >
                        🇸🇦 Saudi Arabia
                      </option>
                      <option
                        value="United Kingdom"
                        className="bg-slate-800 text-white"
                      >
                        🇬🇧 United Kingdom
                      </option>
                      <option
                        value="United States"
                        className="bg-slate-800 text-white"
                      >
                        🇺🇸 United States
                      </option>
                      <option
                        value="Australia"
                        className="bg-slate-800 text-white"
                      >
                        🇦🇺 Australia
                      </option>
                      <option
                        value="Canada"
                        className="bg-slate-800 text-white"
                      >
                        🇨🇦 Canada
                      </option>
                      <option
                        value="Germany"
                        className="bg-slate-800 text-white"
                      >
                        🇩🇪 Germany
                      </option>
                      <option
                        value="France"
                        className="bg-slate-800 text-white"
                      >
                        🇫🇷 France
                      </option>
                      <option value="Other" className="bg-slate-800 text-white">
                        🌍 Other
                      </option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                      ▼
                    </div>
                  </div>

                  {/* District - Only show when country is selected */}
                  {formData.country && (
                    <div className="relative">
                      <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                      <select
                        name="district"
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all appearance-none cursor-pointer"
                        value={formData.district}
                        onChange={handleChange}
                        required
                      >
                        <option value="" className="bg-slate-800 text-white">
                          Select District/State
                        </option>
                        {getDistricts().map((district) => (
                          <option
                            key={district}
                            value={district}
                            className="bg-slate-800 text-white"
                          >
                            {district}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                        ▼
                      </div>
                    </div>
                  )}

                  {/* City - Only show when district is selected */}
                  {formData.district && (
                    <div className="relative">
                      <FaCity className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                      <select
                        name="city"
                        className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all appearance-none cursor-pointer"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      >
                        <option value="" className="bg-slate-800 text-white">
                          Select City
                        </option>
                        {getCities().map((city) => (
                          <option
                            key={city}
                            value={city}
                            className="bg-slate-800 text-white"
                          >
                            {city}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                        ▼
                      </div>
                    </div>
                  )}

                  {/* Stay or Vehicle Package Name */}
                  <div className="relative">
                    <FaHotel className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type="text"
                      name="packageName"
                      placeholder="Stay or Vehicle Package Name"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.packageName}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Category Selection */}
                  <div className="relative">
                    <FaBuilding className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <select
                      name="hotelName"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all appearance-none cursor-pointer"
                      value={formData.hotelName}
                      onChange={handleChange}
                      required
                    >
                      <option value="" className="bg-slate-800 text-white">
                        Select Category
                      </option>
                      <optgroup
                        label="Stays"
                        className="bg-slate-800 text-white"
                      >
                        <option
                          value="restaurant"
                          className="bg-slate-800 text-white"
                        >
                          Restaurant
                        </option>
                        <option
                          value="villas"
                          className="bg-slate-800 text-white"
                        >
                          Villas
                        </option>
                        <option
                          value="houses"
                          className="bg-slate-800 text-white"
                        >
                          Houses
                        </option>
                        <option
                          value="hotels"
                          className="bg-slate-800 text-white"
                        >
                          Hotels
                        </option>
                      </optgroup>
                      <optgroup
                        label="GoTrip"
                        className="bg-slate-800 text-white"
                      >
                        <option value="car" className="bg-slate-800 text-white">
                          Car
                        </option>
                        <option value="van" className="bg-slate-800 text-white">
                          Van
                        </option>
                        <option
                          value="safari-jeep"
                          className="bg-slate-800 text-white"
                        >
                          Safari Jeep
                        </option>
                        <option
                          value="tuktuk"
                          className="bg-slate-800 text-white"
                        >
                          Tuk Tuk
                        </option>
                      </optgroup>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">
                      ▼
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create Password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 transition-all"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-4 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Creating Account...
                      </span>
                    ) : (
                      "Create Account"
                    )}
                  </button>

                  {/* OTP Section */}
                  {otpSent && (
                    <div className="space-y-4 pt-4 border-t border-white/20">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Enter OTP"
                          className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all text-center text-lg tracking-widest"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleverifyOtp}
                        className="w-full bg-indigo-500 text-white font-semibold py-3 rounded-xl hover:bg-indigo-600 transition-all"
                      >
                        Verify OTP
                      </button>
                    </div>
                  )}

                  {/* Switch to Login */}
                  <p className="text-center text-white/60">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setsignIn(true)}
                      className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
                    >
                      Sign In
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 w-full max-w-md shadow-2xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {forgotOtpSent ? "Reset Password" : "Forgot Password"}
              </h2>
              <button
                onClick={() => {
                  setShowForgotPassword(false);
                  setForgotOtpSent(false);
                  setForgotEmail("");
                  setForgotOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="text-white/50 hover:text-white text-2xl transition-colors"
              >
                ×
              </button>
            </div>

            {!forgotOtpSent ? (
              <form onSubmit={handleForgotSendOtp} className="space-y-4">
                <p className="text-white/60 text-sm">
                  Enter your email address and we'll send you an OTP to reset
                  your password.
                </p>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-blue-500 text-white font-semibold py-3.5 rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <p className="text-white/60 text-sm">
                  Enter the OTP sent to your email and set your new password.
                </p>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 px-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all text-center tracking-widest"
                  value={forgotOtp}
                  onChange={(e) => setForgotOtp(e.target.value)}
                  required
                />
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="relative">
                  <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full bg-white/10 border border-white/20 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-blue-400 transition-all"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-green-500 text-white font-semibold py-3.5 rounded-xl hover:bg-green-600 transition-all disabled:opacity-50"
                >
                  {forgotLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
