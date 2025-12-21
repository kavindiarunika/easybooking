import React, { useEffect, useState } from "react";
import VisitingHero from "./VisitingHero";
import axios from "axios";

const Visitingplaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${backendUrl}/api/travelplaces`);
        setPlaces(res.data.travelPlaces || []);
      } catch (err) {
        console.error("Failed to load travel places", err);
        setError("Failed to load travel places");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Build safe full URL for images (supports absolute URLs and server-relative paths)
  const resolveUrl = (imgPath) => {
    if (!imgPath) return null;
    // If it's already an absolute URL (http/https), return it unchanged
    if (/^https?:\/\//i.test(imgPath)) return imgPath;
    // Ensure backendUrl has no trailing slash and join safely
    const cleanBackend = backendUrl.replace(/\/$/, "");
    return imgPath.startsWith("/")
      ? `${cleanBackend}${imgPath}`
      : `${cleanBackend}/${imgPath}`;
  };

  return (
    <div className="px-4">
      <VisitingHero />

      <section className="max-w-6xl mx-auto py-10">
        <h2 className="text-2xl font-semibold mb-6">Explore Visiting Places</h2>

        {loading && <p>Loading places...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((p) => (
            <article
              key={p._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {p.mainImage ? (
                <img
                  src={resolveUrl(p.mainImage)}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src =
                      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                  }}
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  No image
                </div>
              )}

              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{p.name}</h3>
                <p className="text-sm text-gray-600 mb-2 capitalize">
                  {p.district}
                </p>
                <p className="text-gray-700 mb-3">{p.description}</p>

                {p.images && p.images.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {p.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={resolveUrl(img)}
                        alt={`${p.name}-${idx}`}
                        className="w-20 h-14 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src =
                            "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Visitingplaces;
