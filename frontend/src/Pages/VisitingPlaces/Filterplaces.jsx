import React from "react";

const Filterplaces = ({ district, selectDistrict, onChange }) => {
  return (
    <div className="bg-indigo-400/50 rounded-2xl p-4">
      <h3 className="text-lg font-semibold mb-3 text-green-200">Select District</h3>

      {/* All option */}
      <label className="flex items-center gap-2 mb-2 cursor-pointer text-white">
        <input
          type="radio"
          name="district"
          value=""
          checked={selectDistrict === ""}
          onChange={() => onChange("")}
        />
        <span>All</span>
      </label>

      {/* District options */}
      {district.map((dist, index) => (
        <label
          key={index}
          className="flex items-center gap-4 mb-2 cursor-pointer"
        >
          <input
            type="radio"
            name="district"
            value={dist.value}
            checked={selectDistrict === dist.value}
            onChange={() => onChange(dist.value)}
          />
          <span className="text-white ">{dist.label}</span>
        </label>
      ))}
    </div>
  );
};

export default Filterplaces;
