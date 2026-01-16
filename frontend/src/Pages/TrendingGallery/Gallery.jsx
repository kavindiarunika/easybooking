import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Gallery = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL || "http://localhost:4000"
          }/api/trending/trenddata`
        );
        const data = Array.isArray(res.data) ? res.data : [];
        const item = data.find((i) => i.name === name);
        if (!item) {
          return;
        }
        const imgs =
          item.otherimages && item.otherimages.length
            ? item.otherimages
            : [
                item.mainImage || item.image,
                item.image1,
                item.image2,
                item.image3,
                item.image4,
                item.image5,
                item.image6,
              ].filter(Boolean);
        setImages(imgs);
        setTitle(item.name || "Gallery");
      } catch (err) {
        console.error(err);
      }
    };
    fetchItem();
  }, [name]);

  if (!images || images.length === 0) {
    return <div className="p-8">No images available.</div>;
  }

  return (
    <section className="p-6">
      <button className="mb-4 text-blue-600" onClick={() => navigate(-1)}>
        Back
      </button>
      <h2 className="text-2xl font-bold mb-4">{title} - Gallery</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, idx) => (
          <div key={idx} className="rounded overflow-hidden shadow">
            <img
              src={src}
              alt={`${title}-${idx}`}
              className="w-full h-64 object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;
