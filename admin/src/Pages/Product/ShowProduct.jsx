import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl  } from "../../App";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

const ShowProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [sortOrder, setSortOrder] = useState("oldest"); // oldest first to show original products

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl }/api/product/all`, {
        params: { limit: 1000 },
      });
      let all = res.data.data || [];
      
      // Sort products based on sortOrder
      if (sortOrder === "newest") {
        all = all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        // oldest first - shows original products first
        all = all.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      
      setProducts(all);
      setFiltered(all);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (val) => {
    setSearch(val);
    applyFilters(val, category);
  };

  const handleCategory = (cat) => {
    setCategory(cat);
    applyFilters(search, cat);
  };

  const applyFilters = (s, c) => {
    let list = [...products];
    if (s) {
      list = list.filter((p) => {
        const t = `${p.name} ${p.description}`.toLowerCase();
        return t.includes(s.toLowerCase());
      });
    }
    if (c) list = list.filter((p) => p.category === c);
    setFiltered(list);
  };

  const categories = [...new Set(products.map((p) => p.category))].filter(
    Boolean,
  );

  const toggleExpand = (productId) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Products</h2>
          <span className="text-lg font-semibold text-gray-600">
            Total: {filtered.length} products
          </span>
        </div>

        <div className="bg-white rounded p-4 mb-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or description"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => handleCategory(e.target.value)}
                className="w-full border rounded p-2"
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Sort By</label>
              <select
                value={sortOrder}
                onChange={(e) => {
                  setSortOrder(e.target.value);
                  fetchProducts();
                }}
                className="w-full border rounded p-2"
              >
                <option value="oldest">Oldest First</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={() => fetchProducts()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate("/admin/products/delete")}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Manage
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No products found</div>
        ) : (
          <div className="space-y-4">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded shadow overflow-hidden hover:shadow-lg transition"
              >
                {/* Main Product Card */}
                <div className="p-4 flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded flex items-center justify-center flex-shrink-0">
                    {p.mainImage ? (
                      <img
                        src={p.mainImage}
                        alt={p.name}
                        className="h-full w-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-gray-500 text-sm">No Image</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">{p.name}</h3>
                    <p className="text-sm text-gray-600">{p.category}</p>
                    <p className="text-sm text-gray-500 mt-1">{p.description?.substring(0, 100)}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-indigo-600 font-bold text-lg">Rs. {p.price}</span>
                      <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded">
                        {p.subProducts?.length || 0} sub-products
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                      className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/product/review/${p._id}`)}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                    >
                      View
                    </button>
                    {p.subProducts?.length > 0 && (
                      <button
                        onClick={() => toggleExpand(p._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition flex items-center gap-1"
                      >
                        {expandedProduct === p._id ? (
                          <>
                            <FiChevronUp /> Hide
                          </>
                        ) : (
                          <>
                            <FiChevronDown /> Show
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Expanded Sub-Products */}
                {expandedProduct === p._id && p.subProducts?.length > 0 && (
                  <div className="bg-gray-50 border-t p-4">
                    <h4 className="font-semibold mb-3 text-gray-700">Sub-Products ({p.subProducts.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {p.subProducts.map((sub, idx) => (
                        <div key={idx} className="bg-white border rounded p-3">
                          {sub.subImage && (
                            <img
                              src={sub.subImage}
                              alt={sub.subName}
                              className="w-full h-32 object-cover rounded mb-2"
                            />
                          )}
                          <h5 className="font-semibold text-sm">{sub.subName}</h5>
                          <p className="text-sm text-gray-600">Size: {sub.subsize}</p>
                          <p className="text-sm text-indigo-600 font-bold mt-1">Rs. {sub.subPrice}</p>
                          {sub.subDescription && (
                            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{sub.subDescription}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default ShowProduct;
