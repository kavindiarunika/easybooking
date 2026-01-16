import React from "react";
import heroImg from "../../assets/VisitingPlaces/hero.png";
import Filterplaces from "./Filterplaces";

const VisitingHero = ( { district, selectDistrict, onChange }) => {
  return (
    <div
      className="relative w-full sm:h-[600px] bg-cover bg-center flex px-4 mb-4 sm:px-20 items-center justify-between"
      style={{ backgroundImage: `url(${heroImg})` }}
    >
      {/* Left side */}
      <div className="flex flex-col gap-4">
      <div className="w-full flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-black mt-32 sm:mt-32">
          Travel And Discover Your Vacation
        </h1>
        <p className="hidden md:block text-white ml-8">
          Explore the beauty of Sri Lanka with our curated travel experiences.
        </p>

        <div className="flex mt-4 mb-4 ml-4 sm:ml-10">
          <input
            type="text"
            placeholder="Search your dream place..."
            className="p-4 w-52 sm:w-64  bg-white/70  rounded-l-md"
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
            className= "hidden md:block mb-4"
          />
      </div>

     
    </div>
  );
};

export default VisitingHero;
