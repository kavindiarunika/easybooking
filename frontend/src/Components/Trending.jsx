import React, { useContext, useEffect } from "react";
import { TravelContext } from "../Context/TravelContext";
import axios from "axios";
import { BACKEND_URL } from "../App";
import { AiFillStar, AiOutlineArrowRight } from "react-icons/ai";

const Trending = () => {
  const { navigate, addtrend, setaddtrend } = useContext(TravelContext);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/trending/trenddata`)
      .then((res) => setaddtrend(res.data))
      .catch((err) => console.error(err));
  }, [setaddtrend]);

  return (
    <section className="w-full py-16 px-4 md:px-16 ">
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
        {addtrend.slice(0, 8).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/trending/${item.name}`)}
            className="cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-500 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 border border-gray-200"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-52 object-cover rounded-t-3xl"
              />
              {/* Name badge */}
              <span className="absolute top-3 left-3 bg-blue-500/80 text-black px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                {item.name}
              </span>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col justify-between h-36">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-900 font-semibold text-lg">{item.name}</span>
                <span className="flex text-red-500">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                </span>
              </div>

              <button className="w-32 p-2 bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2 transform hover:scale-105">
                View Details <AiOutlineArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trending;
