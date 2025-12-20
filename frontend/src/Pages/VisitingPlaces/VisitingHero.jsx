import React from "react";
import heroImg from "../../assets/VisitingPlaces/hero.png";

const VisitingHero = () => {
  return (
    <div
      className="relative w-full h-[600px] bg-cover bg-center flex px-20 items-center justify-between"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Left side */}
      <div className="w-1/2 flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-white">
          Travel And Discover Your Vacation
        </h1>
        <p className="text-white">
          Explore the beauty of Sri Lanka with our curated travel experiences.
        </p>

        <div className="flex">
          <input
            type="text"
            placeholder="Search your dream place..."
            className="p-4 w-64 text-black bg-white/70 border-2 border-green-950 rounded-l-md"
          />
          <button className="bg-blue-600 text-white px-6 rounded-r-md">
            Search
          </button>
        </div>
      </div>

      {/* Right side (optional content) */}
      <div></div>
    </div>
  );
};

export default VisitingHero;
