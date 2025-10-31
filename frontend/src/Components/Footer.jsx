import React from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { assets } from "../assets/Assest";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-slate-800 via-slate-800 to-gray-900 text-gray-200 px-6 py-16 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={assets.logo} alt="logo" className="w-24 sm:w-64 h-auto" />
         
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">
            Explore the breathtaking beauty of Sri Lanka — from serene highlands
            to golden beaches. Your unforgettable journey starts here.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="flex flex-col gap-3">
            <li>
              <Link
                to="/"
                className="hover:text-green-400 transition-all duration-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-green-400 transition-all duration-300"
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/villa"
                className="hover:text-green-400 transition-all duration-300"
              >
                Luxury Villas
              </Link>
            </li>
            <li>
              <Link
                to="/trending"
                className="hover:text-green-400 transition-all duration-300"
              >
                Trending Hotels
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact</h4>
          <ul className="flex flex-col gap-3 text-sm text-gray-300">
            <li className="flex items-center gap-2 hover:text-green-400 transition">
              <FaMapMarkerAlt className="text-green-400" />
              Colombo, Sri Lanka
            </li>
            <li className="flex items-center gap-2 hover:text-green-400 transition">
              <FaEnvelope className="text-green-400" />
              nadevillasandtours21@gmail.com
            </li>
            <li className="flex items-center gap-2 hover:text-green-400 transition">
              <FaPhone className="text-green-400" />
              +94 71 978 0312
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
          <p className="text-gray-300 text-sm mb-4">
            Stay connected for tips, offers, and inspiration.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-3 bg-green-700 rounded-full hover:bg-green-500 transition transform hover:scale-110"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              className="p-3 bg-green-700 rounded-full hover:bg-green-500 transition transform hover:scale-110"
            >
              <FaInstagram />
            </a>
            <a
              href="#"
              className="p-3 bg-green-700 rounded-full hover:bg-green-500 transition transform hover:scale-110"
            >
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-green-700 mt-12 pt-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Nadee Villa & Tourism. All rights reserved.
        <br />
        <span className="text-gray-500">
          Crafted with ❤️ in Sri Lanka — Explore. Dream. Discover.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
