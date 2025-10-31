import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import homepageImages from "../assets/HomepageImages/home";

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
    <div className="relative w-full h-screen overflow-hidden text-white">
      {/* Background Transition */}
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

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Headline */}
      <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-20 max-w-3xl">
        <motion.h1
          key={"title-" + index}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-6xl font-extrabold leading-tight"
        >
          {current.title}
        </motion.h1>

        <p className="mt-4 text-yellow-400 text-lg sm:text-xl">
          {current.subtitle}
        </p>

        {/* CTA Button */}
        <div className="mt-8">
          <button className="bg-white text-black font-semibold py-3 px-6 rounded-full flex items-center gap-3 hover:bg-gray-200 transition">
            Booking Now
            <span className="text-xl">➜</span>
          </button>
        </div>
      </div>

      {/* Social Icons Right */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 space-y-6 text-xl opacity-90 text-green-400 flex flex-col">
        <FaInstagram className="hover:text-cyan-400 cursor-pointer transition sm:w-12 w-6 h-auto border-4 border-l-fuchsia-500 rounded-full p-2 hover:border-cyan-400" />
        <FaTwitter className="hover:text-cyan-400 cursor-pointer transition sm:w-12 w-6 h-auto border-4 border-l-fuchsia-500 rounded-full p-2 hover:border-cyan-400" />
        <FaYoutube className="hover:text-cyan-400 cursor-pointer transition sm:w-12 w-6 h-auto border-4 border-l-fuchsia-500 rounded-full p-2 hover:border-cyan-400" />
      </div>

      {/* Explore Bottom Right */}
      <div className="absolute bottom-8 right-10 cursor-pointer flex items-center gap-2 group">
        <p className="font-medium group-hover:text-cyan-300 transition">Explore More</p>
        <span className="text-xl group-hover:translate-y-1 transition">↓</span>
      </div>

      {/* Small Slide Dots Left Bottom */}
      <div className="absolute bottom-8 left-10 flex space-x-2">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-2 w-6 rounded-full transition-all ${
              i === index ? "bg-white" : "bg-white/40"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Hero;
