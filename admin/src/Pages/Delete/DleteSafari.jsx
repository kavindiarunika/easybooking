import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const DeleteSafari = () => {
  const [safaris, setSafaris] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSafaris = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/safari/allsafari`);
      setSafaris(res.data.safaris || []);
    } catch (err) {
      toast.error("Failed to load safaris");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSafaris();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this safari?")) return;
    try {
      await axios.delete(`${backendUrl}/api/safari/deletesafari/${id}`);
      toast.success("Safari deleted");
      setSafaris((s) => s.filter((item) => item._id !== id));
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Delete Safari</h2>
      {loading ? (
        <p>Loading...</p>
      ) : safaris.length === 0 ? (
        <p>No safari packages found.</p>
      ) : (
        <div className="space-y-3">
          {safaris.map((s) => (
            <div key={s._id} className="border p-3 rounded flex justify-between">
              <div>
                <p className="font-semibold">{s.name}</p>
                <p className="text-sm text-gray-500">Rs. {s.price}</p>
              </div>
              <button
                onClick={() => handleDelete(s._id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeleteSafari;
