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
      district: it.district || "",
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
              {Object.keys(form).map((k) => (
                <div key={k}>
                  <label className="block text-sm capitalize">{k}</label>
                  {k === "description" || k === "highlights" ? (
                    <textarea
                      name={k}
                      value={form[k]}
                      onChange={handleInput}
                      className="border w-full p-2 rounded"
                    />
                  ) : (
                    <input
                      name={k}
                      value={form[k]}
                      onChange={handleInput}
                      className="border w-full p-2 rounded"
                    />
                  )}
                </div>
              ))}

              {/* IMAGE INPUTS */}
              {/* Main image (card image) */}
              <label className="mr-4 text-black">Main Image (card image)</label>
              <input
                type="file"
                name="mainImage"
                onChange={(e) => handleSingleFile(e, "mainImage")}
              />

              {/* Image 1 – Image 4 (additional side images) */}
              {["image1", "image2", "image3", "image4"].map((field) => (
                <div key={field}>
                  <label className="mr-4 text-black">{field}</label>
                  <input
                    type="file"
                    name={field}
                    onChange={(e) => handleSingleFile(e, field)}
                  />
                </div>
              ))}

              {/* Other images */}
              <label className="mr-4 text-black">Other Images</label>
              <input
                type="file"
                name="otherimages"
                multiple
                onChange={handleOtherImages}
              />

              <div className="flex gap-3">
                <button className="bg-green-600 text-white px-4 py-2 rounded">
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-300 px-4 py-2 rounded"
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
