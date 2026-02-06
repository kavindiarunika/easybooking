import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../App";
import { toast, ToastContainer } from "react-toastify";
import {
  FaSearch,
  FaThLarge,
  FaThList,
  FaStar,
  FaShoppingCart,
} from "react-icons/fa";

const ProductBrowse = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("latest");

  const categories = ["electronics", "clothing", "food", "home", "other"];

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/product/all`, {
        params: {
          page: currentPage,
          limit: 12,
          category: selectedCategory || undefined,
          sort:
            sortBy === "price-low"
              ? "price"
              : sortBy === "price-high"
                ? "-price"
                : "-createdAt",
        },
      });

      setProducts(response.data.data || []);
      setFilteredProducts(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);

    const filtered = products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category === selectedCategory ? "" : category);
    setCurrentPage(1);
  };

  const handleReview = (productId) => {
    toast.info("Review feature coming soon!");
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-4 md:px-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Browse Products</h1>
        <p className="text-gray-400">
          Discover amazing products from our vendors
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:border-blue-500"
          />
          <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Search
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="bg-gray-800/50 p-6 rounded-lg h-fit border border-gray-700">
          <h3 className="text-xl font-bold mb-4">Filters</h3>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm">Categories</h4>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategory === category}
                    onChange={() => handleCategoryChange(category)}
                    className="w-4 h-4 rounded"
                  />
                  <span className="capitalize">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm">Sort By</h4>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-gray-700 border border-gray-600 rounded p-2"
            >
              <option value="latest">Latest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Clear Filters */}
          {selectedCategory && (
            <button
              onClick={() => {
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-400">
              Showing {filteredProducts.length} products
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-600"
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                <FaThList />
              </button>
            </div>
          </div>

          {/* Products Grid/List */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                  : "space-y-4"
              }
            >
              {filteredProducts.map((product) => (
                <div
                  key={product._id}
                  className={`bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition ${
                    viewMode === "list" ? "flex gap-4" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={
                      viewMode === "list"
                        ? "w-48 h-48 flex-shrink-0"
                        : "w-full h-48"
                    }
                  >
                    <img
                      src={
                        product.mainImage || "https://via.placeholder.com/300"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold hover:text-blue-400 cursor-pointer">
                          {product.name}
                        </h3>
                        <span className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs capitalize">
                          {product.category}
                        </span>
                      </div>

                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Rating */}
                      {product.rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={
                                  i < Math.round(product.rating)
                                    ? "text-yellow-400"
                                    : "text-gray-600"
                                }
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400">
                            ({product.reviews?.length || 0} reviews)
                          </span>
                        </div>
                      )}

                      {/* Stock Status */}
                      <p className="text-sm text-gray-400 mb-3">
                        Stock:{" "}
                        <span
                          className={
                            product.stock > 0
                              ? "text-green-400"
                              : "text-red-400"
                          }
                        >
                          {product.stock > 0
                            ? `${product.stock} available`
                            : "Out of Stock"}
                        </span>
                      </p>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                      <div>
                        <p className="text-2xl font-bold text-blue-400">
                          Rs. {product.price}
                        </p>
                        {product.size && (
                          <p className="text-xs text-gray-400">
                            Size: {product.size}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleReview(product._id)}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center gap-2"
                        >
                          <FaShoppingCart /> View
                        </button>
                      </div>
                    </div>

                    {/* Contact Info */}
                    {(product.whatsapp || product.email) && (
                      <div className="text-xs text-gray-400 mt-3 pt-3 border-t border-gray-700">
                        {product.whatsapp && (
                          <a
                            href={`https://wa.me/${product.whatsapp.replace(
                              /\D/g,
                              "",
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-green-400"
                          >
                            WhatsApp: {product.whatsapp}
                          </a>
                        )}
                        {product.whatsapp && product.email && <br />}
                        {product.email && (
                          <a
                            href={`mailto:${product.email}`}
                            className="hover:text-blue-400"
                          >
                            Email: {product.email}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No products found</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-600"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default ProductBrowse;
