import React, { useEffect, useState } from "react";
import axios from "axios";
import{ BACKEND_URL } from "../App";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";

const VisitingPlaces = () => {

  const [places, setPlaces] = useState([]);
  

  useEffect(() => {
    axios(`${BACKEND_URL}/api/travelplaces`).then((res) => {
      setPlaces(res.data.travelPlaces.slice(0, 6));
    });
  }, [places, setPlaces]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}/${path}`;
  };
  return (


    <div className="ml-2 sm:ml-8 mt-4 mr-4 sm:mr-16">
      <div className="flex flex-row justify-between items-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-green-200 ml-2 sm:ml-4">Travel Sri Lanka</h2>
            <button
                    onClick={() => navigate("/places")}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition transform hover:scale-105"
                  >
                    More <AiOutlineArrowRight />
                  </button>
        </div>
        

    <div className=" grid grid-cols-3 sm:grid-cols-6 ">
      {places.map((place) => (
        <div key={place._id} className="p-4">
          <div className="rounded-lg shadow-md overflow-hidden text-white">
            <Link to='/places'>
            <img
              src={getImageUrl(place.mainImage)}
              alt={place.name}
              className=" fade-in w-full h-24 sm:h-52 object-cover border-2 rounded-full hover:scale-105 transform transition-all duration-500 hover:fade-in hover:cursor-pointer "
            />
            
            </Link>
            
            <div className="p-4">
              <h3 className="text-lg font-semibold text-center">{place.name}</h3>
            
            </div>{" "}
          </div>
        </div>
      ))}
    </div>
    </div>
  );
};

export default VisitingPlaces;

