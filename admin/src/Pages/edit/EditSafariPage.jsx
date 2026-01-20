import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import EditSafari from "./EditSafari";

const EditSafariPage = () => {
  const { id } = useParams();
  const [selectedSafariId, setSelectedSafariId] = useState(null);
  const [safaris, setSafaris] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // If the page is opened via direct URL with :id, use it
  useEffect(() => {
    if (id) setSelectedSafariId(id);
  }, [id]);

  // Fetch all safaris on mount
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

  // Filter safaris based on search term
  const filteredSafaris = safaris.filter((safari) =>
    safari.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    safari.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditClick = (safariId) => {
    setSelectedSafariId(safariId);
    // Scroll to edit form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Safari</h2>

      {/* Edit Form - shows when a safari is selected */}
      {selectedSafariId && (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-lg border-2 border-green-500">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-600">Editing Safari</h3>
            <button
              onClick={() => setSelectedSafariId(null)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Close Editor
            </button>
          </div>
          <EditSafari safariId={selectedSafariId} onSuccess={fetchSafaris} />
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search safari by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Safari List */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">All Safari Packages ({filteredSafaris.length})</h3>
        
        {loading ? (
          <p className="text-center py-8">Loading safaris...</p>
        ) : filteredSafaris.length === 0 ? (
          <p className="text-center py-8 text-gray-500">No safari packages found.</p>
        ) : (
          <div className="grid gap-4">
            {filteredSafaris.map((safari) => (
              <div
                key={safari._id}
                className={`border p-4 rounded-lg flex justify-between items-center bg-white hover:shadow-md transition ${
                  selectedSafariId === safari._id ? 'border-green-500 border-2' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  {safari.images && safari.images[0] && (
                    <img
                      src={safari.images[0]}
                      alt={safari.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <p className="font-semibold text-lg">{safari.name}</p>
                    <p className="text-gray-500 text-sm">{safari.location}</p>
                    <p className="text-green-600 font-medium">Rs. {safari.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleEditClick(safari._id)}
                  className={`px-6 py-2 rounded font-medium transition ${
                    selectedSafariId === safari._id
                      ? 'bg-green-700 text-white'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedSafariId === safari._id ? 'Editing...' : 'Edit'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditSafariPage;
