import React, { useEffect, useState } from "react";
import axios from "axios";
import{ BACKEND_URL } from "../App";
import { Link } from "react-router-dom";

const VisitingPlaces = () => {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios(`${BACKEND_URL}/api/travelplaces`).then((res) => {
      setPlaces(res.data.travelPlaces.slice(0, 8));
    });
  }, [places, setPlaces]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}/${path}`;
  };
  return (


    <div className="ml-8 mt-4">
          <h2 className="text-4xl font-bold text-green-200 ml-4">Travel Sri Lanka</h2>

    <div className=" grid grid-cols-4 sm:grid-cols-8 ">
      {places.map((place) => (
        <div key={place._id} className="p-4">
          <div className="rounded-lg shadow-md overflow-hidden text-white">
            <Link to='/places'>
            <img
              src={getImageUrl(place.mainImage)}
              alt={place.name}
              className=" fade-in w-full h-48 object-cover border-2 rounded-full hover:scale-105 transform transition-all duration-500 hover:fade-in hover:cursor-pointer "
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
