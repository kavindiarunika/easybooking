import React, { useContext, useEffect } from "react";
import { TravelContext } from "../../Context/TravelContext";
import axios from "axios";
import { BACKEND_URL } from "../../App";
import { AiFillStar, AiOutlineArrowRight } from "react-icons/ai";
import HotelHero from "./HotelHero";

const Villa = () => {
  const { navigate, addtrend, setaddtrend } = useContext(TravelContext);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/trending/trenddata`)
      .then((res) => setaddtrend(res.data))
      .catch((err) => console.error(err));
  }, [setaddtrend]);

  return (
    <section className="w-full py-16 px-4 md:px-16 bg-slate-950">


<p className="w-full h-24"></p>
      <HotelHero/>
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
     
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {addtrend.map((item, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-br from-green-50 via-green-100 to-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer"
            onClick={() => navigate(`/trending/${item.name}`)}
          >
            {/* Image */}
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-64 object-cover rounded-t-3xl group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-500 rounded-t-3xl"></div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col gap-3">
              {/* Name and rating */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                <div className="flex text-yellow-400">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                </div>
              </div>

              {/* Short description */}
              <p className="text-gray-600 text-sm">
                Enjoy a luxurious stay at {item.name}, equipped with modern
                amenities, stunning views, and comfort.
              </p>

              {/* Button */}
              <button className="mt-2 w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2 transform hover:scale-105">
                View Details <AiOutlineArrowRight />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Villa;
