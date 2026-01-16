import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import VendorRegister from "../../components/VendorRegister";
import { useLocation } from "react-router-dom";

const AddTrending = ({ token }) => {
  // ---------------- TEXT FIELDS ----------------
  const [formDataFields, setFormDataFields] = useState({
    name: "",
    description: "",
    category: "villa",
    rating: "5",
    district: "",
    price: "",
    location: "",
    highlights: "",
    address: "",
    contact: "",
    ownerEmail: "",
    videoUrl: "",
    availableThings: "",
  });
  const [register, setregister] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const ownerEmail = location?.state?.ownerEmail;
    if (ownerEmail) {
      setregister(true);
      setFormDataFields((prev) => ({ ...prev, ownerEmail }));
    }
  }, [location]);

  // ---------------- MEDIA ----------------
  const [media, setMedia] = useState({
    mainImage: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,

    otherimages: [],
  });

  // ---------------- HANDLERS ----------------
  const handleInputChange = (e) => {
    setFormDataFields({
      ...formDataFields,
      [e.target.name]: e.target.value,
    });
  };

  const handleSingleFile = (e, field) => {
    setMedia({ ...media, [field]: e.target.files[0] });
  };

  const handleOtherImages = (e) => {
    setMedia({ ...media, otherimages: Array.from(e.target.files || []) });
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage) {
      toast.error("Main image is required");
      return;
    }

    const formData = new FormData();

    // text fields
    Object.entries(formDataFields).forEach(([key, value]) => {
      if (key === "availableThings") {
        formData.append(
          key,
          value ? value.split(",").map((i) => i.trim()) : []
        );
      } else {
        formData.append(key, value);
      }
    });

    // images (ORDER IS IMPORTANT)
    // mainImage acts as the card/primary image
    formData.append("mainImage", media.mainImage);

    const imageFields = ["image1", "image2", "image3", "image4", "image"];

    imageFields.forEach((field) => {
      if (media[field]) {
        formData.append(field, media[field]);
      }
    });

    if (media.otherimages.length > 0) {
      media.otherimages.forEach((file) => {
        formData.append("otherimages", file);
      });
    }

    try {
      const res = await axios.post(`${backendUrl}/api/trending/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        toast.success("Trending item added successfully");

        // reset
        setFormDataFields({
          name: "",
          description: "",
          category: "villa",
          rating: "5",
          district: "",
          price: "",
          location: "",
          highlights: "",
          address: "",
          contact: "",
          ownerEmail: "",
          videoUrl: "",
          availableThings: "",
        });

        setMedia({
          mainImage: null,
          image: null,
          image1: null,
          image2: null,
          image3: null,
          image4: null,

          otherimages: [],
        });

        document.querySelectorAll('input[type="file"]').forEach((i) => {
          i.value = "";
        });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  // ---------------- UI ----------------
  return register ? (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Add Trending Item</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {Object.keys(formDataFields).map((key) => (
          <div key={key}>
            <label className="block mb-1 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </label>

            {key === "category" ? (
              <select
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="border p-2 w-full"
              >
                <option value="villa">Villa</option>
                <option value="hotel">Hotel</option>
                <option value="restaurant">Restaurant</option>
                <option value="house">House</option>
              </select>
            ) : key === "rating" ? (
              <select
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="border p-2 w-full"
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} Star
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={key === "ownerEmail" ? "email" : "text"}
                name={key}
                value={formDataFields[key]}
                onChange={handleInputChange}
                className="border p-2 w-full"
              />
            )}
          </div>
        ))}

        {/* MAIN IMAGE */}
        <div>
          <label className="font-semibold mr-4">
            Main Image (big display; used as card image when provided)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSingleFile(e, "mainImage")}
            required
          />
        </div>

        {/* IMAGE 1–6 */}
        {["image", "image1", "image2", "image3", "image4"].map((f, i) => (
          <div key={f}>
            <label className="mr-4 ">Image {i + 1}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSingleFile(e, f)}
            />
          </div>
        ))}

        {/* OTHER IMAGES */}
        <div>
          <label className="mr-4">Other Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleOtherImages}
          />
        </div>

        <button className="bg-blue-600 text-white py-2 rounded">
          Add Trending
        </button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  ) : (
    <div className="p-6 bg-white rounded-lg shadow">
      <VendorRegister categorytype={"stays"} token={token} />
    </div>
  );
};

export default AddTrending;
