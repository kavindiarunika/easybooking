import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../../App";
import "react-toastify/dist/ReactToastify.css";

const Stays = ({ token }) => {
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

  const vendorEmail = storedToken ? getEmailFromToken(storedToken) : null;

  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

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
      "Colombo": ["Colombo", "Dehiwala", "Moratuwa", "Kotte", "Maharagama", "Kesbewa"],
      "Gampaha": ["Negombo", "Gampaha", "Kelaniya", "Wattala", "Ja-Ela", "Minuwangoda"],
      "Kandy": ["Kandy", "Peradeniya", "Katugastota", "Gampola", "Nawalapitiya"],
      "Galle": ["Galle", "Hikkaduwa", "Ambalangoda", "Unawatuna", "Koggala"],
      "Matara": ["Matara", "Weligama", "Mirissa", "Dickwella", "Tangalle"],
      "Hambantota": ["Hambantota", "Tissamaharama", "Tangalle", "Ambalantota"],
      "Kalutara": ["Kalutara", "Panadura", "Beruwala", "Wadduwa", "Aluthgama"],
      "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Bandarawela", "Ella"],
      "Ratnapura": ["Ratnapura", "Balangoda", "Embilipitiya", "Kuruwita"],
      "Anuradhapura": ["Anuradhapura", "Mihintale", "Kekirawa", "Medawachchiya"],
      "Polonnaruwa": ["Polonnaruwa", "Kaduruwela", "Hingurakgoda"],
      "Kurunegala": ["Kurunegala", "Kuliyapitiya", "Polgahawela", "Mawathagama"],
      "Puttalam": ["Puttalam", "Chilaw", "Wennappuwa", "Kalpitiya"],
      "Trincomalee": ["Trincomalee", "Kinniya", "Kantale"],
      "Batticaloa": ["Batticaloa", "Kattankudy", "Eravur"],
      "Ampara": ["Ampara", "Kalmunai", "Akkaraipattu"],
      "Badulla": ["Badulla", "Bandarawela", "Haputale", "Welimada"],
      "Monaragala": ["Monaragala", "Wellawaya", "Bibile"],
      "Jaffna": ["Jaffna", "Chavakachcheri", "Point Pedro", "Nallur"],
      "Kilinochchi": ["Kilinochchi"],
      "Mannar": ["Mannar", "Talaimannar"],
      "Vavuniya": ["Vavuniya"],
      "Mullaitivu": ["Mullaitivu"],
      "Matale": ["Matale", "Dambulla", "Sigiriya", "Ukuwela"],
      "Kegalle": ["Kegalle", "Mawanella", "Rambukkana"]
    },
    "India": {
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
      "Karnataka": ["Bangalore", "Mysore", "Mangalore", "Hubli", "Belgaum"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem"],
      "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kollam"],
      "Delhi": ["New Delhi", "Delhi NCR"],
      "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
      "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Ajmer"],
      "West Bengal": ["Kolkata", "Darjeeling", "Siliguri", "Howrah"],
      "Goa": ["Panaji", "Margao", "Vasco da Gama", "Mapusa"]
    },
    "Maldives": {
      "Male": ["Male City", "Hulhumale", "Villimale"],
      "Ari Atoll": ["Mahibadhoo", "Maamigili"],
      "Baa Atoll": ["Eydhafushi", "Thulhaadhoo"],
      "Noonu Atoll": ["Manadhoo", "Holhudhoo"],
      "Addu Atoll": ["Hithadhoo", "Feydhoo", "Maradhoo"]
    },
    "Thailand": {
      "Bangkok": ["Bangkok", "Nonthaburi", "Pak Kret"],
      "Chiang Mai": ["Chiang Mai City", "San Kamphaeng", "Doi Saket"],
      "Phuket": ["Phuket Town", "Patong", "Kata", "Karon"],
      "Krabi": ["Krabi Town", "Ao Nang", "Railay"],
      "Pattaya": ["Pattaya City", "Jomtien", "Na Jomtien"],
      "Koh Samui": ["Chaweng", "Lamai", "Bophut"]
    },
    "Indonesia": {
      "Bali": ["Denpasar", "Ubud", "Seminyak", "Kuta", "Sanur"],
      "Jakarta": ["Central Jakarta", "South Jakarta", "North Jakarta"],
      "Yogyakarta": ["Yogyakarta City", "Sleman"],
      "West Java": ["Bandung", "Bogor", "Bekasi"],
      "East Java": ["Surabaya", "Malang"]
    },
    "Malaysia": {
      "Kuala Lumpur": ["KL City Centre", "Bukit Bintang", "Bangsar"],
      "Selangor": ["Petaling Jaya", "Shah Alam", "Subang Jaya"],
      "Penang": ["George Town", "Batu Ferringhi", "Butterworth"],
      "Johor": ["Johor Bahru", "Iskandar Puteri"],
      "Sabah": ["Kota Kinabalu", "Sandakan"],
      "Sarawak": ["Kuching", "Miri"]
    },
    "Singapore": {
      "Central Region": ["Orchard", "Marina Bay", "Chinatown", "Little India"],
      "East Region": ["Changi", "Tampines", "Bedok"],
      "West Region": ["Jurong", "Clementi"],
      "North Region": ["Woodlands", "Yishun"],
      "North-East Region": ["Sengkang", "Punggol"]
    },
    "Philippines": {
      "Metro Manila": ["Manila", "Makati", "Quezon City", "Taguig", "Pasig"],
      "Cebu": ["Cebu City", "Mandaue", "Lapu-Lapu"],
      "Palawan": ["Puerto Princesa", "El Nido", "Coron"],
      "Boracay": ["Boracay Island"],
      "Davao": ["Davao City"]
    },
    "Vietnam": {
      "Ho Chi Minh": ["District 1", "District 3", "District 7", "Binh Thanh"],
      "Hanoi": ["Hoan Kiem", "Ba Dinh", "Tay Ho"],
      "Da Nang": ["Da Nang City", "Hoi An"],
      "Nha Trang": ["Nha Trang City"],
      "Phu Quoc": ["Duong Dong"]
    },
    "Nepal": {
      "Bagmati": ["Kathmandu", "Lalitpur", "Bhaktapur"],
      "Gandaki": ["Pokhara", "Gorkha"],
      "Lumbini": ["Lumbini", "Butwal"]
    },
    "Bangladesh": {
      "Dhaka": ["Dhaka City", "Gazipur", "Narayanganj"],
      "Chittagong": ["Chittagong City", "Cox's Bazar"],
      "Sylhet": ["Sylhet City"]
    },
    "Pakistan": {
      "Punjab": ["Lahore", "Faisalabad", "Rawalpindi"],
      "Sindh": ["Karachi", "Hyderabad"],
      "Islamabad": ["Islamabad"]
    },
    "United Arab Emirates": {
      "Dubai": ["Dubai City", "Deira", "Jumeirah", "Marina"],
      "Abu Dhabi": ["Abu Dhabi City", "Al Ain"],
      "Sharjah": ["Sharjah City"],
      "Ajman": ["Ajman City"]
    },
    "Saudi Arabia": {
      "Riyadh": ["Riyadh City"],
      "Makkah": ["Mecca", "Jeddah"],
      "Eastern Province": ["Dammam", "Dhahran", "Khobar"]
    },
    "United Kingdom": {
      "England": ["London", "Manchester", "Birmingham", "Liverpool", "Leeds"],
      "Scotland": ["Edinburgh", "Glasgow"],
      "Wales": ["Cardiff", "Swansea"],
      "Northern Ireland": ["Belfast"]
    },
    "United States": {
      "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
      "New York": ["New York City", "Buffalo", "Albany"],
      "Florida": ["Miami", "Orlando", "Tampa"],
      "Texas": ["Houston", "Dallas", "Austin", "San Antonio"],
      "Nevada": ["Las Vegas", "Reno"]
    },
    "Australia": {
      "New South Wales": ["Sydney", "Newcastle", "Wollongong"],
      "Victoria": ["Melbourne", "Geelong"],
      "Queensland": ["Brisbane", "Gold Coast", "Cairns"],
      "Western Australia": ["Perth", "Fremantle"]
    },
    "Canada": {
      "Ontario": ["Toronto", "Ottawa", "Mississauga"],
      "British Columbia": ["Vancouver", "Victoria"],
      "Quebec": ["Montreal", "Quebec City"],
      "Alberta": ["Calgary", "Edmonton"]
    },
    "Germany": {
      "Bavaria": ["Munich", "Nuremberg"],
      "Berlin": ["Berlin City"],
      "Hamburg": ["Hamburg City"],
      "Hesse": ["Frankfurt", "Wiesbaden"]
    },
    "France": {
      "Île-de-France": ["Paris", "Versailles"],
      "Provence-Alpes-Côte d'Azur": ["Nice", "Marseille", "Cannes"],
      "Auvergne-Rhône-Alpes": ["Lyon", "Grenoble"]
    },
    "Other": {
      "Other": ["Other"]
    }
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
    if (formData.country && formData.district && locationData[formData.country]?.[formData.district]) {
      return locationData[formData.country][formData.district];
    }
    return [];
  };

  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState({
    mainImage: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    otherimages: [],
  });

  /* ================= FETCH EXISTING PROFILE ================= */
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
        }
      );

      if (res.data && res.data._id) {
        setHasProfile(true);
        setSelectedId(res.data._id);

        setFormData({
          ...res.data,
          availableThings: (res.data.availableThings || []).join(", "),
        });
      } else {
        setHasProfile(false);
        setSelectedId(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      }
    } catch (err) {
      // if profile not found, ensure state reflects no profile
      if (err.response?.status === 404) {
        setHasProfile(false);
        setSelectedId(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      } else {
        console.log(err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE INPUTS ================= */
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

  /* ================= SUBMIT (CREATE OR UPDATE) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage && !hasProfile) {
      toast.error("Main image is required");
      return;
    }

    const fd = new FormData();

    // append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "availableThings") {
        (value ? value.split(",").map((i) => i.trim()) : []).forEach((v) =>
          fd.append(key, v)
        );
      } else {
        fd.append(key, value);
      }
    });

    // append main image if exists
    if (media.mainImage) fd.append("mainImage", media.mainImage);

    // append other single images
    ["image", "image1", "image2", "image3", "image4"].forEach((field) => {
      if (media[field]) fd.append(field, media[field]);
    });

    // append other images
    media.otherimages?.forEach((file) => fd.append("otherimages", file));

    try {
      let res;
      if (hasProfile && selectedId) {
        // update existing profile
        res = await axios.put(
          `${BACKEND_URL}/api/trending/update/${selectedId}`,
          fd,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
      } else {
        // create new profile
        res = await axios.post(`${BACKEND_URL}/api/trending/add`, fd, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }

      if (res.data.success) {
        toast.success(hasProfile ? "Profile updated" : "Trending item added");

        // refresh profile after creation or update
        await fetchProfile();

        // reset if created
        if (!hasProfile) {
          setFormData(initialFormData);
          setMedia({
            mainImage: null,
            image: null,
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            otherimages: [],
          });
          document
            .querySelectorAll('input[type="file"]')
            .forEach((i) => (i.value = ""));
        }
      } else {
        toast.error("Operation failed");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  /* ================= UI ================= */
  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {hasProfile ? "Edit Stay Profile" : "Add Trending Item"}
        </h2>
        <button
          type="button"
          onClick={() => navigate("/")}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold transition"
        >
          ← Back to Home
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {Object.keys(formData)
          .filter(
            (key) =>
              ![
                "_id",
                "createdAt",
                "updatedAt",
                "mainImage",
                "image",
                "image1",
                "image2",
                "image3",
                "image4",
                "otherimages",
              ].includes(key)
          )
          .map((key) => (
            <div key={key}>
              <label className="block mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>

              {["description", "highlights"].includes(key) ? (
                <textarea
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              ) : key === "category" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  <option value="villa">Villa</option>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="house">House</option>
                </select>
              ) : key === "rating" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Star
                    </option>
                  ))}
                </select>
              ) : key === "country" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
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
              ) : key === "district" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  disabled={!formData.country}
                >
                  <option value="">Select District/State</option>
                  {getDistricts().map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              ) : key === "city" ? (
                <select
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                  disabled={!formData.district}
                >
                  <option value="">Select City</option>
                  {getCities().map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={key === "ownerEmail" ? "email" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              )}
            </div>
          ))}

        {/* MAIN IMAGE */}
        <div>
          <label className="font-semibold mr-4">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSingleFile(e, "mainImage")}
            required={!hasProfile}
          />
        </div>

        {/* IMAGE 1–5 */}
        {["image", "image1", "image2", "image3", "image4"].map((f, i) => (
          <div key={f}>
            <label>Image {i + 1}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSingleFile(e, f)}
            />
          </div>
        ))}

        {/* OTHER IMAGES */}
        <div>
          <label>Other Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleOtherImages}
          />
        </div>

        <button className="bg-blue-600 text-white py-2 rounded">
          {hasProfile ? "Save Changes" : "Add Trending"}
        </button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Stays;
