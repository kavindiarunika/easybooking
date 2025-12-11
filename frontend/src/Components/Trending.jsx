import React, { useContext, useEffect } from "react";
import { TravelContext } from "../Context/TravelContext";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";

const Trending = () => {
  const { navigate, addtrend, setaddtrend } = useContext(TravelContext);

  useEffect(() => {
    if (!Array.isArray(addtrend) || addtrend.length === 0) {
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
          }/api/trending/trenddata`
        )
        .then((res) => {
          const data = Array.isArray(res.data) ? res.data : [];
          setaddtrend(data);
        })
        .catch((err) => console.error("Failed to fetch trending hotels:", err));
    }
  }, [addtrend, setaddtrend]);

  const trends = Array.isArray(addtrend) ? addtrend : [];

  if (trends.length === 0) {
    return (
      <div className="text-gray-900 text-center py-20 text-lg font-semibold">
        Loading trending hotels...
      </div>
    );
  }

  return (
    <section className="w-full py-16 px-4 md:px-16">
      <p className="w-full h-12"></p>

      {/* Header */}
      <div className="flex items-center justify-between mb-12 p-4 rounded-xl shadow-md">
        <h2 className="text-4xl font-bold text-green-200">Book Your Hotel</h2>
        <button
          onClick={() => navigate("/trending")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition transform hover:scale-105"
        >
          More <AiOutlineArrowRight />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {trends.slice(0, 8).map((item, index) => {
          // Build images list: start with main image, then additional images
          const images =
            item.images && item.images.length
              ? [item.image, ...item.images].filter(Boolean)
              : [
                  item.image,
                  item.image1,
                  item.image2,
                  item.image3,
                  item.image4,
                  item.image5,
                  item.image6,
                ].filter(Boolean);

          return (
            <div
              key={index}
              onClick={() => navigate(`/trending/${item.name}`)}
              className="cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 border border-gray-200"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={images[0] || item.image}
                  alt={item.name}
                  className="w-full h-52 object-cover rounded-t-3xl"
                />

                <span className="absolute top-3 left-3 bg-blue-500/80 text-black px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {item.name}
                </span>

                {images.length > 5 && (
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trending/${item.name}/gallery`);
                    }}
                    className="absolute bottom-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold cursor-pointer"
                  >
                    +{images.length - 5}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex flex-col justify-between h-36">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-900 font-semibold text-lg">
                    {item.name}
                  </span>
                  <span className="text-green-600 font-bold text-lg">
                    Rs. {item.price ? item.price.toLocaleString() : "N/A"}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/trending/${item.name}`)}
                  className="w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2 transform hover:scale-105"
                >
                  View Details <AiOutlineArrowRight />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Trending;
