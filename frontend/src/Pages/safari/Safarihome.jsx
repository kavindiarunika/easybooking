import React, { useState } from "react";
import SafariCards from "./SafariCards";
import { safa } from "../../assets/safari";

const Safarihome = () => {
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleCategory = (category) => {
    setSelectedCategory((prev) => (prev === category ? "" : category));
  };

  return (
    <div className=" bg-white/10 flex flex-col gap-4 px-4">
      <p className="w-full h-32 sm:h-40"></p>

      {/* Main container */}
      <div className="w-full flex flex-col lg:flex-row gap-6">
        
        {/* ---------------- LEFT SIDE (Categories) ---------------- */}
        <div className="w-full lg:w-1/4">
          <p className="prata-regular text-xl sm:text-2xl text-green-200 mb-4">
            Choose Category
          </p>

          {/* Mobile: horizontal | Desktop: vertical */}
          <div
            className="
              flex lg:flex-col gap-3
              overflow-x-auto lg:overflow-visible
              border-b-2 lg:border-b-0 lg:border-r-2
              border-red-200/50
              pb-3 lg:pb-0
              pr-0 lg:pr-4
            "
          >
            {/* All */}
            <p
              onClick={() => setSelectedCategory("")}
              className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl transition
                ${
                  selectedCategory === ""
                    ? "bg-green-400/30 text-black font-bold"
                    : "text-white hover:text-green-200"
                }`}
            >
              All
            </p>

            {Object.keys(safa).map((category) => (
              <p
                key={category}
                onClick={() => handleCategory(category)}
                className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-xl transition
                  ${
                    selectedCategory === category
                      ? "bg-green-400/30 text-black font-bold"
                      : "text-white hover:text-green-200"
                  }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </p>
            ))}
          </div>
        </div>

        {/* ---------------- RIGHT SIDE (Cards) ---------------- */}
        <div className="">
          <SafariCards selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
};

export default Safarihome;
