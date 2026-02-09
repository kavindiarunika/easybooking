import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { backendUrl } from "../../App";
import "react-toastify/dist/ReactToastify.css";
import { FaTrash, FaImage } from "react-icons/fa";
import { IoArrowBackOutline } from "react-icons/io5";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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
    mainImagePreview: null,
    otherImages: [],
    otherImagePreviews: [],
    subImages: {},
    subImagePreviews: {},
    subOtherImages: {},
    subOtherImagePreviews: {},
  });
  const [addMoreSubProducts, setAddMoreSubProducts] = useState(false);
  const mainImageRef = React.useRef(null);
  const subImageRefs = React.useRef({});

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/product/details/${id}`,
      );
      const product = response.data.data;

      setFormData({
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        category: product.category || "",
        size: product.size || "",
        whatsapp: product.whatsapp || "",
        email: product.email || "",
        ownerEmail: product.ownerEmail || "",
        colors: product.colors || [],
        subProducts: product.subProducts || [],
      });

      setMedia({
        mainImage: null,
        mainImagePreview: product.mainImage || null,
        otherImages: [],
        otherImagePreviews: product.OtherImages || [],
        subImages: {},
        subImagePreviews: (product.subProducts || []).reduce(
          (acc, sub, idx) => {
            if (sub.subImage) {
              acc[idx] = sub.subImage;
            }
            return acc;
          },
          {},
        ),
        subOtherImages: {},
        subOtherImagePreviews: (product.subProducts || []).reduce(
          (acc, sub, idx) => {
            if (sub.subOtherImages && sub.subOtherImages.length > 0) {
              acc[idx] = sub.subOtherImages;
            }
            return acc;
          },
          {},
        ),
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to load product");
      setTimeout(() => navigate(-1), 2000);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMainImageChange = (file) => {
    if (file) {
      setMedia((prev) => ({
        ...prev,
        mainImage: file,
        mainImagePreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleOtherImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setMedia((prev) => ({
      ...prev,
      otherImages: [...(prev.otherImages || []), ...files],
      otherImagePreviews: [
        ...(prev.otherImagePreviews || []),
        ...files.map((f) => URL.createObjectURL(f)),
      ],
    }));
  };

  const removeOtherImage = (index, isNewFile = true) => {
    setMedia((prev) => ({
      ...prev,
      otherImages: isNewFile
        ? prev.otherImages.filter((_, i) => i !== index)
        : prev.otherImages,
      otherImagePreviews: prev.otherImagePreviews.filter((_, i) => i !== index),
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
      subOtherImagePreviews: {
        ...prev.subOtherImagePreviews,
        [subIndex]: [
          ...(prev.subOtherImagePreviews?.[subIndex] || []),
          ...fileList.map((f) => URL.createObjectURL(f)),
        ],
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
      subOtherImagePreviews: {
        ...prev.subOtherImagePreviews,
        [subIndex]: prev.subOtherImagePreviews[subIndex].filter(
          (_, i) => i !== imgIndex,
        ),
      },
    }));
  };

  const handleSubProductChange = (index, field, value) => {
    setFormData((prev) => {
      const subProducts = [...prev.subProducts];
      subProducts[index] = {
        ...subProducts[index],
        [field]: value,
      };
      return { ...prev, subProducts };
    });
  };

  const handleSubProductImageChange = (index, file) => {
    if (file) {
      setMedia((prev) => ({
        ...prev,
        subImages: { ...prev.subImages, [index]: file },
        subImagePreviews: {
          ...prev.subImagePreviews,
          [index]: URL.createObjectURL(file),
        },
      }));

      setFormData((prev) => {
        const subProducts = [...prev.subProducts];
        subProducts[index] = {
          ...subProducts[index],
          subImageFile: file,
        };
        return { ...prev, subProducts };
      });
    }
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
          subImage: "",
          subImageFile: null,
        },
      ],
    }));
  };

  const handleRemoveSubProduct = (index) => {
    setFormData((prev) => ({
      ...prev,
      subProducts: prev.subProducts.filter((_, i) => i !== index),
    }));

    setMedia((prev) => {
      const newSubImages = { ...prev.subImages };
      const newSubImagePreviews = { ...prev.subImagePreviews };
      delete newSubImages[index];
      delete newSubImagePreviews[index];
      return {
        ...prev,
        subImages: newSubImages,
        subImagePreviews: newSubImagePreviews,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.price) {
      toast.error("Price is required");
      return;
    }
    if (!formData.category) {
      toast.error("Category is required");
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("size", formData.size || "");
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("ownerEmail", formData.ownerEmail);

      // Add colors
      if (formData.colors && formData.colors.length > 0) {
        formDataToSend.append("colors", JSON.stringify(formData.colors));
      }

      // Prepare sub-products
      const cleanedSubProducts = formData.subProducts.map((sub) => ({
        subName: sub.subName || "",
        subDescription: sub.subDescription || "",
        subPrice: sub.subPrice || "",
        subsize: sub.subsize || "",
        subImage: sub.subImage || "",
      }));

      formDataToSend.append("subProducts", JSON.stringify(cleanedSubProducts));

      // Add main image if changed
      if (media.mainImage) {
        formDataToSend.append("mainImage", media.mainImage);
      }

      // Add other images
      if (media.otherImages && media.otherImages.length > 0) {
        media.otherImages.forEach((img) => {
          formDataToSend.append("OtherImages", img);
        });
      }

      // Add sub-product images
      formData.subProducts.forEach((sub, index) => {
        const file = sub?.subImageFile || media.subImages?.[index];
        if (file && file instanceof File) {
          formDataToSend.append(`subImage${index}`, file);
        }

        // Add sub-product other images
        if (media.subOtherImages?.[index]) {
          media.subOtherImages[index].forEach((img, imgIdx) => {
            formDataToSend.append(`subOtherImage${index}_${imgIdx}`, img);
          });
        }
      });

      await axios.put(
        `${BACKEND_URL}/api/product/update/${id}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Product updated successfully!");
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <IoArrowBackOutline size={26} />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-8 space-y-6"
        >
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
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-2">Price *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
              required
            />
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
              <option value="Hotels">Hotels</option>
              <option value="Safari">Safari</option>
              <option value="Traveling Places">Traveling Places</option>
              <option value="Vehicles">Vehicles</option>
              <option value="Clothing & Textiles">Clothing & Textiles</option>
            </select>
          </div>

          {/* Size - Conditional */}
          {formData.category === "Clothing & Textiles" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Size</label>
              <input
                type="text"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., S, M, L, XL or 30, 32, 34"
              />
            </div>
          )}

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                WhatsApp Number
              </label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter WhatsApp number"
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
                placeholder="Enter email"
              />
            </div>
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
                placeholder="Enter owner email"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product description"
            />
          </div>

          {/* Main Image */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Main Product Image
            </label>
            <div className="flex gap-4">
              {media.mainImagePreview && (
                <div className="relative">
                  <img
                    src={media.mainImagePreview}
                    alt="Main Preview"
                    className="h-32 w-32 object-cover rounded border-2 border-gray-300"
                  />
                  {media.mainImage && (
                    <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      New
                    </div>
                  )}
                </div>
              )}
              <button
                type="button"
                onClick={() => mainImageRef.current?.click()}
                className="flex items-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                <FaImage /> Choose Image
              </button>
              <input
                ref={mainImageRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleMainImageChange(e.target.files?.[0])}
                className="hidden"
              />
            </div>
          </div>

          {/* Sub-Products Section */}
          <div className="border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Sub-Products (Variants)</h3>
              <button
                type="button"
                onClick={() => setAddMoreSubProducts(!addMoreSubProducts)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
              >
                {addMoreSubProducts
                  ? "Hide Sub-Products"
                  : "Add/Edit Sub-Products"}
              </button>
            </div>

            {addMoreSubProducts && (
              <div className="space-y-6">
                {formData.subProducts.map((subProduct, index) => (
                  <div
                    key={index}
                    className="border border-gray-300 rounded p-4 bg-gray-50 relative"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveSubProduct(index)}
                      className="absolute top-4 right-4 p-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      <FaTrash size={14} />
                    </button>

                    <h4 className="font-semibold mb-4">
                      Sub-Product {index + 1}
                    </h4>

                    {/* Sub-Product Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={subProduct.subName || ""}
                          onChange={(e) =>
                            handleSubProductChange(
                              index,
                              "subName",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Sub-product name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Price
                        </label>
                        <input
                          type="number"
                          value={subProduct.subPrice || ""}
                          onChange={(e) =>
                            handleSubProductChange(
                              index,
                              "subPrice",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Sub-product price"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Size
                        </label>
                        <input
                          type="text"
                          value={subProduct.subsize || ""}
                          onChange={(e) =>
                            handleSubProductChange(
                              index,
                              "subsize",
                              e.target.value,
                            )
                          }
                          className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., S, M, L"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Image
                        </label>
                        <button
                          type="button"
                          onClick={() => subImageRefs.current[index]?.click()}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
                        >
                          <FaImage /> Choose Image
                        </button>
                        <input
                          ref={(el) => {
                            if (el) subImageRefs.current[index] = el;
                          }}
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleSubProductImageChange(
                              index,
                              e.target.files?.[0],
                            )
                          }
                          className="hidden"
                        />
                        {media.subImagePreviews[index] && (
                          <img
                            src={media.subImagePreviews[index]}
                            alt={`Sub ${index + 1}`}
                            className="mt-2 h-24 w-24 rounded object-cover border-2 border-gray-300"
                          />
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Description
                      </label>
                      <textarea
                        value={subProduct.subDescription || ""}
                        onChange={(e) =>
                          handleSubProductChange(
                            index,
                            "subDescription",
                            e.target.value,
                          )
                        }
                        rows="2"
                        className="w-full border border-gray-300 rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Sub-product description"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddSubProduct}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
                >
                  + Add Sub Product
                </button>
              </div>
            )}

            {!addMoreSubProducts && formData.subProducts.length > 0 && (
              <p className="text-sm text-gray-600">
                {formData.subProducts.length} sub-product(s) configured
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 rounded font-semibold text-white transition ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {submitting ? "Updating..." : "Update Product"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded font-semibold transition"
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

export default EditProduct;
