import React from "react";

const CommingSoon = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

        {/* Left Content */}
        <div className="text-center lg:text-left space-y-6">
          <span className="text-sm uppercase tracking-widest text-gray-400">
            helalanka.lk
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Launching <br /> Soon
          </h1>

          <p className="text-gray-400 max-w-md mx-auto lg:mx-0">
            We’re building a trusted platform to connect you with verified
            Ayurvedic doctors across Sri Lanka. Transparent pricing, no hidden
            fees, and easy appointment booking — all in one place.
          </p>

          {/* Coming Soon Badge */}
          <span className="inline-block mt-4 text-sm font-semibold  px-6 py-2 border-2 border-white text-white shadow-lg">
            Coming Soon
          </span>
        </div>

        {/* Right Image + Gradient Shape */}
        <div className="relative flex justify-center">
          {/* Gradient blob */}
          <div className="absolute -inset-10 bg-gradient-to-r rounded-full blur-3xl opacity-40"></div>

          {/* Circle Image */}
          <div className="relative bg-white rounded-full p-2 shadow-2xl">
            <img
              src="/comming.png"
              alt="Launching Soon"
              className="w-72 h-72 sm:w-96 sm:h-96 rounded-full object-cover"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommingSoon;
