import React, { useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import { IoReorderThreeOutline, IoClose } from "react-icons/io5";
import { assets } from "../assets/Assest";
import { TravelContext } from "../Context/TravelContext";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { handleSpecial, navigate } = useContext(TravelContext);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="w-full z-50 absolute top-0 left-0 prata-regular bg-slate-500/10 backdrop-blur-md">
      {/*------------------- PC View -------------------*/}
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="./">
          <img src={assets.logo} alt="logo" className="w-32" />
        </Link>

        {/* Navbar Links */}
        <div className="hidden md:flex items-end gap-16">
          <ul className="hidden sm:flex gap-16 text-xl text-white">
            {[
              { name: "Home", path: "./" },
              { name: "About Sri Lanka", path: "/", onClick: handleSpecial },
              { name: "Booking", path: "/villa" },
            ].map((item, index) => (
              <li key={index} className="relative group cursor-pointer pb-1">
                <NavLink
                  to={item.path}
                  onClick={item.onClick}
                  className="flex flex-col items-center gap-1 text-green-400"
                >
                  <p>{item.name}</p>
                  {/* White underline only on hover */}
                  <span className="absolute left-0 -bottom-0.5 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/*------------------- Hamburger Icon -------------------*/}
        <div className="md:hidden">
          <IoReorderThreeOutline
            size={32}
            className="text-white cursor-pointer"
            onClick={toggleMenu}
          />
        </div>
      </div>

      {/*------------------- Mobile Menu Overlay -------------------*/}
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 z-50 md:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={toggleMenu}
      >
        {/*------------------- Mobile Menu Side Panel -------------------*/}
        <div
          className={`absolute top-0 right-0 h-full w-3/4 max-w-xs bg-cyan-900 text-white transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col h-full">
            {/* Header Section */}
            <div className="flex justify-between items-center p-4 border-b border-cyan-700 bg-cyan-800">
              <p className="font-extrabold text-xl">Explorer Menu</p>
              <IoClose
                size={30}
                className="cursor-pointer text-white hover:text-red-500 transition"
                onClick={toggleMenu}
              />
            </div>

            {/* Menu Links */}
            <div className="flex flex-col gap-6 p-6 text-lg font-medium bg-cyan-900 flex-grow">
              <NavLink
                to="./"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive ? "text-cyan-300" : "hover:text-cyan-300"
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/villa"
                onClick={toggleMenu}
                className={({ isActive }) =>
                  isActive ? "text-cyan-300" : "hover:text-cyan-300"
                }
              >
                Hotels
              </NavLink>

              <NavLink
                to="./"
                onClick={() => {
                  toggleMenu();
                  handleSpecial();
                }}
                className="hover:text-cyan-300"
              >
                About Us
              </NavLink>
            </div>
          </div>
        </div>
      </div>

    
     
    </div>
  );
};

export default Header;
