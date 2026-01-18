import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import homepageImages from "../assets/HomepageImages/home";
import { Link, useLocation } from "react-router-dom";
import { MdHotel } from "react-icons/md";
import { RiSafariFill } from "react-icons/ri";
import { FaCar } from "react-icons/fa";

const Hero = () => {
  const slides = homepageImages;
  const [index, setIndex] = useState(0);


  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const current = slides[index];

  return (
    <div className="relative w-full sm:h-screen overflow-hidden text-white h-[60vh]">
      {/* Background */}
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${current.background})` }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-black/40" />

      {/* TEXT CONTENT */}
      <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-8 lg:px-20 max-w-3xl">
        <motion.h1
          key={"title-" + index}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-6xl font-extrabold leading-tight"
        >
          {current.title}
        </motion.h1>

        <p className="mt-4 text-yellow-400 text-base sm:text-xl">
          {current.subtitle}
        </p>

        <Link to="/vendor/register">
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:from-cyan-600 hover:to-blue-700 hover:scale-105 transition-all duration-300"
          >
            Register Now
          </motion.button>
        </Link>
      </div>

      {/* RIGHT ICONS (MOBILE FIXED) */}
      <div className="
        absolute right-3 sm:right-8
        top-1/2 -translate-y-1/2
        flex flex-col
        gap-4 sm:gap-6
        text-green-400
        z-10
      ">
        <Link to="/villa">
          <MdHotel className="
            cursor-pointer transition
            w-10 h-10 sm:w-12 sm:h-12
            border-2 sm:border-4
            border-l-fuchsia-500
            rounded-full p-2
            hover:text-cyan-400 hover:border-cyan-400
          " />
        </Link>

        <Link to="/vehicle">
          <FaCar className="
            cursor-pointer transition
            w-10 h-10 sm:w-12 sm:h-12
            border-2 sm:border-4
            border-l-fuchsia-500
            rounded-full p-2
            hover:text-cyan-400 hover:border-cyan-400
          " />
        </Link>

        <Link to="/safarihome">
          <RiSafariFill className="
            cursor-pointer transition
            w-10 h-10 sm:w-12 sm:h-12
            border-2 sm:border-4
            border-l-fuchsia-500
            rounded-full p-2
            hover:text-cyan-400 hover:border-cyan-400
          " />
        </Link>
      </div>

      {/* EXPLORE */}
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 cursor-pointer flex items-center gap-2 group">
        <p className="font-medium group-hover:text-cyan-300 transition">
          Explore More
        </p>
        <span className="text-xl group-hover:translate-y-1 transition">↓</span>
      </div>

      {/* SLIDE DOTS */}
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-10 flex space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-6 rounded-full transition-all ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
