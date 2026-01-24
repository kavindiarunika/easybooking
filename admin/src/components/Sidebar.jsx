import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { 
  FiHome, FiPlus, FiTrash2, FiEdit, FiMapPin, FiUsers, 
  FiChevronDown, FiChevronRight, FiImage, FiCompass
} from "react-icons/fi";
import { MdOutlineVilla, MdOutlineTravelExplore } from "react-icons/md";
import { GiElephant } from "react-icons/gi";

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    ads: false,
    stays: true,
    places: false,
    safari: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
  };

  const linkClass = (isActive) => 
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm ${
      isActive 
        ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md" 
        : "text-gray-300 hover:bg-slate-700 hover:text-white"
    }`;

  const menuHeaderClass = "flex items-center justify-between w-full px-4 py-2.5 text-gray-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all cursor-pointer";

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 shadow-xl">
      <div className="flex flex-col gap-2 p-4">
        
        {/* Home */}
        <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
          <FiHome size={18} />
          <span>Dashboard</span>
        </NavLink>

        {/* Advertisements Section */}
        <div className="mt-2">
          <div onClick={() => toggleMenu('ads')} className={menuHeaderClass}>
            <div className="flex items-center gap-3">
              <FiImage size={18} className="text-yellow-400" />
              <span className="font-medium">Advertisements</span>
            </div>
            {openMenus.ads ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </div>
          {openMenus.ads && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-yellow-500/30 pl-4">
              <NavLink to="/ads" className={({ isActive }) => linkClass(isActive)}>
                <FiImage size={16} />
                <span>View Ads</span>
              </NavLink>
              <NavLink to="/addads" className={({ isActive }) => linkClass(isActive)}>
                <FiPlus size={16} />
                <span>Add Ad</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Stays Section */}
        <div className="mt-2">
          <div onClick={() => toggleMenu('stays')} className={menuHeaderClass}>
            <div className="flex items-center gap-3">
              <MdOutlineVilla size={18} className="text-green-400" />
              <span className="font-medium">Stays</span>
            </div>
            {openMenus.stays ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </div>
          {openMenus.stays && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-green-500/30 pl-4">
              <NavLink to="/addstays" className={({ isActive }) => linkClass(isActive)}>
                <FiPlus size={16} />
                <span>Add New Stay</span>
              </NavLink>
              <NavLink to="/deletetrending" className={({ isActive }) => linkClass(isActive)}>
                <FiTrash2 size={16} />
                <span>Delete Stay</span>
              </NavLink>
              <NavLink to="/edittrending" className={({ isActive }) => linkClass(isActive)}>
                <FiEdit size={16} />
                <span>Edit Stay</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Travelling Places Section */}
        <div className="mt-2">
          <div onClick={() => toggleMenu('places')} className={menuHeaderClass}>
            <div className="flex items-center gap-3">
              <MdOutlineTravelExplore size={18} className="text-blue-400" />
              <span className="font-medium">Travel Places</span>
            </div>
            {openMenus.places ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </div>
          {openMenus.places && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-500/30 pl-4">
              <NavLink to="/addtravellingplaces" className={({ isActive }) => linkClass(isActive)}>
                <FiPlus size={16} />
                <span>Add Place</span>
              </NavLink>
              <NavLink to="/deletetravellingplaces" className={({ isActive }) => linkClass(isActive)}>
                <FiTrash2 size={16} />
                <span>Delete Place</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Safari Section */}
        <div className="mt-2">
          <div onClick={() => toggleMenu('safari')} className={menuHeaderClass}>
            <div className="flex items-center gap-3">
              <GiElephant size={18} className="text-purple-400" />
              <span className="font-medium">Safari</span>
            </div>
            {openMenus.safari ? <FiChevronDown size={16} /> : <FiChevronRight size={16} />}
          </div>
          {openMenus.safari && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-purple-500/30 pl-4">
              <NavLink to="/addsafari" className={({ isActive }) => linkClass(isActive)}>
                <FiPlus size={16} />
                <span>Add Safari</span>
              </NavLink>
              <NavLink to="/deletesafari" className={({ isActive }) => linkClass(isActive)}>
                <FiTrash2 size={16} />
                <span>Delete Safari</span>
              </NavLink>
              <NavLink to="/editsafari" className={({ isActive }) => linkClass(isActive)}>
                <FiEdit size={16} />
                <span>Edit Safari</span>
              </NavLink>
            </div>
          )}
        </div>

        {/* Divider */}
        <hr className="my-4 border-slate-700" />

        {/* Vendor Management */}
        <NavLink to="/vendors/manage" className={({ isActive }) => linkClass(isActive)}>
          <FiUsers size={18} className="text-orange-400" />
          <span>View All Vendors</span>
        </NavLink>

        <NavLink to="/addvendor" className={({ isActive }) => linkClass(isActive)}>
          <FiPlus size={18} className="text-orange-400" />
          <span>Add Vendor</span>
        </NavLink>

      </div>
    </div>
  );
};

export default Sidebar;
