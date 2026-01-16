import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { BACKEND_URL } from "../../../App";
import "react-toastify/dist/ReactToastify.css";

const Stays = ({ token }) => {
  const storedToken =
    token ||
    localStorage.getItem("vendorToken") ||
    localStorage.getItem("adminToken");

  const getEmailFromToken = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1])).email;
    } catch {
      return null;
    }
  };

  const vendorEmail = storedToken ? getEmailFromToken(storedToken) : null;

  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  const initialFormData = {
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
    ownerEmail: vendorEmail || "",
    videoUrl: "",
    availableThings: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [media, setMedia] = useState({
    mainImage: null,
    image: null,
    image1: null,
    image2: null,
    image3: null,
    image4: null,
    otherimages: [],
  });

  /* ================= FETCH EXISTING PROFILE ================= */
  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    if (!vendorEmail) return;
    setLoading(true);
    try {
      const res = await axios.get(
        `${BACKEND_URL}/api/trending/profile?ownerEmail=${vendorEmail}`,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      if (res.data && res.data._id) {
        setHasProfile(true);
        setSelectedId(res.data._id);

        setFormData({
          ...res.data,
          availableThings: (res.data.availableThings || []).join(", "),
        });
      } else {
        setHasProfile(false);
        setSelectedId(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      }
    } catch (err) {
      // if profile not found, ensure state reflects no profile
      if (err.response?.status === 404) {
        setHasProfile(false);
        setSelectedId(null);
        setFormData({ ...initialFormData, ownerEmail: vendorEmail || "" });
      } else {
        console.log(err.response?.data || err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLE INPUTS ================= */
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSingleFile = (e, field) => {
    setMedia({ ...media, [field]: e.target.files[0] });
  };

  const handleOtherImages = (e) => {
    setMedia({ ...media, otherimages: Array.from(e.target.files || []) });
  };

  /* ================= SUBMIT (CREATE OR UPDATE) ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!media.mainImage && !hasProfile) {
      toast.error("Main image is required");
      return;
    }

    const fd = new FormData();

    // append text fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "availableThings") {
        (value ? value.split(",").map((i) => i.trim()) : []).forEach((v) =>
          fd.append(key, v)
        );
      } else {
        fd.append(key, value);
      }
    });

    // append main image if exists
    if (media.mainImage) fd.append("mainImage", media.mainImage);

    // append other single images
    ["image", "image1", "image2", "image3", "image4"].forEach((field) => {
      if (media[field]) fd.append(field, media[field]);
    });

    // append other images
    media.otherimages?.forEach((file) => fd.append("otherimages", file));

    try {
      let res;
      if (hasProfile && selectedId) {
        // update existing profile
        res = await axios.put(
          `${BACKEND_URL}/api/trending/update/${selectedId}`,
          fd,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );
      } else {
        // create new profile
        res = await axios.post(`${BACKEND_URL}/api/trending/add`, fd, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
      }

      if (res.data.success) {
        toast.success(hasProfile ? "Profile updated" : "Trending item added");

        // refresh profile after creation or update
        await fetchProfile();

        // reset if created
        if (!hasProfile) {
          setFormData(initialFormData);
          setMedia({
            mainImage: null,
            image: null,
            image1: null,
            image2: null,
            image3: null,
            image4: null,
            otherimages: [],
          });
          document
            .querySelectorAll('input[type="file"]')
            .forEach((i) => (i.value = ""));
        }
      } else {
        toast.error("Operation failed");
      }
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  /* ================= UI ================= */
  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">
        {hasProfile ? "Edit Stay Profile" : "Add Trending Item"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {Object.keys(formData)
          .filter(
            (key) =>
              ![
                "_id",
                "createdAt",
                "updatedAt",
                "mainImage",
                "image",
                "image1",
                "image2",
                "image3",
                "image4",
                "otherimages",
              ].includes(key)
          )
          .map((key) => (
            <div key={key}>
              <label className="block mb-1 capitalize">
                {key.replace(/([A-Z])/g, " $1")}
              </label>

              {["description", "highlights"].includes(key) ? (
                <textarea
                  name={key}
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="w-full border p-2 rounded"
                />
              ) : key === "category" ? (
                <select
                  name={key}
                  value={formData[key]}
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
                  value={formData[key]}
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
                  value={formData[key]}
                  onChange={handleInputChange}
                  className="border p-2 w-full"
                />
              )}
            </div>
          ))}

        {/* MAIN IMAGE */}
        <div>
          <label className="font-semibold mr-4">Main Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleSingleFile(e, "mainImage")}
            required={!hasProfile}
          />
        </div>

        {/* IMAGE 1–5 */}
        {["image", "image1", "image2", "image3", "image4"].map((f, i) => (
          <div key={f}>
            <label>Image {i + 1}</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleSingleFile(e, f)}
            />
          </div>
        ))}

        {/* OTHER IMAGES */}
        <div>
          <label>Other Images</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleOtherImages}
          />
        </div>

        <button className="bg-blue-600 text-white py-2 rounded">
          {hasProfile ? "Save Changes" : "Add Trending"}
        </button>
      </form>

      <ToastContainer position="top-center" />
    </div>
  );
};

export default Stays;
