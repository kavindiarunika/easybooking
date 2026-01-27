import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiDollarSign,
} from "react-icons/fi";
import { toast } from "react-toastify";

const ShowStays = ({ token }) => {
  const [stays, setStays] = useState([]);
  const [filteredStays, setFilteredStays] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all"); // all, villa, house, hotel

  // Fetch all stays
  useEffect(() => {
    fetchStays();
  }, []);

  const fetchStays = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/trending/trenddata`);
      const data = Array.isArray(response.data) ? response.data : [];
      setStays(data);
      setFilteredStays(data);
    } catch (error) {
      console.error("Error fetching stays:", error);
      toast.error("Failed to fetch stays");
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let filtered = stays;

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((stay) => stay.category === filterType);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (stay) =>
          stay.name?.toLowerCase().includes(term) ||
          stay.description?.toLowerCase().includes(term) ||
          stay.district?.toLowerCase().includes(term) ||
          stay.address?.toLowerCase().includes(term),
      );
    }

    setFilteredStays(filtered);
  }, [searchTerm, filterType, stays]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this stay?")) return;

    try {
      await axios.delete(`${backendUrl}/api/trending/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Stay deleted successfully");
      fetchStays();
    } catch (error) {
      console.error("Error deleting stay:", error);
      toast.error("Failed to delete stay");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">
          Loading stays...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            All Stays & Villas
          </h1>
          <p className="text-gray-600">
            Manage and search through all accommodation listings
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-3 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by name, location, district, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilterType("all")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filterType === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stays.length})
            </button>
            <button
              onClick={() => setFilterType("villa")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filterType === "villa"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Villas ({stays.filter((s) => s.category === "villa").length})
            </button>
            <button
              onClick={() => setFilterType("house")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filterType === "house"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Houses ({stays.filter((s) => s.category === "house").length})
            </button>
            <button
              onClick={() => setFilterType("hotel")}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filterType === "hotel"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Hotels ({stays.filter((s) => s.category === "hotel").length})
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 font-semibold">
          Found {filteredStays.length} result
          {filteredStays.length !== 1 ? "s" : ""}
        </div>

        {/* Stays Grid */}
        {filteredStays.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStays.map((stay) => (
              <div
                key={stay._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {stay.mainImage ||
                  stay.image ||
                  stay.image1 ||
                  (stay.otherimages && stay.otherimages[0]) ? (
                    <img
                      src={
                        stay.mainImage ||
                        stay.image ||
                        stay.image1 ||
                        (stay.otherimages && stay.otherimages[0])
                      }
                      alt={stay.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold capitalize">
                    {stay.category}
                  </div>

                  {/* Rating Badge */}
                  {stay.rating && (
                    <div className="absolute top-3 right-3 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      ⭐ {stay.rating}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {stay.name}
                  </h3>

                  {/* District & Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FiMapPin className="text-red-500 flex-shrink-0" />
                    <span className="text-sm truncate">
                      {stay.district}, {stay.address || "Address not provided"}
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 text-gray-700 mb-4 text-lg font-bold">
                    <FiDollarSign className="text-green-600" />
                    <span>Rs.{stay.price}</span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {stay.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(stay._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>

                  {/* Additional Info */}
                  {stay.availableThings && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-xs text-gray-500 font-semibold mb-2">
                        AMENITIES
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {stay.availableThings
                          .slice(0, 3)
                          .map((amenity, idx) => (
                            <span
                              key={idx}
                              className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        {stay.availableThings.length > 3 && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">
                            +{stay.availableThings.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm || filterType !== "all"
                ? "No stays found matching your search criteria"
                : "No stays available"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowStays;
