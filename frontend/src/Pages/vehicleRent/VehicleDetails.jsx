import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import api from "../../api";

const VehicleDetails = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api
      .get(`/api/vehicle/${id}`)
      .then((res) => {
        setVehicle(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch vehicle");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="text-white p-6">Loading...</div>;
  if (error) return <div className="text-red-400 p-6">{error}</div>;
  if (!vehicle) return <div className="text-white p-6">No data available</div>;

  // prepare WhatsApp number: strip non-digits then ensure Sri Lanka country code
  let raw = String(vehicle.whatsapp || "").replace(/\D/g, "");
  if (raw && !raw.startsWith("94")) {
    // if user omitted country code, prefix with 94
    raw = `94${raw}`;
  }
  const whatsappNumber = raw;

  // formatted display includes plus sign
  const displayWhatsApp = whatsappNumber ? `+${whatsappNumber}` : "";

  return (
    <div className="min-h-screen w-full bg-gray-950 text-white px-4 md:px-10 lg:px-16 py-6 relative">
      {/* Back link */}
      <Link
        to="/vehicle"
        className="inline-block mb-6 text-green-400 hover:underline"
      >
        ← Back to vehicles
      </Link>

      {/* Main container */}
      <div className="w-full bg-gray-900 rounded-xl shadow-lg p-6 md:p-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Images */}
          <div className="lg:w-1/2">
            <img
              src={vehicle.mainImage}
              alt={vehicle.name}
              className="w-full h-[420px] object-cover rounded-xl"
            />
            {vehicle.otherImages?.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                {vehicle.otherImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`${vehicle.name}-${idx}`}
                    className="h-32 w-full object-cover rounded-lg hover:scale-105 transition"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:w-1/2 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{vehicle.name}</h1>
              <p className="text-green-400 text-2xl font-semibold mt-2">
                LKR {vehicle.Price}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <Info label="Type" value={vehicle.type} />
              <Info
                label="District"
                value={vehicle.district || vehicle.discrict}
              />
              <Info label="Passengers" value={vehicle.passengers} />

              <Info
                label="WhatsApp Number"
                value={displayWhatsApp || vehicle.whatsapp || "N/A"}
              />
              <Info
                label="Facilities"
                value={vehicle.facilities?.join(", ") || "N/A"}
              />
            </div>
            <p className="text-gray-300 leading-relaxed  break-words">
              {vehicle.description}
            </p>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Icon */}
      {whatsappNumber && (
        <a
          href={`https://wa.me/${whatsappNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50"
        >
          <FaWhatsapp size={28} />
        </a>
      )}
    </div>
  );
};

// Info subcomponent
const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default VehicleDetails;
