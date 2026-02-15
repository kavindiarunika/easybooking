import React from "react";
import { useNavigate } from "react-router-dom";
import { productAssets } from "../../assets/Product/productAssets";

const ProductBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="mx-4 md:mx-24 mt-4 mb-4">
      <div className="hidden sm:block w-full h-[60vh] md:h-[70vh] rounded-lg overflow-hidden relative">
        
        {/* Background Image */}
        <img
          src={productAssets.productHome}
          alt="Product Banner"
          className="w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/30"></div>

        {/* Content */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-center 
                        w-full md:w-1/2 px-5 md:px-10 text-white gap-4 md:gap-5
                        items-center md:items-start text-center md:text-left">

          <h1 className="text-2xl md:text-4xl font-semibold prata-regular">
            Discover Authentic Sri Lankan Products
          </h1>

          <p className="inter-regular text-xs md:text-sm leading-relaxed max-w-md md:max-w-none">
            Explore the beauty and tradition of Sri Lanka through our carefully
            selected collection of premium Ceylon tea, flavorful spices,
            traditional dry foods, handmade handicrafts, cultural masks,
            Ayurvedic wellness products, stylish clothing, unique jewelry, and
            memorable souvenir gifts. Each product is crafted by local artisans,
            bringing you the true essence of Sri Lankan heritage.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mt-2">
            
            <button className="bg-white text-black px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition w-full sm:w-auto">
              Shop Now
            </button>

            <button
              onClick={() => navigate("/product/register")}
              className="border border-white px-6 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition w-full sm:w-auto"
            >
              Register
            </button>

          </div>
        </div>
      </div>
      <div className="flex gap-2">
       <button className="lg:hidden bg-white text-black px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition w-full sm:w-auto">
              Shop Now
            </button>

            <button
              onClick={() => navigate("/product/register")}
              className="lg:hidden border border-white px-6 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition w-full sm:w-auto"
            >
              Register
            </button>
            </div>
    </div>
  );
};

export default ProductBanner;
