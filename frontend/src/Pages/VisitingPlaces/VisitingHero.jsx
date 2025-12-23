import React from "react";
import heroImg from "../../assets/VisitingPlaces/hero.png";
import Filterplaces from "./Filterplaces";

const VisitingHero = ( { district, selectDistrict, onChange }) => {
  return (
    <div
      className="relative w-full h-[600px] bg-cover bg-center flex px-20 items-center justify-between"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Left side */}
      <div className="flex flex-col gap-4">
      <div className="w-1/2 flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-white mt-20">
          Travel And Discover Your Vacation
        </h1>
        <p className="text-white ml-8">
          Explore the beauty of Sri Lanka with our curated travel experiences.
        </p>

        <div className="flex mt-4 mb-4 ml-10">
          <input
            type="text"
            placeholder="Search your dream place..."
            className="p-4 w-64  bg-white/70  rounded-l-md"
          />
          <button className="bg-blue-600 text-white px-6 rounded-r-md">
            Search
          </button>
         
        </div>
        
          </div>
           <Filterplaces 
           district={district}
            selectDistrict={selectDistrict}
            onChange={onChange}
          />
      </div>

      {/* Right side (optional content) */}
      <div></div>
    </div>
  );
};

export default VisitingHero;
