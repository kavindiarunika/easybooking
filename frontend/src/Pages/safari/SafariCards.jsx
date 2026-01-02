import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../App.jsx";
import { Link } from "react-router-dom";

const SafariCards = () => {
  const [addsafari, setaddsafari] = useState([]);
  const [sortprice ,setsortprice] =useState("default")
  const [sortmember ,setsortmember] =useState("default")


  const sortedSafaries = [...addsafari].sort((a,b) =>{

    if(sortprice ==="lowtohigh"){
      return a.price -b.price

    }

    if(sortprice ==="hightolow"){
      return b.price - a.price
    }

    if(sortmember ==="lowtohigh"){
      return a.TeamMembers -b.TeamMembers
    }

    if(sortmember === "hightolow"){
      return b.TeamMembers -a.TeamMembers
    }

    return 0;
  })

  useEffect(() => {
    const getsafaries = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_URL}/api/safari/allsafari`
        );
        setaddsafari(response.data.safaris || []);
      } catch (error) {
        console.log("error while fetching", error);
      }
    };

    getsafaries();
  }, []);

  return (

    <div>
      <div className="flex flex-row gap-4">
        <select className="m-4 px-4 py-2 rounded-lg border border-gray-300 bg-green-200"
                value={sortprice}
                onChange={(e)=>setsortprice(e.target.value)}>
                  <option value="default">Sort by price</option>
                  <option value="lowtohigh">Low To High</option>
                  <option value="hightolow">High To Low</option>
                </select>
        <select className="m-4 px-4 py-2 rounded-lg border border-gray-300 bg-green-200"
                value={sortmember}
                onChange={(e)=>setsortmember(e.target.value)}>
                  <option value="default">Sort by members</option>
                  <option value="lowtohigh">Low To High</option>
                  <option value="hightolow">High To Low</option>
                </select>
      </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {sortedSafaries.map((safari) => (
        <Link
          to={`/safaridetails/${safari._id}`}
          key={safari._id}
          className="group"
        >
          <div className="bg-white rounded-2xl overflow-hidden shadow-md 
                          hover:shadow-2xl transition-all duration-300
                          hover:-translate-y-1">

            {/* IMAGE */}
            <div className="relative">
              {safari.mainImage ? (
                <img
                  src={safari.mainImage}
                  alt={safari.name}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                  No image
                </div>
              )}

              {/* PRICE BADGE */}
              <div className="absolute top-3 right-3 bg-green-600 text-white 
                              px-3 py-1 rounded-full text-sm font-semibold shadow">
                LKR {safari.price}
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {safari.name}
              </h3>

              <p className="text-sm text-gray-600 mb-4">
                {safari.description?.length > 100
                  ? safari.description.slice(0, 100) + "..."
                  : safari.description}
              </p>

              {/* INFO ROW */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>👥 {safari.TeamMembers} Members</span>
                <span>🗓 {safari.totalDays} Days</span>
              </div>
            </div>

          </div>
        </Link>
      ))}
    </div>
    </div>
  );
};

export default SafariCards;
