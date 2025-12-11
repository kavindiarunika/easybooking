import React from "react";

export default function HeroSection() {
  return (
    <section className="w-full overflow-hidden">
      <p className="w-full h-12"></p>
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center gap-10">
        {/* Left Text Side */}
        <div className="flex-1 space-y-6 animate-fadeIn">

          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-green-200 drop-shadow-sm prata-regular">
            Explore Sri Lanka with Style & Joy
          </h1>
          <p className="text-lg md:text-xl text-white ">
            Travel like a dreamer, where every sunrise feels like a story
            waiting to unfold. Wander through mist–kissed mountains, golden
            beaches that glow under the sun, and ancient kingdoms carved with
            legends of kings and gods. Indulge in the warmth of local smiles,
            the aroma of spicy delights, and the rhythm of wildlife calling from
            lush jungles. Whether you seek thrilling adventures, peaceful
            escapes, or unforgettable cultural wonders, Sri Lanka welcomes you
            to discover the magic that lies beyond the ordinary. Your journey to
            paradise begins here.
          </p>

          <button className="px-8 py-3 font-medium text-white bg-blue-600 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300">
            Start Your Journey
          </button>
        </div>

        {/* Right Image Side */}
        <div className="flex-1 flex justify-center">
          <img
            src="https://duqjpivknq39s.cloudfront.net/2019/03/800x750-94.jpg"
            alt="Travelling"
            className="w-full max-w-md rounded-3xl shadow-lg transform hover:scale-105 transition duration-500 ease-in-out"
          />
        </div>
      </div>
    </section>
  );
}
