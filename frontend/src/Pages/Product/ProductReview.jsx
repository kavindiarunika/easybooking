import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../App";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoStar } from "react-icons/io5";
import { IoStarHalfOutline } from "react-icons/io5";

const ProductReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedSubProduct, setSelectedSubProduct] = useState(null);

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

  if (loading) {
    return <div className="text-center py-12">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  return (
    <div className=" bg-white/30 p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 rounded text-2xl"
      >
        <IoMdArrowRoundBack />
      </button>
      <div className="grid md:grid-cols-2 gap-8">
        {/* -------- Product Image -------- */}
        <div className=" rounded overflow-hidden ml-16 mt-8">
          {selectedSubProduct?.subImage || product.mainImage ? (
            <img
              src={selectedSubProduct?.subImage || product.mainImage}
              alt={product.name}
              className="w-auto h-54  sm:h-96 object-cover"
            />
          ) : (
            <div className="h-96 flex items-center justify-center">
              No Image
            </div>
          )}
        </div>

        {/* -------- Product Details -------- */}
        <div>
          <div className="flex gap-4">
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

          <div className="mt-4">
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

          {/* Removed old size display */}
          <p className="mt-4 text-gray-900">
            {selectedSubProduct?.subDescription ||
              product.description ||
              "No description available"}
          </p>
          {/* Contact Info */}
          <div className="mt-6 space-y-2">
            {product.whatsapp && (
              <a
                href={`https://wa.me/${product.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="block bg-green-500 text-white px-4 py-2 rounded text-center"
              >
                Contact via WhatsApp
              </a>
            )}

            {product.email && (
              <a
                href={`mailto:${product.email}`}
                className="block bg-blue-500 text-white px-4 py-2 rounded text-center"
              >
                Contact via Email
              </a>
            )}
          </div>
        </div>
      </div>

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
