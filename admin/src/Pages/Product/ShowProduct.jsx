import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl  } from "../../App";
import "react-toastify/dist/ReactToastify.css";

const ShowProduct = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl }/api/product/all`, {
        params: { limit: 1000 },
      });
      const all = res.data.data || [];
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">All Products</h2>
        </div>

        <div className="bg-white rounded p-4 mb-6 shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by name or description"
                className="w-full border rounded p-2"
              />
            </div>
            <div>
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchProducts()}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Refresh
              </button>
              <button
                onClick={() => navigate("/admin/products/delete")}
                className="px-4 py-2 bg-red-500 text-white rounded"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded shadow overflow-hidden"
              >
                <div className="h-44 bg-gray-200 flex items-center justify-center">
                  {p.mainImage ? (
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500">No Image</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg truncate">{p.name}</h3>
                  <p className="text-sm text-gray-600 truncate">{p.category}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-indigo-600 font-bold">
                      Rs. {p.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      {p.subProducts?.length || 0} variants
                    </span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => navigate(`/admin/products/edit/${p._id}`)}
                      className="flex-1 py-2 bg-yellow-500 text-white rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => navigate(`/product/${p._id}`)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded"
                    >
                      View
                    </button>
                  </div>
                </div>
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
