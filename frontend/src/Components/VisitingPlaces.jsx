import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App";
import { useNavigate } from "react-router-dom";

const VisitingPlaces = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);

  // ✅ Fetch once
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/travelplaces`)
      .then((res) => {
        const data = res.data.travelPlaces || [];
        setPlaces(data.slice(0, 6));
      })
      .catch((err) => console.error(err));
  }, []);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path.slice(1) : path;
    return `${BACKEND_URL}/${cleanPath}`;
  };

  return (
    <div className="ml-2 sm:ml-8 mt-4 mr-4 sm:mr-16">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl sm:text-4xl font-bold text-green-200">
          Travel Sri Lanka
        </h2>

        <button
          onClick={() => navigate("/places")}
          className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
        >
          View All
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
        {places.map((place) => (
          <div key={place._id} className="p-2">
            <div className="rounded-lg shadow-md overflow-hidden text-white text-center">
              <button
                onClick={() =>
                  navigate(`/places/${place.district.toLowerCase()}`)
                }
              >
                <img
                  src={getImageUrl(place.mainImage)}
                  alt={place.name}
                  className="w-full h-24 sm:h-52 object-cover border-2 rounded-full hover:scale-105 transition duration-500 cursor-pointer"
                />
              </button>

              <h3 className="mt-2 text-sm sm:text-lg font-semibold">
                {place.name}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitingPlaces;
