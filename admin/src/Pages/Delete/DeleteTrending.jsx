
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import { FiTrash2, FiMapPin, FiGlobe, FiMap, FiLoader, FiAlertCircle } from "react-icons/fi";


const DeleteTrending = ({ token }) => {
  const [deleteId, setDeleteId] = useState("");
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null);

  // Location data for cascading dropdowns
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
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
      "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
      "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
      "Delhi": ["New Delhi", "Delhi NCR"],
      "Goa": ["Panaji", "Margao", "Vasco da Gama"]
    },
    "Maldives": {
      "Male": ["Male City", "Hulhumale", "Villimale"],
      "Ari Atoll": ["Mahibadhoo", "Maamigili"],
      "Baa Atoll": ["Eydhafushi", "Thulhaadhoo"]
    },
    "Thailand": {
      "Bangkok": ["Bangkok", "Nonthaburi"],
      "Phuket": ["Phuket Town", "Patong", "Kata"],
      "Chiang Mai": ["Chiang Mai City", "San Kamphaeng"]
    },
    "Other": {
      "Other": ["Other"]
    }
  };

  const getDistricts = (country) => {
    if (!country || !locationData[country]) return [];
    return Object.keys(locationData[country]);
  };
  const getCities = (country, district) => {
    if (!country || !district || !locationData[country]?.[district]) return [];
    return locationData[country][district];
  };

  useEffect(() => {
    fetchTrendingItems();
  }, []);

  const fetchTrendingItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/trending/trenddata`);
      if (Array.isArray(res.data)) {
        setTrendingItems(res.data);
      }
    } catch (err) {
      toast.warning("Could not load existing items");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setDeleteId(id);
    setSelected(trendingItems.find((item) => item._id === id) || null);
  };

  const handleDelete = async () => {
    if (!deleteId) {
      toast.error("Please select a stay to delete.");
      return;
    }
    setDeleting(true);
    try {
      const res = await axios.delete(`${backendUrl}/api/trending/delete/${deleteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        toast.success("Stay deleted!");
        setDeleteId("");
        setSelected(null);
        fetchTrendingItems();
        try {
          localStorage.setItem("trendingUpdatedAt", String(Date.now()));
        } catch (e) {}
      } else {
        toast.error(res.data.message || "Failed to delete stay.");
      }
    } catch (err) {
      toast.error("Error deleting stay.");
    } finally {
      setDeleting(false);
    }
  };


  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2 mb-4">
          <FiTrash2 className="text-red-500" /> Delete Stay / Trending Item
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FiTrash2 className="text-red-400" /> Select Stay to Delete
          </label>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500"><FiLoader className="animate-spin" /> Loading stays...</div>
          ) : (
            <select
              value={deleteId}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
            >
              <option value="">-- Select a stay to delete --</option>
              {trendingItems.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name} ({item.country}, {item.district}, {item.city})
                </option>
              ))}
            </select>
          )}
        </div>

        {selected && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border flex flex-col gap-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <FiMapPin className="text-blue-500" /> {selected.name}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-gray-600">
              <span className="flex items-center gap-1"><FiGlobe className="text-green-500" /> {selected.country}</span>
              <span className="flex items-center gap-1"><FiMap className="text-purple-500" /> {selected.district}</span>
              <span className="flex items-center gap-1"><FiMapPin className="text-orange-500" /> {selected.city}</span>
            </div>
            <div className="text-gray-500 text-xs mt-1">{selected.address}</div>
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={!deleteId || deleting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? (
            <><FiLoader className="animate-spin" /> Deleting...</>
          ) : (
            <><FiTrash2 /> Delete Stay</>
          )}
        </button>
        <div className="mt-4 text-xs text-gray-400 flex items-center gap-2">
          <FiAlertCircle className="text-yellow-400" /> This action cannot be undone.
        </div>
        <ToastContainer position="top-center" autoClose={4000} />
      </div>
    </div>
  );
};

export default DeleteTrending;
