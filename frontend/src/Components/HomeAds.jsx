import React from "react";

const HomeAds = ({ ads }) => {
  if (!ads || ads.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row  items-center justify-center gap-4 sm:gap-12">
      {ads.map((ad, index) => (
        <div key={index} className="rounded-2xl overflow-hidden shadow-lg">
          {ad.type === "video" ? (
            <video
              src={ad.url}
              controls
              crossOrigin="anonymous"
              className="w-auto h-[220px] sm:h-[400px] object-cover"
            />
          ) : (
            <img
              src={ad.url}
              alt="Advertisement"
              crossOrigin="anonymous"
              className="w-auto h-[220px] sm:h-[400px] object-cove"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default HomeAds;
