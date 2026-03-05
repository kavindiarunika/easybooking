import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import { FiTrash2, FiLoader, FiMapPin, FiTruck } from "react-icons/fi";

const DeleteVehicle = ({ token }) => {
  const [deleteId, setDeleteId] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/vehicle/all`);
      if (Array.isArray(res.data)) {
        setVehicles(res.data);
      }
    } catch (err) {
      toast.warning("Could not load vehicles");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setDeleteId(id);
    setSelected(vehicles.find((v) => v._id === id) || null);
  };

  const handleDelete = async () => {
    if (!deleteId) {
      toast.error("Please select a vehicle to delete.");
      return;
    }
    setDeleting(true);
    try {
      const res = await axios.delete(
        `${backendUrl}/api/vehicle/delete/${deleteId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (res.data.success) {
        toast.success("Vehicle deleted!");
        setDeleteId("");
        setSelected(null);
        fetchVehicles();
      } else {
        toast.error(res.data.message || "Failed to delete vehicle.");
      }
    } catch (err) {
      toast.error("Error deleting vehicle.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-red-600 flex items-center gap-2 mb-4">
          <FiTrash2 className="text-red-500" /> Delete Vehicle
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
            <FiTrash2 className="text-red-400" /> Select vehicle to delete
          </label>
          {loading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <FiLoader className="animate-spin" /> Loading vehicles...
            </div>
          ) : (
            <select
              value={deleteId}
              onChange={(e) => handleSelect(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-red-400 focus:border-transparent transition"
            >
              <option value="">-- Select a vehicle --</option>
              {vehicles.map((v) => (
                <option key={v._id} value={v._id}>
                  {v.name} ({v.district || v.discrict})
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
            <div className="text-sm text-gray-600">
              Type: {selected.type} | District:{" "}
              {selected.district || selected.discrict} | Price: {selected.Price}
            </div>
          </div>
        )}

        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold"
        >
          {deleting ? "Deleting..." : "Delete Vehicle"}
        </button>
      </div>
    </div>
  );
};

export default DeleteVehicle;
