import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import {
  FaTrash,
  FaEdit,
  FaSearch,
  FaEye,
  FaEyeSlash,
  FaStar,
} from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const DeleteProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setcategoryFilter] = useState("");

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/api/product/all`, {
        params: { limit: 1000 },
      });
      const allProducts = response.data.data || [];
      setProducts(allProducts);
      setFilteredProducts(allProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    filterProducts(term, categoryFilter);
  };

  const handleCategoryFilter = (category) => {
    setcategoryFilter(category);
    filterProducts(searchTerm, category);
  };

  const filterProducts = (search, category) => {
    let filtered = products;

    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    setFilteredProducts(filtered);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${backendUrl}/api/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Product deleted successfully");
      fetchAllProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${backendUrl}/api/product/toggle/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      toast.success("Product status updated");
      fetchAllProducts();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update product status");
    }
  };

  // Get unique categories
  const categories = [...new Set(products.map((p) => p.category))].filter(
    Boolean,
  );

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <IoArrowBackOutline size={26} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Search Bar */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Search Products
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full border border-gray-300 rounded p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <FaSearch className="absolute left-3 top-4 text-gray-400" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Filter by Category
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => handleCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="text-sm text-gray-600">
            Found <span className="font-bold">{filteredProducts.length}</span>{" "}
            product(s)
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Product Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Sub-Products
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.mainImage && (
                          <img
                            src={product.mainImage}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product._id.slice(-8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-gray-800">
                        Rs. {product.price}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm">
                        {product.rating > 0 ? (
                          <>
                            {product.rating}
                            <FaStar className="text-yellow-400" size={14} />
                          </>
                        ) : (
                          "N/A"
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          product.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {product.subProducts ? product.subProducts.length : 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(product._id)}
                          className={`p-2 rounded transition ${
                            product.isActive
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white`}
                          title={product.isActive ? "Deactivate" : "Activate"}
                        >
                          {product.isActive ? (
                            <FaEyeSlash size={16} />
                          ) : (
                            <FaEye size={16} />
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(product._id, product.name)
                          }
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
                          title="Delete Product"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default DeleteProduct;
