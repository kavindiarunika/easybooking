import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../App";
import ProductBanner from "./ProductBanner";
import ProductHeader from "./ProductHeader";
import { useNavigate } from "react-router-dom";

const ProductHome = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/product/all`, {
        params: {
          page: 1,
          limit: 100,
          category: category || undefined,
          sort: sort || undefined,
          search: search || undefined,
        },
      });
      if (res.data && res.data.data) setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProducts();
  }, [category, sort, search]);

  return (
    <div className="bg-white/30 p-6">
      <ProductHeader
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
        search={search}
        onSearch={setSearch}
      />
      <ProductBanner />

      {/*------------------show products-------------- */}
      <div className="max-w-6xl mx-auto mt-8">
        {loading ? (
          <div className="text-center py-12">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">No products found.</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                role="button"
                onClick={() => navigate(`/product/review/${p._id}`)}
                className="bg-white rounded shadow overflow-hidden cursor-pointer hover:shadow-lg transition"
              >
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {p.mainImage ? (
                    <img
                      src={p.mainImage}
                      alt={p.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-500">No image</div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-600">{p.category}</p>
                  <p className="text-lg font-bold text-green-600 mt-2">
                    {p.price ? `RS${p.price}` : "Price N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductHome;
