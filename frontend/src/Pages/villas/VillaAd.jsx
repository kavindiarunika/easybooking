import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BACKEND_URL } from "../../App";

const VillaAd = () => {
  const [ads, setads] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/ads/getads`);
        setads(response.data || {});
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {Array.isArray(ads.villaad) &&
          ads.villaad.map((ad, index) => (
            <div key={index} className="rounded-2xl overflow-hidden shadow-lg">
              {ad.type === "video" ? (
                <video
                  src={ad.url}
                  controls
                  crossOrigin="anonymous"
                  className="w-full h-[220px] sm:h-[400px] object-cover"
                />
              ) : (
                <img
                  src={ad.url}
                  alt="Advertisement"
                  crossOrigin="anonymous"
                  className="w-full h-[220px] sm:h-[400px] object-cover"
                />
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default VillaAd;
