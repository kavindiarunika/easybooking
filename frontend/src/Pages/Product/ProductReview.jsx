import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../App";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoStar } from "react-icons/io5";
import { IoStarHalfOutline } from "react-icons/io5";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";

const ProductReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubProduct, setSelectedSubProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const showDebug =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).has("debug");

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/product/details/${id}`);
      if (res.data && res.data.data) setProduct(res.data.data);
      else if (res.data) setProduct(res.data);
    } catch (err) {
      console.error("Error fetching product", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    if (product?.subProducts?.length > 0) {
      setSelectedSubProduct(product.subProducts[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product) console.log("Product details:", product);
  }, [product]);

  // Get all available sizes with their sources
  const getAllSizes = () => {
    const sizes = [];
    if (product?.size) {
      sizes.push({ label: product.size, isMain: true });
    }
    if (product?.subProducts) {
      product.subProducts.forEach((sub, index) => {
        if (sub.subsize) {
          sizes.push({ label: sub.subsize, isMain: false, subIndex: index });
        }
      });
    }
    return sizes;
  };

  const handleSizeClick = (size) => {
    if (size.isMain) {
      setSelectedSubProduct(null);
    } else {
      setSelectedSubProduct(product.subProducts[size.subIndex]);
    }
  };

  const getColorHex = (colorName) => {
    const colorMap = {
      Red: "#EF4444",
      Blue: "#3B82F6",
      Green: "#10B981",
      Black: "#000000",
      White: "#FFFFFF",
      Purple: "#8B5CF6",
      Yellow: "#FBBF24",
      Pink: "#F472B6",
      Orange: "#F97316",
      Brown: "#A16207",
      "light blue": "#ADD8E6",
      "navy blue": "#000080",
      oracle: "#F80102",
      gold: "#FFD700",
      Gray: "#9CA3AF",
    };
    return colorMap[colorName] || "#cccccc";
  };

  const formatPhoneForWhatsApp = (phone) => {
    if (!phone) return null;
    // remove all non-digit characters
    const digits = phone.replace(/\D/g, "");
    return digits || null;
  };

  const getWhatsAppLink = () => {
    const num = formatPhoneForWhatsApp(product?.whatsapp);
    if (!num) return null;
    const productLabel = product?.name || "your product";
    const subLabel = selectedSubProduct?.subName
      ? ` - ${selectedSubProduct.subName}`
      : "";
    const msg = `Hi, I'm interested in ${productLabel}${subLabel}`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  if (loading) {
    return <div className="text-center py-12">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className="bg-white p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded text-2xl"
      >
        <IoMdArrowRoundBack />
      </button>
      <div className="lg:hidden flex gap-4">
        <h1 className="text-3xl sm:text-5xl font-bold text-black prata-regular ">
          {product.name}
        </h1>
        <div className="flex gap-1 text-xl  sm:text-2xl mt-2 sm:mt-4">
          <IoStar className="" />
          <IoStar />
          <IoStar />
          <IoStar />
          <IoStarHalfOutline />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {/* -------- Product Image -------- */}
        <div className=" rounded overflow-hidden sm:ml-16 mt-8">
          {selectedSubProduct?.subImage ||
          selectedImage ||
          product.mainImage ? (
            <img
              src={
                selectedSubProduct?.subImage ||
                selectedImage ||
                product.mainImage
              }
              alt={product.name}
              className="w-auto h-54  sm:h-96 object-cover"
            />
          ) : (
            <div className="h-96 flex items-center justify-center">
              No Image
            </div>
          )}

          {/* Other Images gallery */}
          {product.OtherImages && product.OtherImages.length > 0 && (
            <div className="mt-4 flex gap-3 overflow-x-auto">
              {product.OtherImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`other-${idx}`}
                  onClick={() => {
                    setSelectedImage(img);
                    setSelectedSubProduct(null);
                  }}
                  className={`w-20 h-20 sm:w-32 sm:h-32 object-cover rounded-md cursor-pointer border ${
                    selectedImage === img
                      ? "border-blue-500"
                      : "border-gray-300"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* -------- Product Details -------- */}
        <div>
          <div className="hidden sm:block flex gap-4">
            <h1 className="text-3xl sm:text-5xl font-bold text-black prata-regular ">
              {product.name}
            </h1>
            <div className="flex gap-1 text-xl  sm:text-2xl mt-2 sm:mt-4">
              <IoStar className="" />
              <IoStar />
              <IoStar />
              <IoStar />
              <IoStarHalfOutline />
            </div>
          </div>

          <div>
            <p className="text-xl font-bold mt-4 mb-2">
              {selectedSubProduct?.subPrice
                ? `RS ${selectedSubProduct.subPrice}.00`
                : product.price
                  ? `RS ${product.price}.00`
                  : "Price N/A"}
            </p>
          </div>
          <div className="flex flex-row gap-4  sm:gap-8">
            <img
              src={product.mainImage}
              alt={product.name}
              onClick={() => setSelectedSubProduct(null)}
              className={`w-24 object-cover rounded-md cursor-pointer border ${
                selectedSubProduct === null
                  ? "border-black"
                  : "border-transparent"
              }`}
            />
            {product.subProducts &&
              product.subProducts.map((sub, index) => (
                <img
                  key={index}
                  src={sub.subImage}
                  onClick={() => setSelectedSubProduct(sub)}
                  className={`w-24 object-cover rounded-md cursor-pointer border ${
                    selectedSubProduct === sub
                      ? "border-black"
                      : "border-transparent"
                  }`}
                />
              ))}
          </div>

          <div className="mt-4 ">
            <p className="text-sm font-semibold mb-2">Available Sizes:</p>
            <div className="flex flex-wrap gap-2">
              {getAllSizes().map((size, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSizeClick(size)}
                  className={`px-4 py-2 rounded border font-medium transition ${
                    (size.isMain && selectedSubProduct === null) ||
                    (!size.isMain &&
                      selectedSubProduct === product.subProducts[size.subIndex])
                      ? "border-black bg-black text-white"
                      : "border-gray-300 bg-white text-black hover:border-black"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold mb-2">Available Colors:</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-white"
                  >
                    <div
                      className={`w-5 h-5 rounded-full ${color === "White" ? "border border-gray-400" : ""}`}
                      style={{
                        backgroundColor: getColorHex(color),
                      }}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        

          {/* Removed old size display */}
          <p className="mt-4 text-gray-900">
            {selectedSubProduct?.subDescription ||
              product.description ||
              "No description available"}
          </p>
            <div className="mt-2 flex flex-col sm:flex-row  sm:gap-4">
           <div>
            <p className="text-m  mt-4 mb-2">
              Conatct US:
              {selectedSubProduct?.whatsapp
                ? `${selectedSubProduct.subPrice}`
                : product.whatsapp
                  ? `${product.whatsapp}`
                  : "No contact number"}
            </p>
          </div>
           <div>
            <p className="text-m  mt-4 mb-2">
              E-mail:
              {selectedSubProduct?.email
                ? `${selectedSubProduct.email}`
                : product.email
                  ? `${product.email}`
                  : "No email available"}
            </p>
          </div>
          </div>
          {/* Contact Info (replaced by fixed floating icons) */}
          <div className="mt-6" />
        </div>

        
      </div>

      {/* Fixed floating contact icons (bottom-right) */}
      {(product.whatsapp || product.email) && (
        <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
          {product.whatsapp && (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              title="Contact via WhatsApp"
              className="w-12 h-12 rounded-full flex items-center justify-center bg-green-500 text-white shadow-lg hover:scale-105 transition-transform"
            >
              <FaWhatsapp />
            </a>
          )}

          {product.email && (
            <a
              href={`mailto:${product.email}`}
              title="Contact via Email"
              className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-lg hover:scale-105 transition-transform"
            >
              <FaEnvelope />
            </a>
          )}
        </div>
      )}

      {/* -------- Review Section (Optional UI) -------- */}
      <div className="hidden mt-12">
        <h2 className="text-xl font-semibold mb-4">Customer Reviews</h2>

        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((r, index) => (
              <div key={index} className="border p-3 rounded bg-gray-50">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-yellow-500">⭐ {r.rating}/5</p>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet.</p>
        )}
      </div>
      {showDebug && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">DEBUG: product JSON</h3>
          <pre className="text-xs bg-gray-100 p-4 overflow-auto max-h-80">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductReview;
