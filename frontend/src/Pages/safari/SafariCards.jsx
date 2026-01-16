import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../App.jsx";
import { Link } from "react-router-dom";

const SafariCards = ({ selectedCategory = "" }) => {
  const [addsafari, setaddsafari] = useState([]);
  const [sortprice, setsortprice] = useState("default");
  const [sortmember, setsortmember] = useState("default");

  useEffect(() => {
    const getsafaries = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/safari/allsafari`);
        setaddsafari(response.data.safaris || []);
      } catch (error) {
        console.log("Error while fetching safaris:", error);
      }
    };

    getsafaries();
  }, []);

  // First: Filter by selected category
  let filteredSafaris = addsafari;

  if (selectedCategory) {
    filteredSafaris = addsafari.filter(
      (safari) => safari.category === selectedCategory
    );
  }

  // Then: Sort the filtered list
  const sortedSafaris = [...filteredSafaris].sort((a, b) => {
    // Price sorting (higher priority if selected)
    if (sortprice === "lowtohigh") {
      return a.price - b.price;
    }
    if (sortprice === "hightolow") {
      return b.price - a.price;
    }

    // Member sorting
    if (sortmember === "lowtohigh") {
      return a.TeamMembers - b.TeamMembers;
    }
    if (sortmember === "hightolow") {
      return b.TeamMembers - a.TeamMembers;
    }

    return 0; // No sorting
  });

  return (
    <div>
      {/* Sorting Controls */}
      <div className="flex flex-row gap-4 mb-6">
        <select
        className="  px-2 sm:px-4 py-2
    rounded-lg border border-gray-300
    bg-green-200 text-gray-800
    text-sm sm:text-base
    font-medium
    appearance-none
    focus:outline-none focus:ring-2 focus:ring-green-400"
          value={sortprice}
          onChange={(e) => {
            setsortprice(e.target.value);
            setsortmember("default"); // Reset member sort when price is changed
          }}
        >
          <option value="default" className="text-sm ">Sort by Price</option>
          <option value="lowtohigh" className="text-sm ">Low to High</option>
          <option value="hightolow" className="text-sm">High to Low</option>
        </select>

        <select
          className="  px-2 sm:px-4 py-2
    rounded-lg border border-gray-300
    bg-green-200 text-gray-800
    text-sm sm:text-base
    font-medium
    appearance-none
    focus:outline-none focus:ring-2 focus:ring-green-400"
          value={sortmember}
          onChange={(e) => {
            setsortmember(e.target.value);
            setsortprice("default"); // Reset price sort when member is changed
          }}
        >
          <option value="default">Sort by Members</option>
          <option value="lowtohigh">Low to High</option>
          <option value="hightolow">High to Low</option>
        </select>
      </div>

      {/* Safari Cards Grid */}
      <div className="ml-4 mr-4 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {sortedSafaris.length > 0 ? (
          sortedSafaris.map((safari) => (
            <Link
              to={`/safaridetails/${safari._id}`}
              key={safari._id}
              className="group"
            >
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-md 
                hover:shadow-2xl transition-all duration-300
                hover:-translate-y-1"
              >
                {/* IMAGE */}
                <div className="relative">
                  {safari.mainImage ? (
                    <img
                      src={safari.mainImage}
                      alt={safari.name}
                      className="w-full h-32 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500">
                      No image
                    </div>
                  )}

                  {/* PRICE BADGE */}
                  <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
                    LKR {safari.price}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {safari.name}
                  </h3>

                  <p className="hidden sm:block text-sm text-gray-600 mb-4">
                    {safari.description?.length > 100
                      ? safari.description.slice(0, 100) + "..."
                      : safari.description || "No description"}
                  </p>

                  {/* INFO ROW */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>People {safari.TeamMembers} Members</span>
                    <span>Calendar {safari.totalDays} Days</span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-xl text-gray-600">
              {selectedCategory
                ? `No safaris found in "${selectedCategory}" category.`
                : "No safari packages available."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafariCards;