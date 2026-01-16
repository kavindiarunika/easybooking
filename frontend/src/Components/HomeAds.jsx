import React from "react";

const HomeAds = ({ ads }) => {
  if (!ads || ads.length === 0) return null;

  return (
    <div className="my-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
      {ads.map((ad, index) => (
        <div
          key={index}
          className="rounded-2xl overflow-hidden shadow-lg"
        >
          {ad.type === "video" ? (
            <video
              src={ad.url}
              controls
              className="w-full h-[220px] object-cover"
            />
          ) : (
            <img
              src={ad.url}
              alt="Advertisement"
              className="w-full h-[220px] object-cover"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default HomeAds;
