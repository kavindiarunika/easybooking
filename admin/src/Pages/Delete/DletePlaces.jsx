import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const DletePlaces = () => {
  const [name, setname] = useState("");

  const handleDelate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warn("Please enter a place name");
      return;
    }

    const confirmed = window.confirm(`Delete place "${name}"?`);
    if (!confirmed) return;

    try {
      console.log("Deleting:", name, "backendUrl:", backendUrl);
      const res = await axios.delete(`${backendUrl}/api/travelplaces/delete`, {
        data: { name },
      });

      toast.success(res.data?.message || "Place deleted successfully");
      setname("");
    } catch (error) {
      console.error("Delete error:", error.response || error);
      const serverMsg =
        error.response?.data?.message ||
        error.response?.data?.massage ||
        error.message;
      toast.error(serverMsg || "Failed to delete place");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-xl font-semibold text-center mb-4">
          Delete Traveling Places Page
        </h1>

        <form onSubmit={handleDelate} className="space-y-4">
          <input
            type="text"
            placeholder="Enter visiting place..."
            value={name}
            onChange={(e) => setname(e.target.value)}
            className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
          />

          <button
            type="submit"
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </form>
      </div>
    </div>
  );
};

export default DletePlaces;
