import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { useNavigate } from "react-router-dom";

const SearchSafari = () => {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!search.trim()) {
      toast.warn("Please enter safari name");
      return;
    }

    try {
      const res = await axios.get(
        `${backendUrl}/api/safari/search`,
        {
          params: { name: search }, // ✅ SAFE
        }
      );

      setResult(res.data);

      if (res.data.length === 0) {
        toast.info("No safari found");
      }
    } catch (error) {
      // ✅ handle 404 separately
      if (error.response?.status === 404) {
        setResult([]);
        toast.info("No safari found");
      } else {
        toast.error("Search failed");
      }
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        Search Safari Package
      </h2>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter safari name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 text-white px-6 rounded"
        >
          Search
        </button>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {result.map((item) => (
          <div
            key={item._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-500">
                Rs. {item.price}
              </p>
            </div>

            <button
              onClick={() =>
                navigate(`/admin/safari/edit/${item._id}`)
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchSafari;
