import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../../App";
import { IoMdArrowRoundBack } from "react-icons/io";
import { IoStar } from "react-icons/io5";
import { IoStarHalfOutline } from "react-icons/io5";
import { FaWhatsapp, FaEnvelope } from "react-icons/fa";
import { BsCart3, BsShare } from "react-icons/bs";

const ProductReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
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

  const fetchRelatedProducts = async (category) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/api/product/all`, {
        params: {
          category: category,
          limit: 4,
        },
      });
      if (res.data && res.data.data) {
        // Filter out the current product
        const filtered = res.data.data.filter((p) => p._id !== id);
        setRelatedProducts(filtered.slice(0, 4));
      }
    } catch (err) {
      console.error("Error fetching related products", err);
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
    if (product?.category) {
      fetchRelatedProducts(product.category);
    }
  }, [product?.category, id]);

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
    return <div className="text-center py-12 text-white">Loading product...</div>;
  }

  if (!product) {
    return <div className="text-center py-12 text-white">Product not found</div>;
  }

  const currentPrice = selectedSubProduct?.subPrice || product.price;
  const displayImages = [
    selectedSubProduct?.subImage || selectedImage || product.mainImage,
    ...(product.OtherImages || []),
  ];

  return (
    <div className="bg-gradient-to-b from-slate-100 to-slate-50 min-h-screen text-slate-900">
      {/* Header Navigation */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-green-600 hover:text-green-700 transition font-semibold"
        >
          <IoMdArrowRoundBack className="text-xl" />
          Back to Products
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* -------- Image Gallery Section -------- */}
          <div className="sticky top-20 h-fit">
            {/* Main Image */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mb-4 aspect-square flex items-center justify-center shadow-lg">
              {displayImages[0] ? (
                <img
                  src={displayImages[0]}
                  alt={product.name}
                  className="w-full h-full object-contain p-4"
                />
              ) : (
                <div className="text-slate-500">No Image Available</div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {displayImages.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {displayImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (idx === 0) {
                        setSelectedSubProduct(null);
                        setSelectedImage(null);
                      } else {
                        setSelectedImage(img);
                        setSelectedSubProduct(null);
                      }
                    }}
                    className={`aspect-square rounded-lg border-2 overflow-hidden transition-all hover:border-green-500 ${
                      displayImages[0] === img
                        ? "border-green-500 shadow-lg shadow-green-500/30"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`view-${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Sub Products Gallery */}
            {product.subProducts && product.subProducts.length > 0 && (
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-600 mb-3">Product Variants:</p>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => setSelectedSubProduct(null)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedSubProduct === null
                        ? "border-green-500 ring-2 ring-green-500/50"
                        : "border-slate-200 hover:border-green-500 bg-white"
                    }`}
                  >
                    <img
                      src={product.mainImage}
                      alt="main"
                      className="w-full h-full object-cover"
                    />
                  </button>
                  {product.subProducts.map((sub, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSubProduct(sub)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                        selectedSubProduct === sub
                          ? "border-green-500 ring-2 ring-green-500/50"
                          : "border-slate-200 hover:border-green-500 bg-white"
                      }`}
                    >
                      <img
                        src={sub.subImage}
                        alt={`variant-${index}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* -------- Product Details Section -------- */}
          <div>
            {/* Product Title & Rating */}
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight text-slate-900">
                {product.name}
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex gap-1 text-yellow-500">
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStar />
                  <IoStarHalfOutline />
                </div>
                <span className="text-sm text-slate-600">(156 reviews)</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="bg-gradient-to-r from-green-600 to-green-500 rounded-xl p-6 mb-6 text-white shadow-lg">
              <p className="text-green-100 text-sm mb-2">Price</p>
              <h2 className="text-4xl font-bold text-white mb-2">
                RS {currentPrice ? currentPrice.toLocaleString() : "N/A"}
              </h2>
              <p className="text-green-100 text-sm">Free Shipping available</p>
            </div>

            {/* Product Info */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 space-y-3 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-600">Category</span>
                <span className="font-semibold text-slate-900">{product.category}</span>
              </div>
              {product.size && (
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Size</span>
                  <span className="font-semibold text-slate-900">{product.size}</span>
                </div>
              )}
            </div>

            {/* Available Sizes - Quick View */}
            {getAllSizes().length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3 text-slate-900">Available Sizes</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {getAllSizes().map((size, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSizeClick(size)}
                      className={`py-3 px-2 rounded-lg border-2 font-semibold transition-all text-center ${
                        (size.isMain && selectedSubProduct === null) ||
                        (!size.isMain &&
                          selectedSubProduct === product.subProducts[size.subIndex])
                          ? "bg-green-600 border-green-500 text-white shadow-lg shadow-green-600/50"
                          : "border-slate-300 text-slate-700 hover:border-green-500 bg-white"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>

                {/* Detailed Sizes Table */}
                <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Size</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Price</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-900">Details</th>
                          <th className="px-4 py-3 text-center text-sm font-semibold text-slate-900">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* Main Product Size */}
                        <tr
                          className={`border-b border-slate-200 transition-colors ${
                            selectedSubProduct === null
                              ? "bg-green-50"
                              : "hover:bg-slate-50"
                          }`}
                        >
                          <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                            {product.size || "Standard"}
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-green-600">
                            RS {product.price?.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-600">Main product</td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => setSelectedSubProduct(null)}
                              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                                selectedSubProduct === null
                                  ? "bg-green-600 text-white"
                                  : "bg-slate-200 text-slate-700 hover:bg-green-600 hover:text-white"
                              }`}
                            >
                              {selectedSubProduct === null ? "Selected" : "Select"}
                            </button>
                          </td>
                        </tr>

                        {/* Sub Products */}
                        {product.subProducts?.map((sub, idx) => (
                          <tr
                            key={idx}
                            className={`border-b border-slate-200 transition-colors ${
                              selectedSubProduct === sub
                                ? "bg-green-50"
                                : "hover:bg-slate-50"
                            }`}
                          >
                            <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                              {sub.subsize}
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-green-600">
                              RS {sub.subPrice?.toLocaleString()}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">
                              {sub.subName}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => setSelectedSubProduct(sub)}
                                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                                  selectedSubProduct === sub
                                    ? "bg-green-600 text-white"
                                    : "bg-slate-200 text-slate-700 hover:bg-green-600 hover:text-white"
                                }`}
                              >
                                {selectedSubProduct === sub ? "Selected" : "Select"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-semibold mb-3 text-slate-900">Available Colors</p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-3 px-4 py-2 rounded-lg border border-slate-300 hover:border-green-500 transition-all group bg-white"
                    >
                      <div
                        className={`w-6 h-6 rounded-full border ${
                          color === "White" ? "border-slate-500" : ""
                        }`}
                        style={{
                          backgroundColor: getColorHex(color),
                        }}
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-green-600">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 mb-6 shadow-sm">
              <h4 className="font-semibold text-slate-900 mb-3">About this product</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase">Product Name</p>
                  <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                </div>
                {selectedSubProduct ? (
                  <>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Selected Variant</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedSubProduct.subName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Size</p>
                      <p className="text-sm font-semibold text-green-600">{selectedSubProduct.subsize}</p>
                    </div>
                  </>
                ) : (
                  product.size && (
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Size</p>
                      <p className="text-sm font-semibold text-green-600">{product.size}</p>
                    </div>
                  )
                )}
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase mb-1">Description</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    {selectedSubProduct?.subDescription || product.description || "No description available"}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.whatsapp && (
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-green-600/50"
                >
                  <FaWhatsapp className="text-lg" />
                  WhatsApp
                </a>
              )}
              {product.email && (
                <a
                  href={`mailto:${product.email}?subject=Interest in ${
                    product.name + (selectedSubProduct ? ` - ${selectedSubProduct.subName}` : "")
                  }&body=${encodeURIComponent(
                    `Hello,\n\nI am interested in purchasing:\n\nProduct: ${product.name}${
                      selectedSubProduct ? `\nVariant: ${selectedSubProduct.subName}` : ""
                    }\n\nPlease let me know about availability and pricing.\n\nThank you`
                  )}`}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-blue-600/50"
                >
                  <FaEnvelope className="text-lg" />
                  Email
                </a>
              )}
            </div>

            {/* Seller Information */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 shadow-sm">
              <h3 className="font-bold text-lg mb-4 text-green-600">Seller Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-600 text-sm">Contact Number</p>
                  <p className="font-semibold text-slate-900">
                    {selectedSubProduct?.whatsapp || product.whatsapp || "Not available"}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600 text-sm">Email Address</p>
                  <p className="font-semibold text-green-600">
                    {selectedSubProduct?.email || product.email || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-200 mt-12">
          <h2 className="text-3xl font-bold mb-8 text-slate-900">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <button
                key={p._id}
                onClick={() => {
                  navigate(`/product/review/${p._id}`);
                  window.scrollTo(0, 0);
                }}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden hover:border-green-500 transition-all group shadow-sm hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="h-40 bg-slate-100 flex items-center justify-center overflow-hidden">
                  {p.mainImage ? (
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  ) : (
                    <div className="text-slate-500">No image</div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2 group-hover:text-green-600 transition">
                    {p.name}
                  </h3>
                  <p className="text-xs text-slate-600 mb-2">{p.category}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold text-green-600">
                      RS {p.price ? p.price.toLocaleString() : "N/A"}
                    </p>
                    <div className="flex gap-1 text-yellow-500 text-xs">
                      <IoStar />
                      <IoStar />
                      <IoStar />
                      <IoStar />
                      <IoStarHalfOutline />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fixed floating contact icons (bottom-right) */}
      {(product.whatsapp || product.email) && (
        <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-3">
          {product.whatsapp && (
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              title="Contact via WhatsApp"
              className="w-14 h-14 rounded-full flex items-center justify-center bg-green-500 text-white shadow-lg hover:shadow-green-500/50 hover:scale-110 transition-transform"
            >
              <FaWhatsapp className="text-2xl" />
            </a>
          )}

          {product.email && (
            <a
              href={`mailto:${product.email}`}
              title="Contact via Email"
              className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-600 text-white shadow-lg hover:shadow-blue-600/50 hover:scale-110 transition-transform"
            >
              <FaEnvelope className="text-2xl" />
            </a>
          )}
        </div>
      )}

      {showDebug && (
        <div className="mt-6 max-w-7xl mx-auto">
          <h3 className="font-semibold mb-2">DEBUG: product JSON</h3>
          <pre className="text-xs bg-slate-800 p-4 overflow-auto max-h-80 rounded border border-slate-700">
            {JSON.stringify(product, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ProductReview;
