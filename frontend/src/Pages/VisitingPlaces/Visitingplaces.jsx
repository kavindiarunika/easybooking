
import React, { useEffect, useState } from "react";
import VisitingHero from "./VisitingHero";
import axios from "axios";
import Filterplaces from "./Filterplaces";

const Visitingplaces = () => {
  const [places, setPlaces] = useState([]);
  const [filterplaces, setFilterplaces] = useState([]);
  const [selectDistrict, setSelectDistrict] = useState(""); // "" = All

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const districts = [
    { value: "colombo", label: "Colombo" },
    { value: "galle", label: "Galle" },
    { value: "kandy", label: "Kandy" },
    { value: "nuwaraeliya", label: "Nuwara Eliya" },
    { value: "jaffna", label: "Jaffna" },
    { value: "matale", label: "Matale" },
    { value: "trincomalee", label: "Trincomalee" },
    { value: "anuradhapura", label: "Anuradhapura" },
    { value: "polonnaruwa", label: "Polonnaruwa" },
    { value: "hambantota", label: "Hambantota" },
    { value: "badulla", label: "Badulla" },
    { value: "monaragala", label: "Monaragala" },
    { value: "gampaha", label: "Gampaha" },
    { value: "kalutara", label: "Kalutara" },
    { value: "ratnapura", label: "Ratnapura" },
    { value: "kegalle", label: "Kegalle" },
    { value: "puttalam", label: "Puttalam" },
    { value: "kurunegala", label: "Kurunegala" },
    { value: "dambulla", label: "Dambulla" },
  ];

  // Fetch places
  useEffect(() => {
    axios
      .get(`${backendUrl}/api/travelplaces`)
      .then((res) => {
        setPlaces(res.data.travelPlaces);
        setFilterplaces(res.data.travelPlaces); // show all initially
      })
      .catch((err) => {
        console.log("Error loading places", err);
      });
  }, []);

  // Filter places when radio changes
  useEffect(() => {
    if (selectDistrict === "") {
      setFilterplaces(places);
    } else {
      setFilterplaces(
        places.filter((place) => place.district === selectDistrict)
      );
    }
  }, [selectDistrict, places]);

  const getImageUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${backendUrl}/${path}`;
  };

  return (
    <div className="">
      <VisitingHero 
       district={districts}
            selectDistrict={selectDistrict}
            onChange={setSelectDistrict}/>

      <section className="w-full mx-auto py-10 flex gap-6 px-6">
       
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4  mx-auto">
            {filterplaces.map((place) => (
              <div
                key={place._id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={getImageUrl(place.mainImage)}
                  alt={place.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4">
                  <h3 className="text-lg font-semibold">{place.name}</h3>
                  <p className="text-sm text-gray-500 capitalize">
                    {place.district}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {place.description}
                  </p>
                </div>

              </div>
            ))}
          </div>
    
      </section>
    </div>
  );
};

export default Visitingplaces;
