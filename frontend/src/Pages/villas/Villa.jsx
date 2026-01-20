import React, { useContext, useEffect, useState } from "react";
import { TravelContext } from "../../Context/TravelContext";
import { IoIosArrowBack } from "react-icons/io";
import { MdNavigateNext } from "react-icons/md";
import {
  AiOutlineArrowRight,
  AiOutlineFilter,
  AiOutlineClose,
} from "react-icons/ai";
import { FaGlobe } from "react-icons/fa";

import axios from "axios";
import SearchBar from "../../Components/SearchBar";
import { useParams } from "react-router-dom";

const Villa = () => {

  const { category } = useParams();
  const { navigate, addtrend, setaddtrend } = useContext(TravelContext);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [filteredData, setFilteredData] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [pagination, setpagination] = useState(1);
  const [searchName ,setsearchName] =useState("");
  const pagenumber = 30;

  const totalPages = Math.ceil(filteredData.length / pagenumber);
  const indexOfLastItem = pagination * pagenumber;
  const indexOfFirstitem = indexOfLastItem - pagenumber;

  const currentData = filteredData.slice(indexOfFirstitem, indexOfLastItem);
  // Fetch trending data only if not already in context
  useEffect(() => {
    if (!addtrend || addtrend.length === 0) {
      axios
        .get(
          `${
            import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
          }/api/trending/trenddata`
        )
        .then((res) => setaddtrend(res.data))
        .catch((err) => console.error("Failed to fetch trends:", err));
    }
  }, [addtrend, setaddtrend]);

  // Filter data based on selected category, rating, country, district, and city
  useEffect(() => {
    if (addtrend && addtrend.length > 0) {
      let filtered = addtrend;

      // Apply category filter
      if (selectedCategory !== "all") {
        filtered = filtered.filter(
          (item) => item.category === selectedCategory
        );
      }

      // Apply rating filter
      if (selectedRating !== "all") {
        const ratingValue = parseInt(selectedRating);
        filtered = filtered.filter((item) => {
          const itemRating = item.rating || 5;
          return itemRating === ratingValue;
        });
      }

      // Apply country filter
      if (selectedCountry !== "all") {
        filtered = filtered.filter(
          (item) => (item.country || "Sri Lanka") === selectedCountry
        );
      }

      // Apply district filter
      if (selectedDistrict !== "all") {
        filtered = filtered.filter(
          (item) => item.district === selectedDistrict
        );
      }

      // Apply city filter
      if (selectedCity !== "all") {
        filtered = filtered.filter(
          (item) => item.city === selectedCity
        );
      }

      setFilteredData(filtered);
    


    //search
    if(searchName.trim() !== ""){

      filtered =filtered.filter((item) =>item.name ?.toLowerCase().includes(searchName.toLowerCase()) 
        || item.address?.toLowerCase().includes(searchName.toLowerCase())
    );
      setFilteredData(filtered);

    }
  }  
  }, [addtrend, selectedCategory, selectedRating, selectedCountry, selectedDistrict, selectedCity, searchName]);

  // Reset to first page whenever filters change
  useEffect(() => {
    setpagination(1);
  }, [selectedCategory, selectedRating, selectedCountry, selectedDistrict, selectedCity, searchName]);

  // Ensure current page is within range when filtered data changes
  useEffect(() => {
    if (totalPages === 0) {
      setpagination(1);
    } else if (pagination > totalPages) {
      setpagination(totalPages);
    }
  }, [totalPages, pagination]);

  if (!addtrend || addtrend.length === 0) {
    return <div className="text-white p-10">Loading trending hotels...</div>;
  }

  useEffect(() => {
  if (category && filters.some(f => f.value === category)) {
    setSelectedCategory(category);
  } else {
    setSelectedCategory("all");
  }
}, [category]);


  const filters = [
    { label: "All", value: "all" },
    { label: "Restaurant", value: "restaurant" },
    { label: "Villa", value: "villa" },
    { label: "Hotel", value: "hotel" },
    { label: "House", value: "house" },
  ];

  const ratingFilters = [
    { label: "All Ratings", value: "all" },
    { label: "5 Star", value: "5" },
    { label: "4 Star", value: "4" },
    { label: "3 Star", value: "3" },
    { label: "2 Star", value: "2" },
    { label: "1 Star", value: "1" },
  ];

  // Location data for cascading filters
  const locationData = {
    "Sri Lanka": {
      "Colombo": ["Colombo", "Dehiwala", "Moratuwa", "Kotte", "Maharagama", "Kesbewa"],
      "Gampaha": ["Negombo", "Gampaha", "Kelaniya", "Wattala", "Ja-Ela", "Minuwangoda"],
      "Kandy": ["Kandy", "Peradeniya", "Katugastota", "Gampola", "Nawalapitiya"],
      "Galle": ["Galle", "Hikkaduwa", "Ambalangoda", "Unawatuna", "Koggala"],
      "Matara": ["Matara", "Weligama", "Mirissa", "Dickwella", "Tangalle"],
      "Hambantota": ["Hambantota", "Tissamaharama", "Tangalle", "Ambalantota"],
      "Kalutara": ["Kalutara", "Panadura", "Beruwala", "Wadduwa", "Aluthgama"],
      "Nuwara Eliya": ["Nuwara Eliya", "Hatton", "Bandarawela", "Ella"],
      "Ratnapura": ["Ratnapura", "Balangoda", "Embilipitiya", "Kuruwita"],
      "Anuradhapura": ["Anuradhapura", "Mihintale", "Kekirawa", "Medawachchiya"],
      "Polonnaruwa": ["Polonnaruwa", "Kaduruwela", "Hingurakgoda"],
      "Kurunegala": ["Kurunegala", "Kuliyapitiya", "Polgahawela", "Mawathagama"],
      "Puttalam": ["Puttalam", "Chilaw", "Wennappuwa", "Kalpitiya"],
      "Trincomalee": ["Trincomalee", "Kinniya", "Kantale"],
      "Batticaloa": ["Batticaloa", "Kattankudy", "Eravur"],
      "Ampara": ["Ampara", "Kalmunai", "Akkaraipattu"],
      "Badulla": ["Badulla", "Bandarawela", "Haputale", "Welimada"],
      "Monaragala": ["Monaragala", "Wellawaya", "Bibile"],
      "Jaffna": ["Jaffna", "Chavakachcheri", "Point Pedro", "Nallur"],
      "Kilinochchi": ["Kilinochchi"],
      "Mannar": ["Mannar", "Talaimannar"],
      "Vavuniya": ["Vavuniya"],
      "Mullaitivu": ["Mullaitivu"],
      "Matale": ["Matale", "Dambulla", "Sigiriya", "Ukuwela"],
      "Kegalle": ["Kegalle", "Mawanella", "Rambukkana"]
    },
    "India": {
      "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
      "Karnataka": ["Bangalore", "Mysore", "Mangalore"],
      "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai"],
      "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode"],
      "Delhi": ["New Delhi", "Delhi NCR"],
      "Goa": ["Panaji", "Margao", "Vasco da Gama"]
    },
    "Maldives": {
      "Male": ["Male City", "Hulhumale", "Villimale"],
      "Ari Atoll": ["Mahibadhoo", "Maamigili"],
      "Baa Atoll": ["Eydhafushi", "Thulhaadhoo"]
    },
    "Thailand": {
      "Bangkok": ["Bangkok", "Nonthaburi"],
      "Phuket": ["Phuket Town", "Patong", "Kata"],
      "Chiang Mai": ["Chiang Mai City", "San Kamphaeng"]
    },
    "Other": {
      "Other": ["Other"]
    }
  };

  const countryFilters = [
    { label: "All Countries", value: "all" },
    { label: "🇱🇰 Sri Lanka", value: "Sri Lanka" },
    { label: "🇮🇳 India", value: "India" },
    { label: "🇲🇻 Maldives", value: "Maldives" },
    { label: "🇹🇭 Thailand", value: "Thailand" },
    { label: "🌍 Other", value: "Other" },
  ];

  // Get districts based on selected country
  const getDistrictFilters = () => {
    if (selectedCountry === "all") {
      // Return all districts from all countries
      const allDistricts = [{ label: "All Districts", value: "all" }];
      Object.keys(locationData).forEach(country => {
        Object.keys(locationData[country]).forEach(district => {
          if (!allDistricts.find(d => d.value === district)) {
            allDistricts.push({ label: district, value: district });
          }
        });
      });
      return allDistricts;
    }
    if (locationData[selectedCountry]) {
      return [
        { label: "All Districts", value: "all" },
        ...Object.keys(locationData[selectedCountry]).map(d => ({ label: d, value: d }))
      ];
    }
    return [{ label: "All Districts", value: "all" }];
  };

  // Get cities based on selected country and district
  const getCityFilters = () => {
    if (selectedDistrict === "all") {
      return [{ label: "All Cities", value: "all" }];
    }
    if (selectedCountry !== "all" && locationData[selectedCountry]?.[selectedDistrict]) {
      return [
        { label: "All Cities", value: "all" },
        ...locationData[selectedCountry][selectedDistrict].map(c => ({ label: c, value: c }))
      ];
    }
    // If country is "all", try to find the district in any country
    for (const country of Object.keys(locationData)) {
      if (locationData[country][selectedDistrict]) {
        return [
          { label: "All Cities", value: "all" },
          ...locationData[country][selectedDistrict].map(c => ({ label: c, value: c }))
        ];
      }
    }
    return [{ label: "All Cities", value: "all" }];
  };

  // Reset district and city when country changes
  const handleCountryChange = (value) => {
    setSelectedCountry(value);
    setSelectedDistrict("all");
    setSelectedCity("all");
  };

  // Reset city when district changes
  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setSelectedCity("all");
  };

  const districtFilters = getDistrictFilters();
  const cityFilters = getCityFilters();

  return (
    <section className="w-full py-16 px-4 md:px-16 bg-slate-950">
      <p className="w-full h-24"></p>
             
      {/* Mobile filter toggle button - visible only on small screens */}
      <div className="lg:hidden flex justify-end mb-4">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition"
        >
          Filters <AiOutlineFilter />
        </button>
      </div>

      {/* Main Container with Left Sidebar and Right Cards */}
      <div className="flex flex-col lg:flex-row gap-8 mt-8">
        {/* Left Sidebar - Filters */}
        <aside className="w-full lg:w-64 flex-shrink-0 hidden lg:block">
          <div className="sticky top-4 bg-gray-800 rounded-2xl p-6 shadow-lg max-h-[calc(100vh-100px)] overflow-y-auto">
            <h2 className="text-white text-xl font-bold mb-6">Filters</h2>

            {/* Country Filter - First */}
            <div className="mb-8">
              <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                Country
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {countryFilters.map((country) => (
                  <button
                    key={country.value}
                    onClick={() => handleCountryChange(country.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                      selectedCountry === country.value
                        ? "bg-green-500 text-white font-semibold"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {country.label}
                  </button>
                ))}
              </div>
            </div>

            {/* District Filter - Second */}
            <div className="border-t border-gray-700 pt-6 mb-8">
              <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                District
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {districtFilters.map((district) => (
                  <button
                    key={district.value}
                    onClick={() => handleDistrictChange(district.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                      selectedDistrict === district.value
                        ? "bg-green-500 text-white font-semibold"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {district.label}
                  </button>
                ))}
              </div>
            </div>

            {/* City Filter - Third */}
            <div className="border-t border-gray-700 pt-6 mb-8">
              <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                City
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {cityFilters.map((city) => (
                  <button
                    key={city.value}
                    onClick={() => setSelectedCity(city.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                      selectedCity === city.value
                        ? "bg-green-500 text-white font-semibold"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rating Filter - Fourth */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                Rating
              </h3>
              <div className="space-y-2">
                {ratingFilters.map((rating) => (
                  <button
                    key={rating.value}
                    onClick={() => setSelectedRating(rating.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                      selectedRating === rating.value
                        ? "bg-green-500 text-white font-semibold"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {rating.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSelectedRating("all");
                setSelectedCountry("all");
                setSelectedDistrict("all");
                setSelectedCity("all");
              }}
              className="w-full mt-8 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        {/* Mobile filter panel (overlay) */}
        {mobileFiltersOpen && (
          <div className="absolute top-4 right-1 inset-0 z-50 flex items-start justify-end bg-black/40 lg:hidden">
            <div className="w-6/12 max-w-xs bg-gray-800 rounded-2xl p-6 m-4 shadow-lg overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Filters</h2>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="text-white p-2 rounded hover:bg-gray-700"
                >
                  <AiOutlineClose />
                </button>
              </div>

              {/* Country Filter */}
              <div className="mb-6">
                <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                  Country
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {countryFilters.map((country) => (
                    <button
                      key={country.value}
                      onClick={() => handleCountryChange(country.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedCountry === country.value
                          ? "bg-green-500 text-white font-semibold"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {country.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* District Filter */}
              <div className="border-t border-gray-700 pt-4 mb-6">
                <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                  District
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {districtFilters.map((district) => (
                    <button
                      key={district.value}
                      onClick={() => handleDistrictChange(district.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedDistrict === district.value
                          ? "bg-green-500 text-white font-semibold"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {district.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* City Filter */}
              <div className="border-t border-gray-700 pt-4 mb-6">
                <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                  City
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {cityFilters.map((city) => (
                    <button
                      key={city.value}
                      onClick={() => setSelectedCity(city.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${
                        selectedCity === city.value
                          ? "bg-green-500 text-white font-semibold"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {city.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div className="border-t border-gray-700 pt-4">
                <h3 className="text-green-400 font-semibold mb-4 text-sm uppercase tracking-wide">
                  Rating
                </h3>
                <div className="space-y-2">
                  {ratingFilters.map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => setSelectedRating(rating.value)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 ${
                        selectedRating === rating.value
                          ? "bg-green-500 text-white font-semibold"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {rating.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedRating("all");
                  setSelectedCountry("all");
                  setSelectedDistrict("all");
                  setSelectedCity("all");
                  setMobileFiltersOpen(false);
                }}
                className="w-full mt-8 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* Right Side - Cards Section */}
        <div className="flex-1">
         
          {/* Type Filter - Horizontal at Top */}
          <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-gray-700">
            {filters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedCategory(filter.value)}
                className={`px-6 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === filter.value
                    ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
            <div className="sm:ml-48 hidden sm:block ">
 <SearchBar value={searchName} onChange={(e) => setsearchName(e.target.value)} />
            </div>
          
           
            
          </div>

            <div className="mb-4 mt-2 sm:hidden md:hidden">
                <SearchBar value={searchName} onChange={(e) => setsearchName(e.target.value)} />
            </div>

          {/* Country Select - Above Cards */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-800 rounded-xl">
            <label className="text-white font-medium">🌍 Select Country:</label>
            <select
              value={selectedCountry}
              onChange={(e) => handleCountryChange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {countryFilters.map((country) => (
                <option key={country.value} value={country.value}>
                  {country.label}
                </option>
              ))}
            </select>
            
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {districtFilters.map((district) => (
                <option key={district.value} value={district.value}>
                  {district.label}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
            >
              {cityFilters.map((city) => (
                <option key={city.value} value={city.value}>
                  {city.label}
                </option>
              ))}
            </select>

            {(selectedCountry !== "all" || selectedDistrict !== "all" || selectedCity !== "all") && (
              <button
                onClick={() => {
                  setSelectedCountry("all");
                  setSelectedDistrict("all");
                  setSelectedCity("all");
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm"
              >
                Clear Location
              </button>
            )}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentData.length > 0 ? (
              currentData.map((item, index) => (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-green-50 via-green-100 to-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer"
                  onClick={() => navigate(`/trending/${item.name}`)}
                >
                  {/* Image */}
                  <div className="relative">
                    {(() => {
                      const images =
                        item.otherimages && item.otherimages.length
                          ? [
                              item.mainImage || item.image,
                              ...item.otherimages,
                            ].filter(Boolean)
                          : [
                              item.mainImage || item.image,
                              item.image1,
                              item.image2,
                              item.image3,
                              item.image4,
                            ].filter(Boolean);
                      return (
                        <>
                          <img
                            src={images[0]}
                            alt={item.name}
                            className="w-full h-48 sm:h-64 object-cover rounded-t-3xl group-hover:scale-110 transition-transform duration-500"
                          />

                          {/* Overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-500 rounded-t-3xl"></div>

                          {images.length > 5 && (
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/trending/${item.name}/gallery`);
                              }}
                              className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-semibold cursor-pointer"
                            >
                              +{images.length - 5}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </div>

                  {/* Content */}
                  <div className="p-5 flex flex-col gap-3">
                    {/* Name and Price */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {item.name}
                      </h3>
                      <div className="text-green-600 font-bold text-lg">
                        Rs. {item.price ? item.price.toLocaleString() : "N/A"}
                      </div>
                    </div>

                    {/* Short description */}
                    <p className="hidden sm:block text-gray-600 text-sm">
                      {item.description.length > 100
                        ? item.description.substring(0, 100) + "..."
                        : item.description}
                    </p>

                    {/* Country Display */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <FaGlobe className="text-green-500" />
                      <span>{item.country || "Sri Lanka"}</span>
                      {item.district && (
                        <span className="text-gray-400">• {item.district}</span>
                      )}
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => navigate(`/trending/${item.name}`)}
                      className="mt-2 w-full bg-green-500 text-white py-2 rounded-xl text-sm font-medium hover:bg-green-600 transition flex items-center justify-center gap-2 transform hover:scale-105"
                    >
                      View Details <AiOutlineArrowRight />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                <p className="text-lg">No listings match your filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && totalPages > 1 && (
        <div className="flex flex-row justify-center items-center mt-8 gap-3">
          <button
            onClick={() => setpagination((p) => Math.max(p - 1, 1))}
            disabled={pagination === 1}
            className={`text-xl transition ${
              pagination === 1
                ? "text-gray-400 "
                : " text-white hover:bg-green-700"
            }`}
          >
            <IoIosArrowBack />
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setpagination(page)}
                className={`px-3 py-1 rounded-lg transition ${
                  pagination === page
                    ? "bg-green-600 text-white"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => setpagination((p) => Math.min(p + 1, totalPages))}
            disabled={pagination === totalPages}
            className={`text-2xl transition ${
              pagination === totalPages ? "text-gray-400" : " text-white "
            }`}
          >
            <MdNavigateNext />
          </button>
        </div>
      )}
    </section>
  );
};

export default Villa;
