import React, { useContext, useEffect, useState } from "react";
import { TravelContext } from "../Context/TravelContext";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";
import Slider from "react-slick";
import { BACKEND_URL } from "../App";
import HomeAds from "../Components/HomeAds";

const Trending = () => {
  const { navigate, addtrend, setaddtrend } = useContext(TravelContext);

  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [ads, setAds] = useState([]);

  /* ---------------- Slider Settings ---------------- */
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "15px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "10px",
        },
      },
    ],
  };

  /* ---------------- Fetch Ads ---------------- */
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/ads/getads`);
        // The response is an object with homeAd, villaad, goTripAd properties
        setAds(res.data || {});
      } catch (err) {
        console.error("Ads error:", err);
        setAds({});
      }
    };
    fetchAds();
  }, []);

  /* ---------------- Fetch Trending Data ---------------- */
  useEffect(() => {
    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
        }/api/trending/trenddata`,
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

  /* ---------------- Filter by District ---------------- */
  const filteredTrends = trends.filter((item) => {
    if (selectedDistrict === "all") return true;
    return item.district?.toLowerCase() === selectedDistrict.toLowerCase();
  });

  /* ---------------- Group by Category ---------------- */
  const groupedByCategory = filteredTrends.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <section className="w-full py-16 px-4 md:px-16 space-y-20">
      {Object.entries(groupedByCategory).map(([category, items], index) => (
        <React.Fragment key={category}>
          {/* ================= CATEGORY SECTION ================= */}
          <div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl sm:text-2xl font-bold capitalize text-green-200">
                {category}s
              </h2>

              <button
                onClick={() => navigate(`/villa/${category}`)}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700"
              >
                More <AiOutlineArrowRight />
              </button>
            </div>

            <Slider {...sliderSettings}>
              {items.map((item, i) => (
                <div key={i} className="px-2">
                  <div
                    onClick={() => navigate(`/trending/${item.name}`)}
                    className="h-[220px] sm:h-[380px] w-[150px] sm:w-full cursor-pointer rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 flex flex-col"
                  >
                    <div className="relative">
                           <img
                      src={item.mainImage || item.image || item.image1}
                      alt={item.name}
                      className=" h-[90px] sm:h-[200px] w-full object-cover"
                    />
                     <h1 className="absolute top-2 right-2 bg-green-300 text-black rounded-full p-4">-10%</h1>
                    </div>
                  
                    <div className="flex flex-col justify-between flex-1 p-3 sm:p-4">
                      <div>
                        <h3 className="font-semibold text-sm sm:text-lg truncate">
                          {item.name}
                        </h3>
                        <p className="text-green-700 font-bold mt-1 sm:mt-2 text-sm">
                          Rs. {item.price?.toLocaleString() || "N/A"}
                        </p>
                        <p className="text-sm text-gray-800 line-clamp-2">
                        {item.description}
                        </p>
                      </div>

                      <button className="hidden sm:block mt-2 sm:mt-4 w-full bg-green-500 text-white py-1.5 sm:py-2 rounded-xl hover:bg-green-600 text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          {(index + 1) % 2 === 0 &&
            ads?.homeAd &&
            Array.isArray(ads.homeAd) &&
            ads.homeAd.length > 0 && (() => {
              const adBlockIndex = Math.floor((index + 1) / 2) - 1;
              const startIndex = adBlockIndex * 2;
              const firstAd = ads.homeAd[startIndex % ads.homeAd.length];
              const secondAd = ads.homeAd[(startIndex + 1) % ads.homeAd.length];
              return <HomeAds ads={[firstAd, secondAd]} />;
            })()}
        </React.Fragment>
      
      ))}
    </section>
  );
  
};

export default Trending;
