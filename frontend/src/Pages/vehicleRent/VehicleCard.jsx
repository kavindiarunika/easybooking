import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchVehicles,
  selectAllVehicles,
  selectVehiclesStatus,
  selectVehiclesError,
} from "../../store/vehicleSlice";
import { FiFilter } from "react-icons/fi";
import { VehicleHero } from "./VehicleHero";

const VehicleCard = () => {
  const dispatch = useDispatch();
  const vehicles = useSelector(selectAllVehicles);
  const status = useSelector(selectVehiclesStatus);
  const error = useSelector(selectVehiclesError);

  const [filterType, setFilterType] = useState("");
  const [filterDistrict, setFilterDistrict] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchVehicles());
    }
  }, [status, dispatch]);

  // Get unique types
  const types = Array.from(new Set(vehicles.map((v) => v.type))).filter(Boolean);

  // FIXED: district spelling
  const districts = Array.from(
    new Set(vehicles.map((v) => v.district))
  ).filter(Boolean);

  // Filter vehicles
  const filtered = vehicles.filter((v) => {
    if (filterType && v.type !== filterType) return false;
    if (filterDistrict && v.district !== filterDistrict) return false;
    return true;
  });

  if (status === "loading")
    return <div className="text-white p-4">Loading vehicles...</div>;

  if (status === "failed")
    return <div className="text-red-400 p-4">{error}</div>;

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white px-4 md:px-10 lg:px-16 py-6">
     
             <VehicleHero/>
            
          <div className="h-12"></div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-3xl font-bold">
          Available Vehicles
        </h2>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg"
        >
          <FiFilter />
          Filters
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters */}
        <div
          className={`lg:w-1/4 ${
            showFilters ? "block" : "hidden"
          } lg:block`}
        >
          <div className="bg-gray-900 rounded-xl p-5 shadow space-y-5">
            <h3 className="text-lg font-semibold">Filters</h3>

            {/* Type Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Type
              </label>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="vehicleType"
                    checked={filterType === ""}
                    onChange={() => setFilterType("")}
                    className="mr-2"
                  />
                  All
                </label>

                {types.map((t) => (
                  <label key={t} className="flex items-center">
                    <input
                      type="radio"
                      name="vehicleType"
                      checked={filterType === t}
                      onChange={() => setFilterType(t)}
                      className="mr-2"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                District
              </label>

              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 focus:outline-none"
              >
                <option value="">All</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {(filterType || filterDistrict) && (
              <button
                onClick={() => {
                  setFilterType("");
                  setFilterDistrict("");
                }}
                className="text-sm text-green-400 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Vehicle Grid */}
        <div className="lg:w-3/4">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filtered.map((v) => (
                <Link
                  key={v._id}
                  to={`/vehicle/${v._id}`}
                  className="bg-white text-black rounded-xl overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={v.mainImage || "/placeholder-car.jpg"}
                    alt={v.name}
                    className="w-full h-48 object-cover"
                  />

                  <div className="p-4">
                    <h3 className="font-semibold text-lg truncate">
                      {v.name}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 mt-1">
                      {v.description || "No description"}
                    </p>

                    <p className="mt-3 font-semibold text-green-600">
                      LKR {v.price ?? v.Price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-gray-400 mt-6">
              No vehicles match your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;