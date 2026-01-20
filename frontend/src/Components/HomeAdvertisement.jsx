import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App";

const HomeAdvertisement = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URL}/api/ads/all`);
      if (response.data.success && response.data.data) {
        setAds(response.data.data.slice(0, 3)); // Show top 3 ads
      }
    } catch (err) {
      setError("Failed to load advertisements");
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-gray-400">Loading advertisements...</p>
        </div>
      </div>
    );
  }

  if (error || ads.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-8 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Featured <span className="text-orange-500">Advertisements</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Check out our exclusive partner offers and promotions
          </p>
        </div>

        {/* Advertisement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative h-48 md:h-56 overflow-hidden bg-gray-200">
                {ad.image ? (
                  <img
                    src={ad.image}
                    alt={ad.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
                {ad.discount && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {ad.discount}% OFF
                  </div>
                )}
              </div>

              {/* Content Container */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                  {ad.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {ad.description}
                </p>

                {/* Ad Details */}
                <div className="flex items-center justify-between mb-4">
                  {ad.price && (
                    <div className="text-xl font-bold text-orange-500">
                      Rs. {ad.price}
                    </div>
                  )}
                  {ad.originalPrice && (
                    <div className="text-sm text-gray-400 line-through">
                      Rs. {ad.originalPrice}
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-2 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all duration-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Ads Link */}
        <div className="text-center mt-8">
          <a
            href="/ads"
            className="inline-block px-8 py-3 border-2 border-orange-500 text-orange-500 font-semibold rounded-lg hover:bg-orange-500 hover:text-white transition-all duration-300"
          >
            View All Advertisements
          </a>
        </div>
      </div>
    </section>
  );
};

export default HomeAdvertisement;
