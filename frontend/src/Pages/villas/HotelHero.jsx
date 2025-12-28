import React from "react";
import { heroImage } from "../../assets/HomepageImages/home";

const HotelHero = () => {
  return (
    <div>
      <section className="relative w-full h-screen">
        {/* Hero Image */}
        <img
          src={heroImage[0]} // make sure this points to hero.webp correctly
          alt="Hotel Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay Text */}
        <div className="absolute inset-0 flex flex-col justify-center items-center p-5 md:p-10 text-white bg-black/30">
          <h3 className="text-3xl md:text-5xl font-bold mb-4">
            Welcome to Serene Resorts
          </h3>

          <p className="text-sm md:text-lg leading-relaxed mb-2">
            At Serene Resorts, we provide an exceptional experience with
            luxurious amenities, breathtaking locations, and unmatched
            hospitality. Whether you're seeking relaxation or adventure, our
            resort offers the perfect getaway.
          </p>

          <p className="text-sm md:text-lg leading-relaxed">
            Enjoy world-class facilities, curated dining experiences, and a
            peaceful environment crafted for ultimate comfort. Your journey to
            serenity begins here.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HotelHero;
