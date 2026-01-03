import React, { useContext, useEffect } from "react";
import { TravelContext } from "../Context/TravelContext";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";

const Trending = () => {
  const { navigate, addtrend, setaddtrend } = useContext(TravelContext);

  const schedule = (array) => {
    const scheduleArray = [...array];
    for (let i = scheduleArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [scheduleArray[i], scheduleArray[j]] = [
        scheduleArray[j],
        scheduleArray[i],
      ];
    }
    return scheduleArray;
  };

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedDate = localStorage.getItem("trendingShuffleDate");
    const savedData = localStorage.getItem("trendingShuffleData");

    // ✅ Use cached daily data
    if (savedData && savedDate === today) {
      setaddtrend(JSON.parse(savedData));
      return;
    }

    // ✅ Fetch fresh data
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
        }/api/trending/trenddata`
      )
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        const scheduledData = schedule(data);

        localStorage.setItem("trendingShuffleDate", today);
        localStorage.setItem(
          "trendingShuffleData",
          JSON.stringify(scheduledData)
        );

        setaddtrend(scheduledData);
      })
      .catch((err) => console.error("Failed to fetch trending hotels:", err));
  }, [setaddtrend]);

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
      {/* Header */}
      <div className="flex flex-row items-center justify-between mb-12 p-4 rounded-xl shadow-md ">
        <h2 className="text-2xl sm:text-4xl font-bold text-green-200">Book Your Hotel</h2>
        <button
          onClick={() => navigate("/villa")}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
        >
          More <AiOutlineArrowRight />
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {trends.slice(0, 8).map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(`/trending/${item.name}`)}
            className="cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:scale-105 transition bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200"
          >
            <img
              src={item.mainImage || item.image || item.image1}
              alt={item.name}
              className="w-full h-52 object-cover"
            />

            <div className="p-4">
              <div className="flex justify-between mb-4">
                <span className="font-semibold text-lg">{item.name}</span>
                <span className="text-green-600 font-bold">
                  Rs. {item.price?.toLocaleString() || "N/A"}
                </span>
              </div>

              <button className="w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600 transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Trending;
