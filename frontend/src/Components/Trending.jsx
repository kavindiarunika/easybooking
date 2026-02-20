import React, { useContext, useEffect, useState } from "react";
import { TravelContext } from "../Context/TravelContext";
import axios from "axios";
import { AiOutlineArrowRight } from "react-icons/ai";
import Slider from "react-slick";
import { BACKEND_URL } from "../App";
import HomeAds from "../Components/HomeAds";
import { IoIosStar } from "react-icons/io";
import { IoIosStarHalf } from "react-icons/io";

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
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "15px",
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
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
              <h2 className="text-xl sm:text-2xl font-bold capitalize text-black">
                {category}s
              </h2>

              <button
                onClick={() => navigate(`/villa/${category}`)}
                className="flex items-center gap-2 bg-green-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-xl hover:bg-green-700"
              >
                More <AiOutlineArrowRight />
              </button>
            </div>

            <Slider {...sliderSettings}>
              {items.slice(0,5).map((hotel , index ) =>(
                <div  key={index}>
                         <div className='bg-white rounded-2xl p-2 relative h-64 sm:h-96'>
                             <p className='absolute top-2 right-4 bg-green-500 text-black px-2 py-1 text-xs sm:text-m rounded-md'>Rs.{hotel.price}</p>
                             <img src={hotel.mainImage ||hotel.image || hotel.image1} alt={hotel.name} className='w-full  object-cover rounded-lg shadow-md h-24 sm:h-42 ' />
                             <div className='flex items-center justify-between'>
                                     <h1 className='prata-regular text-sm sm:text-m mt-2 sm:mt-4 mb-2 sm:mb-4 '>{hotel.name}</h1>
                                    
             
                             </div>
                            
                             <p className='line-clamp-3 sm:line-clamp-4 text-gray-700 mb-2  text-xs sm:text-sm' >{hotel.description}</p>  
                              <div className='hidden sm:block sm:flex gap-1 text-amber-300'>
             <IoIosStar /><IoIosStar /><IoIosStar /><IoIosStar /><IoIosStarHalf />
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
