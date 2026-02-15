import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { BACKEND_URL } from "../App.jsx";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { FaStar, FaMapMarkerAlt, FaGlobe } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/api/product/all`);
        console.log("Products response:", response.data);
        // Products are nested in response.data.data
        const productData = response.data.data
          ? response.data.data.slice(0, 8)
          : [];
        setProducts(productData);
      } catch (error) {
        console.log("Error while fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Slick carousel settings
  const slickSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows:false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  if (loading) {
    return (
      <section className="w-full py-16 px-4">
        <div className="text-center text-white">Loading products...</div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-12 p-4 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-4xl font-bold text-blue-200"> Products</h2>
        <Link to="/product">
          <button className="text-sm flex items-center gap-2 bg-green-600 text-white px-2 sm:px-4 py-2 rounded-xl hover:bg-green-700 transition">
           More<AiOutlineArrowRight />
          </button>
        </Link>
      </div>

      {/* Slick Carousel */}
      {products.length > 0 ? (
        <div className="product-carousel px-2">
          <Slider {...slickSettings}>
            {products.map((item) => (
              <Link
                to={`/product/${item._id}`}
                key={item._id}
                className="group px-2"
              >
                <div
                  className="bg-white rounded-2xl overflow-hidden shadow-md
                             hover:shadow-2xl transition-all duration-300
                             hover:-translate-y-2 h-full"
                >
                  {/* Image */}
                  <div className="relative">
                    {item.mainImage ? (
                      <img
                        src={item.mainImage}
                        alt={item.name}
                        className="w-full h-34 sm:h-52 object-cover
                                   group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-52 bg-gray-200 flex items-center justify-center">
                        No image
                      </div>
                    )}

                  

                    {/* Price badge */}
                    <div
                      className="absolute top-3 right-3 bg-green-600 text-white
                                 px-3 py-1 rounded-full text-sm font-semibold shadow"
                    >
                      Rs.{item.price}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 truncate">
                      {item.name}
                    </h3>

                    {/* Location */}
                    <div className="hidden sm:block flex items-center gap-1 text-gray-500 text-sm mb-2">
                      <FaMapMarkerAlt className="text-red-500" />
                      <span className="truncate">
                        {item.location || item.district || "Sri Lanka"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {item.description?.length > 60
                        ? item.description.slice(0, 60) + "..."
                        : item.description}
                    </p>

                    {/* Rating and Country */}
                    <div className="hidden sm:block flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`text-sm ${
                              i < (item.rating || 4)
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({item.rating || 4} Star)
                        </span>
                      </div>

                      {/* Country at bottom right */}
                      <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        <FaGlobe className="text-blue-500" />
                        <span>{item.country || "Sri Lanka"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </Slider>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-10">
          No products available at the moment
        </div>
      )}

      {/* Custom Slick styles */}
      <style>{`
        .product-carousel .slick-slide {
          padding: 0 8px;
        }

        .product-carousel .slick-dots {
          margin-top: 20px;
        }

        .product-carousel .slick-dots li button:before {
          font-size: 12px;
          color: #2563eb;
        }

        .product-carousel .slick-dots li.slick-active button:before {
          color: #1d4ed8;
        }

        .product-carousel .slick-prev,
        .product-carousel .slick-next {
          z-index: 1;
          top: 50%;
          transform: translateY(-50%);
        }

       
      `}</style>
    </section>
  );
};

export default Product;
