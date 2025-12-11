import React from "react";
import galleryImages from "../../assets/Gallery/gallery.js"; // adjust path if needed

const Gallery = () => {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center -mt-16">
     

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl">
        {galleryImages.map((image, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
          >
            <img
              src={image}
              alt={`gallery-${i}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;
