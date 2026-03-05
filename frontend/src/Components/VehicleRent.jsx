import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import api from "../api";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const VehicleRent = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    api
      .get("/api/vehicle/all")
      .then((res) => {
        if (!cancelled) {
          setList(Array.isArray(res.data) ? res.data : []);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Failed to load vehicles");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading)
    return <p className="text-center text-gray-400 mt-6">Loading vehicles...</p>;

  if (error)
    return <p className="text-center text-red-400 mt-6">{error}</p>;

  if (list.length === 0)
    return (
      <p className="text-center text-gray-400 mt-6">
        No vehicles to display.
      </p>
    );

  const settings = {
    dots: false,
    infinite: list.length > 3,
    speed: 400,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="mt-8">
      <Slider {...settings}>
        {list.map((v) => (
          <div key={v._id} className="px-3">
            <Link
              to={`/vehicle/${v._id}`}
              className="
                block rounded-lg overflow-hidden
                bg-white border border-gray-200
                hover:border-gray-300 transition
              "
            >
              {/* Image */}
              <img
                src={v.mainImage || "/placeholder-car.jpg"}
                alt={v.name}
                className="w-full h-44 object-cover"
              />

              {/* Content */}
              <div className="p-3">
                <h3 className="text-base font-medium text-gray-800 truncate">
                  {v.name}
                </h3>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {v.description || "No description"}
                </p>

                <p className="mt-2 text-sm font-semibold text-gray-900">
                  LKR {v.price ?? v.Price}
                </p>
              </div>
            </Link>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default VehicleRent;