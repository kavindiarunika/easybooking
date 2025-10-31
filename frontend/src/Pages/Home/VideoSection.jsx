import React from "react";
import { AiOutlineSearch, AiFillStar, AiOutlineClockCircle } from "react-icons/ai";
import { FaHotel } from "react-icons/fa";

const AboutSection = () => {
  const features = [
    {
      icon: <AiOutlineSearch size={28} className="text-green-600" />,
      title: "Easy to Find",
      description: "Search and discover the best hotels easily in any city with just a few clicks.",
    },
    {
      icon: <FaHotel size={28} className="text-green-600" />,
      title: "Best Hotels",
      description: "We offer a curated list of top-rated hotels for your comfort and convenience.",
    },
    {
      icon: <AiFillStar size={28} className="text-green-600" />,
      title: "Trusted Ratings",
      description: "All hotels are rated and reviewed by travelers to help you make the best choice.",
    },
    {
      icon: <AiOutlineClockCircle size={28} className="text-green-600" />,
      title: "24/7 Booking",
      description: "Book your stay anytime, anywhere with our fast and secure online system.",
    },
  ];

  return (
    <section className="w-full py-16 px-4 md:px-16 ">
      <p className="w-full h-12"></p>
    
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-100 mb-4">About Our Service</h2>
        <p className="text-yellow-100 text-lg max-w-2xl mx-auto">
          We help you book hotels easily, find the best places to stay, and make your travel experience unforgettable.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-cyan-100 rounded-3xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-500"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AboutSection;
