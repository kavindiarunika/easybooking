import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App.jsx";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaStar, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/trending/trenddata`
        );
        // Filter only hotels/villas and show first 6
        const hotelData = response.data.filter(
          (item) => item.category === "hotel" || item.category === "villa" || item.category === "house"
        ).slice(0, 6);
        setHotels(hotelData);
      } catch (error) {
        console.log("Error while fetching hotels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return (
      <section className="w-full py-16 px-4">
        <div className="text-center text-white">Loading hotels...</div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 p-4 rounded-xl shadow-md">
        <h2 className="text-4xl font-bold text-blue-200">
          Featured Hotels
        </h2>
        <Link to="/villa">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition">
            View All <AiOutlineArrowRight />
          </button>
        </Link>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((item) => (
          <Link
            to={`/trending/${item.name}`}
            key={item._id}
            className="group"
          >
            <div
              className="bg-white rounded-2xl overflow-hidden shadow-md
                         hover:shadow-2xl transition-all duration-300
                         hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative">
                {item.mainImage ? (
                  <img
                    src={item.mainImage}
                    alt={item.name}
                    className="w-full h-52 object-cover
                               group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                    No image
                  </div>
                )}

                {/* Category badge */}
                <div
                  className="absolute top-3 left-3 bg-blue-600 text-white
                             px-3 py-1 rounded-full text-sm font-semibold shadow capitalize"
                >
                  {item.category}
                </div>

                {/* Price badge */}
                <div
                  className="absolute top-3 right-3 bg-green-600 text-white
                             px-3 py-1 rounded-full text-sm font-semibold shadow"
                >
                  Rs.{item.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {item.name}
                </h3>

                {/* Location */}
                <div className="flex items-center gap-1 text-gray-500 text-sm mb-2">
                  <FaMapMarkerAlt className="text-red-500" />
                  <span>{item.location || item.district}</span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {item.description?.length > 80
                    ? item.description.slice(0, 80) + "..."
                    : item.description}
                </p>

                {/* Rating and Country */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-sm ${
                          i < (item.rating || 4) ? "text-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">
                      ({item.rating || 4} Star)
                    </span>
                  </div>
                  
                  {/* Country at bottom right - default to Sri Lanka */}
                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    <FaGlobe className="text-blue-500" />
                    <span>{item.country || "Sri Lanka"}</span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hotels.length === 0 && (
        <div className="text-center text-gray-400 py-10">
          No hotels available at the moment
        </div>
      )}
    </section>
  );
};

export default Hotels;
