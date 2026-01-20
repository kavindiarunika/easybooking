import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App.jsx";
import { toast } from "react-toastify";
import { MdDelete } from "react-icons/md";

const ShowAds = () => {
  const [addAds, setaddAds] = useState(null);

  // Fetch ads from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/ads/getads`);
        setaddAds(response.data);
      } catch (error) {
        toast.error("Failed to load ads");
      }
    };
    fetchData();
  }, []);

  // Delete ad handler
  const handleDelete = async (adId, type, index) => {
    try {
      await axios.delete(
        `${backendUrl}/api/ads/deleteads/${adId}?type=${type}`,
      );
      toast.success("Ad deleted successfully");

      // Remove deleted ad from state
      setaddAds((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    } catch (error) {
      toast.error("Failed to delete ad");
    }
  };

  // Reusable component to render a single ad section
  const AdSection = ({ title, type }) => (
    <div>
      <p className="text-black text-xl mb-3">{title}</p>
      <div className="grid grid-cols-3 gap-4">
        {addAds?.[type]?.length > 0 ? (
          addAds[type].map((item, index) => (
            <div
              key={index}
              className="relative rounded-xl overflow-hidden shadow-lg bg-white/50"
            >
              {/* Delete icon */}
              <MdDelete
                onClick={() => handleDelete(item._id, type, index)}
                className="absolute top-2 right-2 z-10 text-red-600 text-2xl hover:text-black shadow-md  cursor-pointer transition-all duration-200"
              />

              {/* Media */}
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  crossOrigin="anonymous"
                  className="w-full h-[220px] object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`${title} Ad`}
                  crossOrigin="anonymous"
                  className="w-full h-[220px] object-cover"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-700 col-span-3">
            No {title} Available
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-green-300/50 p-5 space-y-6 rounded-xl">
      <AdSection title="Home Ads" type="homeAd" />
      <AdSection title="Villa Ads" type="villaad" />
      <AdSection title="GoTrip Ads" type="goTripAd" />
    </div>
  );
};

export default ShowAds;
