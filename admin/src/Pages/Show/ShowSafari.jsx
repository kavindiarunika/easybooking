import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import {
  FiSearch,
  FiEdit2,
  FiTrash2,
  FiMapPin,
  FiDollarSign,
  FiUsers,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-toastify";

const ShowSafari = ({ token }) => {
  const [safaris, setSafaris] = useState([]);
  const [filteredSafaris, setFilteredSafaris] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");

  // Fetch all safaris
  useEffect(() => {
    fetchSafaris();
  }, []);

  const fetchSafaris = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/safari/allsafari`);
      const data = response.data?.safaris || response.data || [];
      const safariArray = Array.isArray(data) ? data : [];
      setSafaris(safariArray);
      setFilteredSafaris(safariArray);
    } catch (error) {
      console.error("Error fetching safaris:", error);
      toast.error("Failed to fetch safaris");
    } finally {
      setLoading(false);
    }
  };

  // Handle search and filter
  useEffect(() => {
    let filtered = safaris;

    // Filter by category
    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (safari) => safari.category === filterCategory,
      );
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (safari) =>
          safari.name?.toLowerCase().includes(term) ||
          safari.description?.toLowerCase().includes(term) ||
          safari.GuiderName?.toLowerCase().includes(term) ||
          safari.adventures?.some((adv) => adv.toLowerCase().includes(term)) ||
          safari.includeplaces?.some((place) =>
            place.toLowerCase().includes(term),
          ),
      );
    }

    setFilteredSafaris(filtered);
  }, [searchTerm, filterCategory, safaris]);

  // Get unique categories
  const categories = ["all", ...new Set(safaris.map((s) => s.category))];

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this safari?")) return;

    try {
      await axios.delete(`${backendUrl}/api/safari/deletesafari/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Safari deleted successfully");
      fetchSafaris();
    } catch (error) {
      console.error("Error deleting safari:", error);
      toast.error("Failed to delete safari");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold text-gray-600">
          Loading safaris...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">All Safaris</h1>
          <p className="text-gray-600">
            Manage and search through all safari adventures
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <FiSearch className="absolute left-4 top-3 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search by name, guide, location, or adventure type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-6 py-2 rounded-lg font-semibold transition capitalize ${
                  filterCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category === "all" ? "All" : category} (
                {
                  safaris.filter(
                    (s) => category === "all" || s.category === category,
                  ).length
                }
                )
              </button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-gray-600 font-semibold">
          Found {filteredSafaris.length} result
          {filteredSafaris.length !== 1 ? "s" : ""}
        </div>

        {/* Safaris Grid */}
        {filteredSafaris.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSafaris.map((safari) => (
              <div
                key={safari._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  {safari.mainImage || safari.otherimages?.[0] ? (
                    <img
                      src={safari.mainImage || safari.otherimages?.[0]}
                      alt={safari.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      No image
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-amber-600 text-white px-4 py-1 rounded-full text-sm font-semibold capitalize">
                    {safari.category}
                  </div>

                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Rs.{safari.price}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                    {safari.name}
                  </h3>

                  {/* Guide Info */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FiUsers className="text-blue-500 flex-shrink-0" />
                    <span className="text-sm truncate font-semibold">
                      Guide: {safari.GuiderName}
                    </span>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <FiCalendar className="text-purple-500 flex-shrink-0" />
                    <span className="text-sm">
                      {safari.totalDays} Day{safari.totalDays > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Team Size */}
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <FiUsers className="text-orange-500 flex-shrink-0" />
                    <span className="text-sm">
                      Team Size: {safari.TeamMembers}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {safari.description}
                  </p>

                  {/* Adventure Types */}
                  {safari.adventures && safari.adventures.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 font-semibold mb-2">
                        ADVENTURES
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {safari.adventures.slice(0, 2).map((adv, idx) => (
                          <span
                            key={idx}
                            className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full"
                          >
                            {adv}
                          </span>
                        ))}
                        {safari.adventures.length > 2 && (
                          <span className="bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded-full">
                            +{safari.adventures.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Includes */}
                  {safari.includeplaces && safari.includeplaces.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 font-semibold mb-2">
                        INCLUDES
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {safari.includeplaces.slice(0, 2).map((place, idx) => (
                          <span
                            key={idx}
                            className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full"
                          >
                            {place}
                          </span>
                        ))}
                        {safari.includeplaces.length > 2 && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full">
                            +{safari.includeplaces.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Vehicle Type */}
                  <div className="mb-4 pb-4 border-t border-gray-200 pt-4">
                    <p className="text-xs text-gray-500 font-semibold mb-1">
                      VEHICLE
                    </p>
                    <p className="text-sm font-semibold text-gray-700">
                      {safari.VehicleType}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold">
                      <FiEdit2 /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(safari._id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchTerm || filterCategory !== "all"
                ? "No safaris found matching your search criteria"
                : "No safaris available"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowSafari;
