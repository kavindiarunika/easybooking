import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 border-gray-200">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        {/* Add Trending */}
        <NavLink
          to="/addtrending"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.add_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Add Items</p>
        </NavLink>

        {/* Delete Trending */}
        <NavLink
          to="/deletetrending"
          className={({ isActive }) =>
            `flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.order_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Delete Items</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
