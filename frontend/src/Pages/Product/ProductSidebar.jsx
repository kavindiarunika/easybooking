import React, { useState } from "react";

const ProductSidebar = ({
  category,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  businessName,
  onBusinessNameChange,
  weight,
  onWeightChange,
}) => {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
    business: true,
    weight: true,
  });
  const [customWeight, setCustomWeight] = useState("");

  const categories = [
    "Dry Food & Spices",
    "Traditional Handicrafts & Cultural Items",
    "Clothing & Textiles",
    "Jewelry & Accessories",
    "Ayurvedic & Natural Products",
    "Souvenirs & Gift Items",
    "Home Decor & Art",
    "Beverage Products",
  ];

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <div className="w-full md:w-72 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 h-fit border border-slate-700 shadow-lg">
      {/* Title */}
      <h2 className="text-xl font-bold text-white mb-6 pb-4 border-b border-slate-700">
        Filters
      </h2>

      {/* Categories Section */}
      <div className="mb-7">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full font-semibold text-green-400 hover:text-green-300 transition text-base mb-3"
        >
          <span>Categories</span>
          <span className="text-lg">{expandedSections.category ? "−" : "+"}</span>
        </button>
        {expandedSections.category && (
          <div className="mt-3 space-y-3 pl-2 border-l-2 border-green-500/30">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={!category}
                onChange={() => onCategoryChange("")}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer accent-green-500"
              />
              <span className="text-sm text-gray-300 group-hover:text-white transition">All Categories</span>
            </label>
            {categories.map((cat) => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={category === cat}
                  onChange={() => onCategoryChange(category === cat ? "" : cat)}
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 cursor-pointer accent-green-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition">{cat}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Section */}
      <div className="mb-7">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full font-semibold text-green-400 hover:text-green-300 transition text-base mb-3"
        >
          <span>Price Range</span>
          <span className="text-lg">{expandedSections.price ? "−" : "+"}</span>
        </button>
        {expandedSections.price && (
          <div className="mt-3 space-y-3 pl-2 border-l-2 border-green-500/30">
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    min: e.target.value,
                  })
                }
                className="w-1/2 px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition"
              />
              <input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) =>
                  onPriceRangeChange({
                    ...priceRange,
                    max: e.target.value,
                  })
                }
                className="w-1/2 px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition"
              />
            </div>
            <div className="text-xs text-gray-400 bg-slate-700/50 px-3 py-2 rounded-lg">
              RS {priceRange.min || "0"} - RS {priceRange.max || "∞"}
            </div>
          </div>
        )}
      </div>

      {/* Weight Section - Only for Dry Food & Spices */}
      {category === "Dry Food & Spices" && (
        <div className="mb-7">
          <button
            onClick={() => toggleSection("weight")}
            className="flex items-center justify-between w-full font-semibold text-green-400 hover:text-green-300 transition text-base mb-3"
          >
            <span>Weight/Size</span>
            <span className="text-lg">{expandedSections.weight ? "−" : "+"}</span>
          </button>
          {expandedSections.weight && (
            <div className="mt-3 space-y-3 pl-2 border-l-2 border-green-500/30">
              {/* Predefined Weight Options */}
              <div className="space-y-2">
                {["50g", "100g", "250g", "500g", "1kg"].map((w) => (
                  <button
                    key={w}
                    onClick={() => {
                      onWeightChange(weight === w ? "" : w);
                      setCustomWeight("");
                    }}
                    className={`w-full py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                      weight === w
                        ? "bg-green-600 text-white shadow-lg shadow-green-600/50"
                        : "bg-slate-700 text-gray-300 hover:bg-slate-600 border border-slate-600"
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>

              {/* Custom Size Option */}
              <div className="pt-2 border-t border-slate-700">
                <label className="text-xs text-gray-400 font-semibold mb-2 block">
                  Custom Size:
                </label>
                <input
                  type="text"
                  placeholder="e.g., 750g, 2kg"
                  value={customWeight}
                  onChange={(e) => {
                    setCustomWeight(e.target.value);
                    onWeightChange(e.target.value);
                  }}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Business Name Section */}
      <div className="mb-7">
        <button
          onClick={() => toggleSection("business")}
          className="flex items-center justify-between w-full font-semibold text-green-400 hover:text-green-300 transition text-base mb-3"
        >
          <span>Business Name</span>
          <span className="text-lg">{expandedSections.business ? "−" : "+"}</span>
        </button>
        {expandedSections.business && (
          <div className="mt-3 pl-2 border-l-2 border-green-500/30">
            <input
              type="text"
              placeholder="Search business..."
              value={businessName}
              onChange={(e) => onBusinessNameChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30 transition"
            />
          </div>
        )}
      </div>

      {/* Clear Filters Button */}
      <button
        onClick={() => {
          onCategoryChange("");
          onPriceRangeChange({ min: "", max: "" });
          onBusinessNameChange("");
          onWeightChange("");
          setCustomWeight("");
        }}
        className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg font-semibold hover:from-green-500 hover:to-green-400 transition shadow-lg hover:shadow-xl text-sm mt-2"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductSidebar;
