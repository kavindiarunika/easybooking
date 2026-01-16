import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../App.jsx";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

const Safari = () => {
  const [safari, setSafari] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSafari = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/safari/allsafari`
        );

        // show only first 5 safaris
        setSafari(response.data.safaris.slice(0, 6));
      } catch (error) {
        console.log("Error while fetching safari:", error);
      }
    };

    fetchSafari(); // ✅ correctly called
  }, []);

  return (
    <section className="w-full py-16 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 p-4 rounded-xl shadow-md">
        <h2 className="text-4xl font-bold text-green-200">
          Safari Packages
        </h2>
        <Link to="/safarihome">
          <button
         
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          More <AiOutlineArrowRight />
        </button></Link>
      
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {safari.map((item) => (
          <Link
            to={`/safaridetails/${item._id}`}
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

                {/* Price badge */}
                <div
                  className="absolute top-3 right-3 bg-green-600 text-white
                             px-3 py-1 rounded-full text-sm font-semibold shadow"
                >
                  LKR {item.price}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                  {item.description?.length > 100
                    ? item.description.slice(0, 100) + "..."
                    : item.description}
                </p>

                {/* Info row */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>👥 {item.TeamMembers} Members</span>
                  <span>🗓 {item.totalDays} Days</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Safari;
