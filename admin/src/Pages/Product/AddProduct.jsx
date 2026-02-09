import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { FaPlus, FaTrash } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

const AddProduct = () => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const [addmore, setaddmore] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    size: "",
    whatsapp: "",
    email: "",
    ownerEmail: "",
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

    if (!media.mainImage) {
      toast.error("Main image is required");
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
    formDataToSend.append(
      "ownerEmail",
      formData.ownerEmail || "admin@easybooking.com",
    );

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
      const response = await axios.post(
        `${backendUrl}/api/product/add`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      toast.success("Product added successfully");
      resetForm();
      navigate("/product");
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error(error.response?.data?.message || "Error saving product");
    } finally {
      setUploading(false);
    }
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

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      size: "",
      whatsapp: "",
      email: "",
      ownerEmail: "",
      subProducts: [],
    });
    setaddmore(false);
    setMedia({ mainImage: null, subImages: {} });
  };

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <IoArrowBackOutline size={26} />
          Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Add New Product</h1>
      </div>

      {/* Add Product Form */}
      <div className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Price (RS) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* Size (Conditional) */}
          {formData.category === "Clothing & Textiles" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Size</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-semibold mb-2">WhatsApp</label>
            <input
              type="tel"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Owner Email */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Owner Email
            </label>
            <input
              type="email"
              name="ownerEmail"
              value={formData.ownerEmail}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="admin@easybooking.com"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Main Image *
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border border-gray-300 rounded p-3"
            />
          </div>

          {/* Sub-products Button */}
          <button
            type="button"
            onClick={() => setaddmore(!addmore)}
            className="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded font-semibold"
          >
            {addmore ? "Hide Sub-Products" : "Add Sub-Products"}
          </button>

          {/* Sub-products Section */}
          {addmore && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Sub-Products</h3>
              {formData.subProducts.map((sub, index) => (
                <div
                  key={index}
                  className="border p-4 mb-4 rounded bg-gray-50 relative"
                >
                  <button
                    type="button"
                    onClick={() => handleRemoveSubProduct(index)}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm flex items-center gap-1"
                  >
                    <FaTrash size={12} /> Remove
                  </button>

                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Sub Product Name"
                      value={sub.subName || ""}
                      onChange={(e) =>
                        handleSubProductChange(index, "subName", e.target.value)
                      }
                      className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

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
                    className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Size"
                    value={sub.subsize || ""}
                    onChange={(e) =>
                      handleSubProductChange(index, "subsize", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <label className="block text-sm font-semibold mb-2">
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
                      <p className="text-sm text-green-600">✓ Image selected</p>
                    )}
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={handleAddSubProduct}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold flex items-center gap-2"
              >
                <FaPlus /> Add Sub Product
              </button>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded font-semibold disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Add Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default AddProduct;
