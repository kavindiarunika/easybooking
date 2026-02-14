import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import {
  FaBox,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSignOutAlt,
  FaStar,
  FaImage,
} from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

const ProductDashboard = () => {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("vendorToken");

  const getVendorInfo = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  const vendorInfo = storedToken ? getVendorInfo(storedToken) : null;
  const vendorEmail = vendorInfo?.email;

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    averageRating: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [addmore, setaddmore] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    size: "",
    whatsapp: "+94",
    email: vendorEmail || "",
    colors: [],
    subProducts: [],
  });

  const [media, setMedia] = useState({
    mainImage: null,
    otherImages: [],
    subImages: {},
    subOtherImages: {},
  });

  const subImageRefs = useRef({});

  useEffect(() => {
    if (!storedToken) {
      toast.error("Please login first");
      navigate("/product");
    }
  }, [storedToken, navigate]);

  useEffect(() => {
    if (vendorEmail) {
      fetchProducts();
      fetchStats();
    }
  }, [vendorEmail]);

  const fetchProducts = async () => {
    if (!vendorEmail) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/product/vendor/products`,
        {
          params: { ownerEmail: vendorEmail },
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      );
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!vendorEmail) return;
    try {
      const response = await axios.get(
        `${BACKEND_URL}/api/product/vendor/stats`,
        {
          params: { ownerEmail: vendorEmail },
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      );
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setMedia({ ...media, mainImage: e.target.files[0] });
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia((prev) => ({
      ...prev,
      otherImages: [...(prev.otherImages || []), ...files],
    }));
  };

  const removeOtherImage = (index) => {
    setMedia((prev) => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, i) => i !== index),
    }));
  };

  const handleColorsChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      colors: value
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    }));
  };

  const handleSubProductOtherImagesChange = (subIndex, files) => {
    const fileList = Array.from(files);
    setMedia((prev) => ({
      ...prev,
      subOtherImages: {
        ...prev.subOtherImages,
        [subIndex]: [...(prev.subOtherImages?.[subIndex] || []), ...fileList],
      },
    }));
  };

  const handleInputChanges = (e) => {
    const { name, value } = e.target;

    if (name === "whatsapp") {
      // Always keep +94 at beginning
      let newValue = value;
      if (!newValue.startsWith("+94")) {
        newValue = "+94" + newValue.replace("+94", "");
      }

      setFormData({ ...formData, [name]: newValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const removeSubOtherImage = (subIndex, imgIndex) => {
    setMedia((prev) => ({
      ...prev,
      subOtherImages: {
        ...prev.subOtherImages,
        [subIndex]: prev.subOtherImages[subIndex].filter(
          (_, i) => i !== imgIndex,
        ),
      },
    }));
  };

  const handleSubProductImageChange = (index, file) => {
    setMedia((prev) => ({
      ...prev,
      subImages: {
        ...prev.subImages,
        [index]: file,
      },
    }));
    // also attach file reference to the corresponding subProduct state
    setFormData((prev) => {
      const updated = { ...prev };
      const subs = Array.isArray(updated.subProducts)
        ? [...updated.subProducts]
        : [];
      subs[index] = {
        ...(subs[index] || {}),
        subImageFile: file,
      };
      updated.subProducts = subs;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    if (!selectedProduct && !media.mainImage) {
      toast.error("Main image is required");
      return;
    }

    if (!storedToken) {
      toast.error("Not authenticated. Please log in as a vendor.");
      return;
    }

    setUploading(true);
    const formDataToSend = new FormData();

    // Add text fields
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("size", formData.size);
    formDataToSend.append("whatsapp", formData.whatsapp);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("ownerEmail", vendorEmail);

    // Add colors
    if (formData.colors && formData.colors.length > 0) {
      formDataToSend.append("colors", JSON.stringify(formData.colors));
    }
    // Prepare subProducts payload without File objects
    const cleanedSubProducts = (formData.subProducts || []).map((s) => ({
      subName: s.subName || "",
      subDescription: s.subDescription || "",
      subPrice: s.subPrice || "",
      subsize: s.subsize || "",
      email: s.email || "",
      // retain existing image URL if present
      subImage: s.subImage || "",
    }));
    console.log(
      "Submitting subProducts:",
      cleanedSubProducts,
      "media.subImages:",
      media.subImages,
    );
    formDataToSend.append("subProducts", JSON.stringify(cleanedSubProducts));

    // Add main image
    if (media.mainImage) {
      formDataToSend.append("mainImage", media.mainImage);
    }

    // Add other images
    if (media.otherImages && media.otherImages.length > 0) {
      media.otherImages.forEach((img) => {
        formDataToSend.append("OtherImages", img);
      });
    }

    // Add sub-product images with proper naming. Prefer file stored on subProducts entry.
    (formData.subProducts || []).forEach((s, index) => {
      const file = s?.subImageFile || media.subImages?.[index];
      if (file) formDataToSend.append(`subImage${index}`, file);

      // Add sub-product other images
      if (media.subOtherImages?.[index]) {
        media.subOtherImages[index].forEach((img, imgIdx) => {
          formDataToSend.append(`subOtherImage${index}_${imgIdx}`, img);
        });
      }
    });

    try {
      let response;
      if (selectedProduct) {
        response = await axios.put(
          `${BACKEND_URL}/api/product/update/${selectedProduct._id}`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );
        toast.success("Product updated successfully");
      } else {
        response = await axios.post(
          `${BACKEND_URL}/api/product/add`,
          formDataToSend,
          {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          },
        );
        toast.success("Product added successfully");
      }

      await fetchProducts();
      await fetchStats();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      let errorMsg = "Error saving product";
      if (error.response?.status === 401) {
        errorMsg = "Session expired. Please log in again.";
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      toast.error(errorMsg);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      size: product.size,
      whatsapp: product.whatsapp,
      email: product.email,
      colors: product.colors || [],
      // Pre-fill existing subProducts so they are preserved/edited
      subProducts: product.subProducts
        ? product.subProducts.map((s) => ({
            subName: s.subName || "",
            subDescription: s.subDescription || "",
            subPrice: s.subPrice || "",
            subsize: s.subsize || "",
            email: s.email || "",
          }))
        : [],
    });
    // show sub-product UI if product has sub-products
    if (product.subProducts && product.subProducts.length > 0) setaddmore(true);
    setShowForm(true);
  };

  const handleSubProductChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedSubProducts = [...prev.subProducts];

      updatedSubProducts[index] = {
        ...updatedSubProducts[index],
        [field]: value,
      };

      return {
        ...prev,
        subProducts: updatedSubProducts,
        subImage: null,
      };
    });
  };

  const handleAddSubProduct = () => {
    setFormData((prev) => ({
      ...prev,
      subProducts: [
        ...prev.subProducts,
        {
          subName: "",
          subDescription: "",
          subPrice: "",
          subsize: "",
          email: "",
          subImage: null,
        },
      ],
    }));
  };

  const handleRemoveSubProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      subProducts: prev.subProducts.filter((_, i) => i !== index),
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(`${BACKEND_URL}/api/product/delete/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      toast.success("Product deleted successfully");
      await fetchProducts();
      await fetchStats();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.patch(
        `${BACKEND_URL}/api/product/toggle/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        },
      );
      toast.success("Product status updated");
      await fetchProducts();
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Failed to update product status");
    }
  };

  const getColorHex = (colorName) => {
    const colorMap = {
      Red: "#EF4444",
      Blue: "#3B82F6",
      Green: "#10B981",
      Black: "#000000",
      White: "#FFFFFF",
      Purple: "#8B5CF6",
      Yellow: "#FBBF24",
      Pink: "#F472B6",
      Orange: "#F97316",
      Brown: "#A16207",
      "light blue": "#ADD8E6",
      "navy blue": "#000080",
      oracle: "#F80102",
      gold: "#FFD700",
      Gray: "#9CA3AF",
    };
    return colorMap[colorName] || "#cccccc";
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      size: "",
      whatsapp: "",
      email: vendorEmail || "",
      colors: [],
      subProducts: [],
    });
    setMedia({
      mainImage: null,
      otherImages: [],
      subImages: {},
      subOtherImages: {},
    });
    setSelectedProduct(null);
    setShowForm(false);
    setaddmore(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorCategory");
    toast.success("Logged out successfully");
    navigate("/product");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-10">
      {/* Header */}
      <div className="flex flex-row items-center justify-between gap-4 mb-8">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <IoArrowBackOutline size={26} />
          </button>
          <div className="flex items-center gap-3">
            <FaBox className="text-3xl text-blue-400" />
            <h1 className="text-3xl font-bold text-cyan-400">
              Product Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-gray-300">{vendorEmail}</div>
          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            <FaSignOutAlt className="inline mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Add Product Button */}
      <div className="mb-8">
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-semibold"
          >
            <FaPlus /> Add New Product
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-gray-800/50 p-8 rounded-lg mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">
            {selectedProduct ? "Edit Product" : "Add New Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Price (RS)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Select Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              >
                <option value="">Select Category</option>
                <option value="Dry Food & Spices">Dry Food & Spices</option>
                <option value="Traditional Handicrafts & Cultural Items">
                  Traditional Handicrafts & Cultural Items
                </option>
                <option value="Clothing & Textiles">Clothing & Textiles</option>
                <option value="Jewelry & Accessories">
                  Jewelry & Accessories
                </option>
                <option value="Ayurvedic & Natural Products">
                  Ayurvedic & Natural Products
                </option>
                <option value="Souvenirs & Gift Items">
                  Souvenirs & Gift Items
                </option>
                <option value="Home Decor & Art">Home Decor & Art</option>
                <option value="Beverage Products">Beverage Products</option>
              </select>
            </div>

            {formData.category === "Clothing & Textiles" && (
              <div>
                <label className="block text-sm font-semibold mb-2">Size</label>
                <select
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  placeholder="e.g., M, L, XL"
                >
                  <option value="">Select Size</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
            )}

            {(formData.category === "Clothing & Textiles" ||
              formData.category === "Jewelry & Accessories") && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Colors
                </label>
                <div className="flex flex-wrap gap-3">
                  {[
                    { name: "Red", hex: "#EF4444" },
                    { name: "light blue", hex: "#ADD8E6" },
                    { name: "Green", hex: "#10B981" },
                    { name: "Black", hex: "#000000" },
                    { name: "Orange", hex: "#F97316" },
                    { name: "Pink", hex: "#F472B6" },
                    { name: "Purple", hex: "#8B5CF6" },
                    { name: "Yellow", hex: "#FBBF24" },
                    { name: "Brown", hex: "#A16207" },
                    { name: "Gray", hex: "#9CA3AF" },
                    { name: "navy blue", hex: "#000080" },
                    { name: "oracle", hex: "#F80102" },
                    { name: "gold", hex: "#FFD700" },
                    { name: "White", hex: "#FFFFFF", border: true },
                  ].map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => {
                          const colors = prev.colors.includes(color.name)
                            ? prev.colors.filter((c) => c !== color.name)
                            : [...prev.colors, color.name];
                          return { ...prev, colors };
                        });
                      }}
                      className={`flex items-center gap-2 px-3 py-2 rounded border-2 transition ${
                        formData.colors.includes(color.name)
                          ? "border-blue-500 bg-gray-600"
                          : "border-gray-600 bg-gray-700 hover:border-gray-500"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex-shrink-0 ${
                          color.border ? "border-2 border-gray-400" : ""
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      <span className="text-sm text-gray-100 whitespace-nowrap">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {(formData.category === "Dry Food & Spices" ||
              formData.category === "Beverage Products" ||
              formData.category ===
                "Traditional Handicrafts & Cultural Items" ||
              formData.category === "Ayurvedic & Natural Products" ||
              formData.category === "Souvenirs & Gift Items" ||
              formData.category === "Home Decor & Art" ||
              formData.category === "Jewelry & Accessories") && (
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Weight(grams)
                </label>
                <input
                  type="text"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                  placeholder="e.g., 500g, 1kg"
                />
              </div>
            )}

            <div className="flex">
              <span className="bg-gray-600 text-white px-3 flex items-center rounded-l">
                +94
              </span>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-r p-2 text-white"
                placeholder="712345678"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                rows="4"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Main Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Other Images(add less Than 4 images)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleOtherImagesChange}
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => setaddmore(true)}
              className="text-white p-2 botder-white bg-black hover:bg-white hover:text-black"
            >
              Add more Images with prices
            </button>

            {addmore ? (
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-4">Sub Products</h3>
                  {formData.subProducts.map((sub, index) => (
                    <div
                      key={index}
                      className="border p-3 mb-3 rounded bg-gray-800 relative"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveSubProduct(index)}
                        className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm"
                      >
                        Remove
                      </button>

                      <input
                        type="text"
                        placeholder="Sub Product Name"
                        value={sub.subName || ""}
                        onChange={(e) =>
                          handleSubProductChange(
                            index,
                            "subName",
                            e.target.value,
                          )
                        }
                        className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                      />

                      <input
                        type="text"
                        placeholder="Description"
                        value={sub.subDescription || ""}
                        onChange={(e) =>
                          handleSubProductChange(
                            index,
                            "subDescription",
                            e.target.value,
                          )
                        }
                        className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                      />

                      <input
                        type="number"
                        placeholder="Price"
                        value={sub.subPrice || ""}
                        onChange={(e) =>
                          handleSubProductChange(
                            index,
                            "subPrice",
                            e.target.value,
                          )
                        }
                        className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                      />

                      <input
                        type="text"
                        placeholder="Size"
                        value={sub.subsize || ""}
                        onChange={(e) =>
                          handleSubProductChange(
                            index,
                            "subsize",
                            e.target.value,
                          )
                        }
                        className="w-full mb-2 p-2 bg-gray-700 text-white rounded"
                      />

                      <label className="block text-sm font-semibold mb-2 mt-2">
                        Sub Product Image
                      </label>
                      <input
                        ref={(el) => (subImageRefs.current[index] = el)}
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          handleSubProductImageChange(index, e.target.files[0])
                        }
                        className="hidden"
                      />
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => subImageRefs.current[index]?.click()}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded"
                        >
                          Choose Image
                        </button>
                        {media.subImages[index] && (
                          <p className="text-sm text-green-400 mb-2">
                            ✓ Image selected
                          </p>
                        )}
                      </div>

                      <label className="block text-sm font-semibold mb-2 mt-4">
                        Other Sub Product Images
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) =>
                          handleSubProductOtherImagesChange(
                            index,
                            e.target.files,
                          )
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white"
                      />
                      {media.subOtherImages?.[index] && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-300 mb-2">
                            Selected Images:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {media.subOtherImages[index].map((img, imgIdx) => (
                              <div
                                key={imgIdx}
                                className="relative bg-gray-700 p-2 rounded flex items-center gap-2"
                              >
                                <span className="text-sm text-gray-300">
                                  {img.name || `Image ${imgIdx + 1}`}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeSubOtherImage(index, imgIdx)
                                  }
                                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-xs"
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddSubProduct}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold mb-4"
                >
                  + Add Sub Product
                </button>
              </div>
            ) : (
              <></>
            )}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold disabled:opacity-50"
              >
                {uploading
                  ? "Uploading..."
                  : selectedProduct
                    ? "Update Product"
                    : "Add Product"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-4 text-left">Product Name</th>
                <th className="px-6 py-4 text-left">Category</th>
                <th className="px-6 py-4 text-left">Price</th>
                <th className="px-6 py-4 text-left">Colors</th>
                <th className="px-6 py-4 text-left">Rating</th>
                <th className="px-6 py-4 text-left">Status</th>
                <th className="px-6 py-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-t border-gray-700 hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4">{product.name}</td>
                  <td className="px-6 py-4 capitalize">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="font-semibold">Rs. {product.price}</div>
                      {product.colors && product.colors.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {product.colors.map((color, idx) => (
                            <div key={idx} className="flex items-center gap-1">
                              <div
                                className={`w-4 h-4 rounded-full ${color === "White" ? "border border-gray-400" : ""}`}
                                style={{
                                  backgroundColor: getColorHex(color),
                                }}
                              />
                              <span className="text-xs text-gray-300">
                                {color}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {product.rating > 0 ? (
                      <span className="flex items-center gap-1">
                        {product.rating}
                        <FaStar className="text-yellow-400" />
                      </span>
                    ) : (
                      "N/A"
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        product.isActive
                          ? "bg-green-600/30 text-green-300"
                          : "bg-red-600/30 text-red-300"
                      }`}
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-blue-600 hover:bg-blue-700 p-2 rounded"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(product._id)}
                        className="bg-yellow-600 hover:bg-yellow-700 p-2 rounded"
                        title="Toggle Status"
                      >
                        {product.isActive ? <FaEyeSlash /> : <FaEye />}
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-600 hover:bg-red-700 p-2 rounded"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {products.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <FaBox className="text-6xl mx-auto mb-4 opacity-50" />
            <p>No products yet. Start by adding your first product!</p>
          </div>
        )}
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default ProductDashboard;
