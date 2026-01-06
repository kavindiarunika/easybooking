import React, { useContext, useEffect, useState } from "react";
import { TravelContext } from "../Context/TravelContext";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";
import Slider from "react-slick";

const Trending = () => {
  const { navigate, addtrend, setaddtrend } = useContext(TravelContext);

  // District filter list
  const districtFilters = [
    { label: "All Districts", value: "all" },
    { label: "Colombo", value: "Colombo" },
    { label: "Galle", value: "Galle" },
    { label: "Kandy", value: "Kandy" },
    { label: "Jaffna", value: "Jaffna" },
    { label: "Matara", value: "Matara" },
    { label: "Negombo", value: "Negombo" },
    { label: "Anuradhapura", value: "Anuradhapura" },
    { label: "Trincomalee", value: "Trincomalee" },
    { label: "Batticaloa", value: "Batticaloa" },
    { label: "Ampara", value: "Ampara" },
    { label: "Nuwara Eliya", value: "Nuwara Eliya" },
    { label: "Ratnapura", value: "Ratnapura" },
    { label: "Badulla", value: "Badulla" },
    { label: "Kurunegala", value: "Kurunegala" },
    { label: "Puttalam", value: "Puttalam" },
    { label: "Vavuniya", value: "Vavuniya" },
    { label: "Mullativu", value: "Mullativu" },
    { label: "Monaragala", value: "Monaragala" },
    { label: "Matale", value: "Matale" },
    { label: "Kegalle", value: "Kegalle" },
    { label: "Polonnaruwa", value: "Polonnaruwa" },
    { label: "Hambantota", value: "Hambantota" },
    { label: "Gampaha", value: "Gampaha" },
    { label: "Kalutara", value: "Kalutara" },
  ];

  const [selectedDistrict, setSelectedDistrict] = useState("all");

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 4,
    slidesToScroll: 4,
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 2 } },
    ],
  };

  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
        }/api/trending/trenddata`
      )
      .then((res) => {
        setaddtrend(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error(err));
  }, [setaddtrend]);

  const trends = Array.isArray(addtrend) ? addtrend : [];

  if (!trends.length) {
    return (
      <div className="text-center py-20 font-semibold">
        Loading trending data...
      </div>
    );
  }

  // Filter by district (case-insensitive); 'all' shows everything
  const filteredTrends = trends.filter((item) => {
    if (selectedDistrict === "all") return true;
    return (
      (item.district || "").toString().toLowerCase() ===
      selectedDistrict.toString().toLowerCase()
    );
  });

  // ✅ GROUP BY CATEGORY using filtered list
  const groupedByCategory = filteredTrends.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <section className="w-full py-16 px-4 md:px-16 space-y-20">
      {/* District filter */}
      <div className="flex items-center justify-end mb-6">
        <label className="mr-3 font-medium">Filter by District:</label>
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          {districtFilters.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      {Object.entries(groupedByCategory).map(([category, items]) => (
        <div key={category}>
          {/* Category Header */}
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold capitalize text-green-200">
              {category}s
            </h2>

            <button
              onClick={() => navigate(`villa`)}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
            >
              More <AiOutlineArrowRight />
            </button>
          </div>

          {/* Category Slider */}
          <Slider {...sliderSettings}>
            {items.map((item, index) => (
              <div key={index} className="px-3">
                <div
                  onClick={() => navigate(`/trending/${item.name}`)}
                  className="h-[250px] sm:h-[380px] w-48 sm:w-auto cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col"
                >
                  <img
                    src={item.mainImage || item.image || item.image1}
                    alt={item.name}
                    className=" h-[100px] sm:h-[200px] object-cover"
                  />

                  <div className="flex flex-col justify-between flex-1 p-4">
                    <div>
                      <h3 className="font-semibold text-lg truncate">
                        {item.name}
                      </h3>
                      <p className="text-green-700 font-bold mt-2">
                        Rs. {item.price?.toLocaleString() || "N/A"}
                      </p>
                    </div>

                    <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-xl hover:bg-green-600">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      ))}
    </section>
  );
};

export default Trending;
