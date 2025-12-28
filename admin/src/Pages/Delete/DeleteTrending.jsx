import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";

const DeleteTrending = ({ token }) => {
  const [deleteName, setDeleteName] = useState("");
  const [trendingItems, setTrendingItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing trending items on component mount
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
      console.error("Error fetching trending items:", err);
      toast.warning("Could not load existing items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteName.trim()) {
      toast.error("Please enter a name to delete.");
      return;
    }

    try {
      // URL encode the name to handle spaces and special characters
      const encodedName = encodeURIComponent(deleteName);
      const deleteUrl = `${backendUrl}/api/trending/delete/${encodedName}`;
      console.log("Backend URL:", backendUrl);
      console.log("Full request URL:", deleteUrl);
      console.log("Token:", token ? "Present" : "Missing");

      const res = await axios.delete(deleteUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Trending item deleted!");
        setDeleteName("");
        // Refresh the list after deletion
        fetchTrendingItems();
        // Notify other tabs/clients to refresh their trending data
        try {
          localStorage.setItem("trendingUpdatedAt", String(Date.now()));
        } catch (e) {
          console.warn("Could not write trendingUpdatedAt to localStorage", e);
        }
      } else {
        toast.error(res.data.message || "Failed to delete trending item.");
      }
    } catch (err) {
      console.error("Delete Error:", {
        message: err.message,
        status: err.response?.status,
        url: err.config?.url,
        data: err.response?.data,
      });
      toast.error(
        `Error: ${
          err.response?.status === 404
            ? "Item not found - verify the exact name"
            : "Error deleting trending item."
        }`
      );
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-red-600">
        Delete Trending Item
      </h2>
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-500">Loading items...</p>
        ) : trendingItems.length > 0 ? (
          <select
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
            className="w-full border px-3 py-2 rounded-md outline-none bg-white"
          >
            <option value="">-- Select an item to delete --</option>
            {trendingItems.map((item) => (
              <option key={item._id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            value={deleteName}
            onChange={(e) => setDeleteName(e.target.value)}
            placeholder="Enter name to delete"
            className="w-full border px-3 py-2 rounded-md outline-none"
          />
        )}
        <button
          onClick={handleDelete}
          disabled={!deleteName.trim()}
          className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Delete Trending
        </button>
      </div>
      <ToastContainer position="top-center" autoClose={4000} />
    </div>
  );
};

export default DeleteTrending;
