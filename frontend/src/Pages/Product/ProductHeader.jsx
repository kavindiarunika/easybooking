import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../../assets/Assest";

const ProductHeader = ({ search, onSearch }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-slate-800/70 backdrop-blur-md">
      <p className="h-4 w-full"></p>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 gap-3">
        {/*-------------- Logo -------------*/}
        <Link to="./" className="flex justify-center md:justify-start">
          <img src={assets.logo} alt="logo" className="w-28 md:w-34" />
        </Link>

        {/*-------------- Search Bar -------------*/}
        <div className="flex items-center border pl-4 gap-2 bg-white/50 border-gray-500/30 h-[42px] md:h-[46px] rounded-full overflow-hidden w-full md:max-w-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 30 30"
            fill="#6B7280"
          >
            <path d="M13 3C7.489 3 3 7.489 3 13s4.489 10 10 10a9.95 9.95 0 0 0 6.322-2.264l5.971 5.971a1 1 0 1 0 1.414-1.414l-5.97-5.97A9.95 9.95 0 0 0 23 13c0-5.511-4.489-10-10-10m0 2c4.43 0 8 3.57 8 8s-3.57 8-8 8-8-3.57-8-8 3.57-8 8-8" />
          </svg>

          <input
            type="text"
            placeholder="Search"
            value={search || ""}
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full h-full outline-none text-gray-600 bg-transparent placeholder-gray-500 text-sm"
          />
        </div>

        {/*-------------- Shop Now & Register Buttons -------------*/}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full md:w-auto">
          <button className="bg-white text-black px-6 py-2 rounded-md text-sm font-medium hover:bg-gray-200 transition w-full sm:w-auto">
            Shop Now
          </button>

          <button
            onClick={() => navigate("/product/register")}
            className="border border-white text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-white hover:text-black transition w-full sm:w-auto"
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductHeader;
