import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiTrash2, FiMapPin, FiDollarSign, FiCalendar, FiAlertTriangle } from "react-icons/fi";

const RemoveStays = ({ token }) => {
  const [stays, setStays] = useState([]);
  const [selectedStayId, setSelectedStayId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  // Location data for display
  const locationData = {
    "Sri Lanka": {
      "Western Province": ["Colombo", "Dehiwala", "Moratuwa", "Kotte", "Maharagama", "Kesbewa"],
      "Central Province": ["Kandy", "Peradeniya", "Katugastota", "Gampola", "Nawalapitiya"],
      "Southern Province": ["Galle", "Hikkaduwa", "Ambalangoda", "Unawatuna", "Koggala"],
      "Western Province (Coastal)": ["Kalutara", "Panadura", "Beruwala", "Wadduwa", "Aluthgama"],
      "Central Highlands": ["Nuwara Eliya", "Hatton", "Bandarawela", "Ella"],
      "Sabaragamuwa": ["Ratnapura", "Balangoda", "Embilipitiya", "Kuruwita"],
      "North Central": ["Anuradhapura", "Mihintale", "Kekirawa", "Medawachchiya"],
      "Eastern": ["Trincomalee", "Batticaloa", "Ampara", "Kalmunai"],
      "Uva": ["Badulla", "Bandarawela", "Haputale", "Welimada"],
      "North Western": ["Kurunegala", "Kuliyapitiya", "Polgahawela", "Mawathagama"],
      "Northern": ["Jaffna", "Chavakachcheri", "Point Pedro", "Nallur"],
    }
  };

  // Fetch all stays
  useEffect(() => {
    const fetchStays = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/trending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStays(res.data?.trending || []);
      } catch (err) {
        toast.error("Failed to fetch stays");
      } finally {
        setLoading(false);
      }
    };
    fetchStays();
  }, [token]);

  // Handle delete
  const handleDeleteClick = (stayId) => {
    setSelectedStayId(stayId);
    setConfirmDelete(true);
  };

  const confirmDeleteStay = async () => {
    if (!selectedStayId) return;

    setDeleting(true);
    try {
      const res = await axios.delete(
        `${backendUrl}/api/trending/${selectedStayId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Stay removed successfully!");
        setStays(stays.filter((stay) => stay._id !== selectedStayId));
        setSelectedStayId(null);
        setConfirmDelete(false);
      } else {
        toast.error(res.data?.message || "Failed to delete stay");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting stay");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading stays...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-red-600 to-red-700 px-8 py-6">
            <div className="flex items-center gap-3 mb-2">
              <FiTrash2 className="text-2xl text-white" />
              <h1 className="text-3xl font-bold text-white">Remove Stays</h1>
            </div>
            <p className="text-red-100">
              {stays.length} stay{stays.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {/* No Stays */}
        {stays.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <FiTrash2 className="mx-auto text-5xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Stays Found</h2>
            <p className="text-gray-600 mb-6">There are currently no stays to remove.</p>
            <button
              onClick={() => navigate("/home")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Go to Home
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stays.map((stay) => (
              <div
                key={stay._id}
                className={`bg-white rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 ${
                  selectedStayId === stay._id ? "ring-2 ring-red-500" : ""
                }`}
              >
                {/* Image */}
                {stay.images && stay.images.length > 0 && (
                  <div className="h-48 overflow-hidden bg-gray-200">
                    <img
                      src={stay.images[0]}
                      alt={stay.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                      }}
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-bold text-gray-800 mb-2 truncate">{stay.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{stay.description}</p>

                  {/* Details */}
                  <div className="space-y-2 mb-4">
                    {stay.city && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiMapPin className="text-blue-500" size={16} />
                        <span className="text-sm">{stay.city}</span>
                      </div>
                    )}
                    {stay.price && (
                      <div className="flex items-center gap-2 text-gray-700">
                        <FiDollarSign className="text-green-500" size={16} />
                        <span className="text-sm font-semibold">Rs. {stay.price}</span>
                      </div>
                    )}
                  </div>

                  {/* Selection & Action Buttons */}
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition">
                      <input
                        type="checkbox"
                        checked={selectedStayId === stay._id}
                        onChange={(e) =>
                          e.target.checked
                            ? setSelectedStayId(stay._id)
                            : setSelectedStayId(null)
                        }
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {selectedStayId === stay._id ? "Selected for deletion" : "Select to delete"}
                      </span>
                    </label>

                    {selectedStayId === stay._id && (
                      <button
                        onClick={() => handleDeleteClick(stay._id)}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <FiTrash2 size={18} />
                        Delete This Stay
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Confirmation Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
              {/* Header */}
              <div className="bg-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <FiAlertTriangle className="text-2xl text-white" />
                  <h2 className="text-2xl font-bold text-white">Confirm Deletion</h2>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-700 mb-4">
                  Are you sure you want to delete this stay? This action cannot be undone.
                </p>
                {selectedStayId && stays.find((s) => s._id === selectedStayId) && (
                  <div className="bg-gray-100 p-4 rounded-lg mb-6">
                    <p className="text-sm font-semibold text-gray-800">
                      {stays.find((s) => s._id === selectedStayId)?.title}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="bg-gray-50 px-6 py-4 flex gap-3">
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-lg transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteStay}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveStays;
