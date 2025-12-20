import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const EditTrending = ({ token }) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]); // for search results
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({});
  const [mainImage, setMainImage] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/trending/trenddata`);
      const list = res.data || [];
      setItems(list);
      setFilteredItems(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch trending items");
    } finally {
      setLoading(false);
    }
  };

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
    setMainImage(null);
    setImages([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleMainFile = (e) => {
    setMainImage(e.target.files[0] || null);
  };

  const handleImagesFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setImages(files);
  };

  const runSearch = () => {
    const q = (searchQuery || "").trim().toLowerCase();
    if (!q) {
      setFilteredItems(items);
      return;
    }
    const results = items.filter((it) => {
      const name = (it.name || "").toLowerCase();
      const district = (it.district || "").toLowerCase();
      const address = (it.address || "").toLowerCase();
      const owner = (it.ownerEmail || "").toLowerCase();
      const desc = (it.description || "").toLowerCase();

      // match if any field includes the query (works for single-letter queries)
      return (
        name.includes(q) ||
        district.includes(q) ||
        address.includes(q) ||
        owner.includes(q) ||
        desc.includes(q)
      );
    });
    setFilteredItems(results);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setFilteredItems(items);
  };

  // Debounced live search: filter as the user types (250ms)
  React.useEffect(() => {
    const handle = setTimeout(() => runSearch(), 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, items]);

  const cancelEdit = () => {
    setSelected(null);
    setForm({});
    setMainImage(null);
    setImages([]);
  };

  const submitUpdate = async (e) => {
    e.preventDefault();

    if (!selected) return;

    const fd = new FormData();

    // Append text fields
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("rating", form.rating);
    fd.append("district", form.district);
    fd.append("price", form.price);
    fd.append("location", form.location);
    fd.append("highlights", form.highlights);
    fd.append("address", form.address);
    fd.append("contact", form.contact);
    fd.append("ownerEmail", form.ownerEmail);
    fd.append("videoUrl", form.videoUrl || "");
    fd.append("availableThings", form.availableThings || "");
    fd.append("count", form.count ?? 0);

    // Append files if provided
    if (mainImage) fd.append("mainImage", mainImage);
    if (images && images.length > 0)
      images.forEach((f) => fd.append("images", f));

    try {
      const res = await axios.put(
        `${backendUrl}/api/trending/update/${selected}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data && res.data.success) {
        toast.success("Trending item updated");
        // Refresh list (or update single item in place)
        setItems((prev) =>
          prev.map((it) => (it._id === selected ? res.data.data : it))
        );
        cancelEdit();
      } else {
        toast.error(res.data?.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating item");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Edit Trending Items</h2>

      <div className="flex gap-6">
        <div className="w-1/3 space-y-3">
          <div className="flex gap-2 items-center mb-2">
            <input
              type="text"
              placeholder="Search by name, district, address, owner email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              className="border rounded px-2 py-1 w-full"
            />
            <button
              onClick={runSearch}
              className="bg-blue-600 text-white px-3 py-1 rounded"
            >
              Search
            </button>
            <button
              onClick={clearSearch}
              className="bg-gray-200 px-3 py-1 rounded"
            >
              Clear
            </button>
          </div>

          {loading && <p>Loading...</p>}
          {filteredItems.length === 0 && !loading && <p>No items found.</p>}

          {filteredItems.map((it) => (
            <div
              key={it._id}
              className="border p-3 rounded flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">{it.name}</p>
                  <p className="text-sm text-gray-500">{it.district}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => selectItem(it)}
                    className="px-2 py-1 bg-yellow-400 rounded"
                  >
                    Edit
                  </button>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Count: {it.count ?? 0}
              </div>
            </div>
          ))}
        </div>

        <div className="w-2/3">
          {!selected ? (
            <p className="text-gray-600">Select an item to edit its details.</p>
          ) : (
            <form onSubmit={submitUpdate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">Name</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    className="border rounded w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleInput}
                    className="border rounded w-full px-2 py-1"
                  >
                    <option value="restaurant">restaurant</option>
                    <option value="villa">villa</option>
                    <option value="hotel">hotel</option>
                    <option value="house">house</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium">District</label>
                  <input
                    name="district"
                    value={form.district}
                    onChange={handleInput}
                    className="border rounded w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Price</label>
                  <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleInput}
                    className="border rounded w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Rating</label>
                  <input
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={form.rating}
                    onChange={handleInput}
                    className="border rounded w-full px-2 py-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Count</label>
                  <input
                    name="count"
                    type="number"
                    min="0"
                    value={form.count}
                    onChange={handleInput}
                    className="border rounded w-full px-2 py-1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleInput}
                  className="border rounded w-full px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Contact</label>
                <input
                  name="contact"
                  value={form.contact}
                  onChange={handleInput}
                  className="border rounded w-full px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Owner Email</label>
                <input
                  name="ownerEmail"
                  value={form.ownerEmail}
                  onChange={handleInput}
                  className="border rounded w-full px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Video URL</label>
                <input
                  name="videoUrl"
                  value={form.videoUrl}
                  onChange={handleInput}
                  className="border rounded w-full px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">
                  Available Things (comma separated)
                </label>
                <input
                  name="availableThings"
                  value={form.availableThings}
                  onChange={handleInput}
                  className="border rounded w-full px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Highlights</label>
                <textarea
                  name="highlights"
                  value={form.highlights}
                  onChange={handleInput}
                  className="border rounded w-full px-2 py-1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleInput}
                  className="border rounded w-full px-2 py-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">
                    Main Image (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainFile}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">
                    Additional Images (optional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImagesFiles}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded"
                  type="submit"
                >
                  Save Changes
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
