import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoReorderThreeOutline, IoClose } from "react-icons/io5";
import { AiOutlineHome } from "react-icons/ai";
import { MdHotel } from "react-icons/md";
import { RiSafariFill } from "react-icons/ri";
import {
  FaBoxOpen,
  FaMapMarkerAlt,
  FaCar,
  FaEnvelope,
  FaServicestack,
} from "react-icons/fa";
import { assets } from "../assets/Assest";
import { TravelContext } from "../Context/TravelContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false); // mobile dropdown toggle
  const { handleSpecial, navigate } = useContext(TravelContext);

  const toggleMenu = () => setIsOpen(!isOpen);
  const vehicleToken = localStorage.getItem("vehicleToken");

  return (
    <div className="w-full z-50 absolute top-0 left-0 prata-regular bg-slate-500/10 backdrop-blur-md">
      {/*------------------- PC View -------------------*/}
      <div className="max-w-7xl mx-auto px-4  flex justify-between items-center">
        {/* Logo */}
        <Link to="./">
          <img src={assets.logo} alt="logo" className="w-34" />
        </Link>

        {/* Navbar Links */}
        <div className="hidden md:flex items-end gap-16">
          <ul className="hidden sm:flex gap-12 text-m">
            {/* home link */}
            <li className="relative group cursor-pointer pb-1">
              <NavLink to="./" className="flex items-center gap-2 text-white">
                <AiOutlineHome className="text-white w-5 h-5" />
                <div className="relative">
                  <p className="capitalize">Home</p>
                </div>
              </NavLink>
            </li>

            {/* services dropdown */}
            <li className="relative group cursor-pointer pb-1">
              <div className="flex items-center gap-2 text-white">
                <FaServicestack className="text-white w-5 h-5" />
                <div className="relative">
                  <p className="capitalize">Our Services</p>
                </div>
              </div>
              <ul className="absolute  text-white left-0 top-full mt-1 bg-slate-800 rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity z-50 w-40">
                <li>
                  <NavLink
                    to="/villa"
                    className="block px-4 py-2 hover:bg-slate-700"
                  >
                    stays
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/safarihome"
                    className="block px-4 py-2 hover:bg-slate-700"
                  >
                    GoTrip
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/vehicle"
                    className="block px-4 py-2 hover:bg-slate-700"
                  >
                    vehicles
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/product"
                    className="block px-4 py-2 hover:bg-slate-700"
                  >
                    product
                  </NavLink>
                </li>
              </ul>
            </li>

            {/* other links */}
            <li className="relative group cursor-pointer pb-1">
              <NavLink
                to="/places"
                className="flex items-center gap-2 text-white"
              >
                <FaMapMarkerAlt className="text-white w-5 h-5" />
                <div className="relative">
                  <p className="capitalize">traveling places</p>
                </div>
              </NavLink>
            </li>
            <li className="relative group cursor-pointer pb-1">
              <NavLink
                to="/about"
                className="flex items-center gap-2 text-white"
              >
                <AiOutlineHome className="text-white w-5 h-5" />
                <div className="relative">
                  <p className="capitalize">About</p>
                </div>
              </NavLink>
            </li>
            <li className="relative group cursor-pointer pb-1">
              <NavLink
                to="/contact"
                className="flex items-center gap-2 text-white"
              >
                <FaEnvelope className="text-white w-5 h-5" />
                <div className="relative">
                  <p className="capitalize">Contact</p>
                </div>
              </NavLink>
            </li>
          </ul>
        </div>

        {/*------------------- Hamburger Icon -------------------*/}
        <div className="md:hidden">
          <IoReorderThreeOutline
            size={32}
            className="text-white cursor-pointer absolute top-4 right-4"
            onClick={toggleMenu}
          />
        </div>

        {/*------------------- Mobile Menu Overlay -------------------*/}
        <div
          className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-40 md:hidden ${
            isOpen
              ? "opacity-100 visible pointer-events-auto"
              : "opacity-0 invisible pointer-events-none"
          }`}
          onClick={toggleMenu}
        ></div>
        {/*------------------- Mobile Menu Side Panel -------------------*/}
        <div
          className={`fixed top-0 right-0 h-full w-3/4 max-w-xs bg-green-300 text-white transition-transform duration-300 ease-in-out z-50 pointer-events-auto ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex justify-between items-center p-4 border-b border-cyan-700 bg-green-800/90 ">
              <p className="font-extrabold text-xl">Explorer Menu</p>
              <IoClose
                size={30}
                className="cursor-pointer text-white hover:text-red-500 transition"
                onClick={toggleMenu}
              />
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-6 p-6 text-lg font-medium bg-green-900/90 flex-grow rounded-l-xl">
              <NavLink
                to="./"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 flex items-center gap-3"
                    : "hover:text-cyan-300 flex items-center gap-3"
                }
              >
                <AiOutlineHome className="text-white w-5 h-5" /> Home
              </NavLink>

              <NavLink
                to="/villa"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 flex items-center gap-3"
                    : "hover:text-cyan-300 flex items-center gap-3"
                }
              >
                <MdHotel className="text-white w-5 h-5" /> Hotels
              </NavLink>
              <NavLink
                to="/vehicle"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 flex items-center gap-3"
                    : "hover:text-cyan-300 flex items-center gap-3"
                }
              >
                <FaCar className="text-white w-5 h-5" /> Vehicles
              </NavLink>
              <NavLink
                to="/safarihome"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 flex items-center gap-3"
                    : "hover:text-cyan-300 flex items-center gap-3"
                }
              >
                <RiSafariFill className="text-white w-5 h-5" /> GoTrip
              </NavLink>
              {/* services collapse trigger */}
              <div
                className="flex items-center gap-3 cursor-pointer hover:text-cyan-300"
                onClick={() => setServicesOpen(!servicesOpen)}
              >
                <FaServicestack className="text-white w-5 h-5" /> Our Services
                <span className="ml-auto">{servicesOpen ? "▲" : "▼"}</span>
              </div>
              {servicesOpen && (
                <div className="flex flex-col pl-6 gap-3 text-white">
                  <NavLink
                    to="/villa"
                    onClick={toggleMenu}
                    className="hover:text-cyan-300"
                  >
                    stays
                  </NavLink>
                  <NavLink
                    to="/safarihome"
                    onClick={toggleMenu}
                    className="hover:text-cyan-300"
                  >
                    GoTrip
                  </NavLink>
                  <NavLink
                    to="/vehicle"
                    onClick={toggleMenu}
                    className="hover:text-cyan-300"
                  >
                    vehicles
                  </NavLink>
                  <NavLink
                    to="/product"
                    onClick={toggleMenu}
                    className="hover:text-cyan-300"
                  >
                    product
                  </NavLink>
                </div>
              )}
              <NavLink
                to="/places"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 flex items-center gap-3"
                    : "hover:text-cyan-300 flex items-center gap-3"
                }
              >
                <FaMapMarkerAlt className="text-white w-5 h-5" /> Travel Places
              </NavLink>
              <NavLink
                to="/about"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 flex items-center gap-3"
                    : "hover:text-cyan-300 flex items-center gap-3"
                }
              >
                <AiOutlineHome className="text-white w-5 h-5" /> About
              </NavLink>
              <NavLink
                to="/contact"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive
                    ? "text-cyan-300 flex items-center gap-3"
                    : "hover:text-cyan-300 flex items-center gap-3"
                }
              >
                <FaEnvelope className="text-white w-5 h-5" /> Contact
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
