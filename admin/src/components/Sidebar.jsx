import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 border-gray-200">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
         <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-gray-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.add_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Home</p>
        </NavLink>
        {/* Add Trending */}
        <NavLink
          to="/addtrending"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-green-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.add_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Add Stays</p>
        </NavLink>

        {/* Delete Trending */}
        <NavLink
          to="/deletetrending"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-green-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.order_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Delete Stays</p>
        </NavLink>

        {/* Edit Trending */}
        <NavLink
          to="/edittrending"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-green-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.parcel_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Edit Stays</p>
        </NavLink>
        {/*--------------------add traveling places------------------ */}
        <NavLink
          to="/addtravellingplaces"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-blue-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.add_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Add Travelling Places</p>
        </NavLink>
        {/*--------------------delete traveling places------------------ */}
        <NavLink
          to="/deletetravellingplaces"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-blue-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.delete_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Delete Travelling Places</p>
        </NavLink>
        {/*--------------------add safari------------------ */}
        <NavLink
          to="/addsafari"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-purple-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.add_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Add Safari</p>
        </NavLink>
        <NavLink
          to="/deletesafari"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-purple-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.order_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Delete Safari</p>
        </NavLink>
        <NavLink
          to="/editsafari"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-purple-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.parcel_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">edit Safari</p>
        </NavLink>
        {/*--------------------Vendor Management------------------ */}
        <NavLink
          to="/vendors"
          className={({ isActive }) =>
            `flex items-center gap-3 border bg-orange-300 border-gray-300 border-r-0 px-3 py-2 rounded-l transition ${
              isActive ? "bg-blue-100 text-blue-600 font-medium" : ""
            }`
          }
        >
          <img src={assets.order_icon} alt="" className="w-5 h-5" />
          <p className="hidden md:block">Vendor Management</p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
