import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const EditTrending = ({ token }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});

  // image states (MATCH BACKEND)
  const [media, setMedia] = useState({
    mainImage: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    image5: null,
    image6: null,
    otherimages: [],
  });

  // Location data for cascading dropdowns
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

  const getDistricts = (country) => {
    if (!country || !locationData[country]) return [];
    return Object.keys(locationData[country]);
  };

  const getCities = (country, district) => {
    if (!country || !district || !locationData[country]?.[district]) return [];
    return locationData[country][district];
  };

  // ---------------- FETCH ----------------
  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/trending/trenddata`);
      setItems(res.data || []);
      setFilteredItems(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch trending items");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- SELECT ----------------
  const selectItem = (it) => {
    setSelected(it._id);
    setForm({
      name: it.name || "",
      description: it.description || "",
      category: it.category || "villa",
      rating: it.rating || 5,
      country: it.country || "Sri Lanka",
      district: it.district || "",
      city: it.city || "",
      price: it.price || 0,
      location: it.location || "",
      highlights: it.highlights || "",
      address: it.address || "",
      contact: it.contact || "",
      ownerEmail: it.ownerEmail || "",
      videoUrl: it.videoUrl || "",
      availableThings: (it.availableThings || []).join(", "),
      count: it.count ?? 0,
    });

    setMedia({
      mainImage: null,
      image: null,
      image1: null,
      image2: null,
      image3: null,
      image4: null,
      image5: null,
      image6: null,
      otherimages: [],
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle country change - reset district and city
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setForm((p) => ({ ...p, country, district: "", city: "" }));
  };

  // Handle district change - reset city
  const handleDistrictChange = (e) => {
    const district = e.target.value;
    setForm((p) => ({ ...p, district, city: "" }));
  };

  // ---------------- INPUT ----------------
  const handleInput = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSingleFile = (e, field) => {
    setMedia((m) => ({ ...m, [field]: e.target.files[0] || null }));
  };

  const handleOtherImages = (e) => {
    setMedia((m) => ({
      ...m,
      otherimages: Array.from(e.target.files || []),
    }));
  };

  // ---------------- SEARCH ----------------
  useEffect(() => {
    const t = setTimeout(() => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return setFilteredItems(items);

      setFilteredItems(
        items.filter((it) =>
          [it.name, it.district, it.address, it.ownerEmail, it.description]
            .join(" ")
            .toLowerCase()
            .includes(q)
        )
      );
    }, 250);

    return () => clearTimeout(t);
  }, [searchQuery, items]);

  const cancelEdit = () => {
    setSelected(null);
    setForm({});
  };

  // ---------------- UPDATE ----------------
  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!selected) return;

    const fd = new FormData();

    // text fields
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));

    // images (ORDER MATTERS)
    if (media.mainImage) fd.append("mainImage", media.mainImage);

    const orderedImages = [
      "image",
      "image1",
      "image2",
      "image3",
      "image4",
      "image5",
      "image6",
    ];

    orderedImages.forEach((f) => {
      if (media[f]) fd.append(f, media[f]);
    });

    if (media.otherimages.length > 0) {
      media.otherimages.forEach((file) => fd.append("otherimages", file));
    }

    try {
      const res = await axios.put(
        `${backendUrl}/api/trending/update/${selected}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data?.success) {
        toast.success("Trending item updated");

        setItems((prev) =>
          prev.map((it) => (it._id === selected ? res.data.data : it))
        );

        cancelEdit();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error updating item");
    }
  };

  // ---------------- UI ----------------
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Trending Items</h2>

      <div className="flex gap-6">
        {/* LEFT LIST */}
        <div className="w-1/3 space-y-3">
          <input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border w-full p-2 rounded"
          />

          {loading && <p>Loading...</p>}

          {filteredItems.map((it) => (
            <div key={it._id} className="border p-3 rounded">
              <p className="font-semibold">{it.name}</p>
              <p className="text-sm">{it.district}</p>
              <button
                onClick={() => selectItem(it)}
                className="bg-yellow-400 px-2 py-1 rounded mt-2"
              >
                Edit
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT FORM */}
        <div className="w-2/3">
          {!selected ? (
            <p>Select an item to edit</p>
          ) : (
            <form onSubmit={submitUpdate} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  rows={4}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                >
                  <option value="villa">Villa</option>
                  <option value="hotel">Hotel</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="house">House</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select
                  name="rating"
                  value={form.rating}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star</option>
                  ))}
                </select>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select
                  name="country"
                  value={form.country}
                  onChange={handleCountryChange}
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select Country</option>
                  {Object.keys(locationData).map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div>
                <label className="block text-sm font-medium mb-1">District</label>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleDistrictChange}
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select District</option>
                  {getDistricts(form.country).map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <select
                  name="city"
                  value={form.city}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                >
                  <option value="">Select City</option>
                  {getCities(form.country, form.district).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-1">Location (Google Maps Link)</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium mb-1">Contact</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Owner Email */}
              <div>
                <label className="block text-sm font-medium mb-1">Owner Email</label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={form.ownerEmail}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-sm font-medium mb-1">Highlights</label>
                <textarea
                  name="highlights"
                  value={form.highlights}
                  onChange={handleInput}
                  rows={3}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-sm font-medium mb-1">Video URL</label>
                <input
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleInput}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Available Things */}
              <div>
                <label className="block text-sm font-medium mb-1">Available Things (comma separated)</label>
                <input
                  name="availableThings"
                  value={form.availableThings}
                  onChange={handleInput}
                  placeholder="WiFi, Pool, AC, Parking"
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* IMAGE INPUTS */}
              {/* Main image (card image) */}
              <div>
                <label className="block text-sm font-medium mb-1">Main Image (card image)</label>
                <input
                  type="file"
                  name="mainImage"
                  accept="image/*"
                  onChange={(e) => handleSingleFile(e, "mainImage")}
                  className="border w-full p-2 rounded"
                />
              </div>

              {/* Image 1 – Image 4 (additional side images) */}
              {["image1", "image2", "image3", "image4"].map((field, index) => (
                <div key={field}>
                  <label className="block text-sm font-medium mb-1">Image {index + 1}</label>
                  <input
                    type="file"
                    name={field}
                    accept="image/*"
                    onChange={(e) => handleSingleFile(e, field)}
                    className="border w-full p-2 rounded"
                  />
                </div>
              ))}

              {/* Other images */}
              <div>
                <label className="block text-sm font-medium mb-1">Other Images (Multiple)</label>
                <input
                  type="file"
                  name="otherimages"
                  accept="image/*"
                  multiple
                  onChange={handleOtherImages}
                  className="border w-full p-2 rounded"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTrending;
