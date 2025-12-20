import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { TravelContext } from "../../Context/TravelContext";

import { FaYoutube } from "react-icons/fa";
import {
  FaMapMarkerAlt,
  FaStar,
  FaAddressBook,
  FaPhoneAlt,
  FaDollarSign,
} from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../../App";
import { FaWhatsapp } from "react-icons/fa";

// ---------------- Helper Components ----------------
const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow hover:bg-gray-800/70 transition w-full">
    {icon}
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-blue-200">{value}</p>
    </div>
  </div>
);

const TextInput = ({
  label,
  name,
  value,
  handleChange,
  type = "text",
  readOnly,
  min,
  required,
  placeholder,
}) => (
  <div className="flex flex-col">
    <label className="mb-1 text-gray-200">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={handleChange}
      readOnly={readOnly}
      min={min}
      placeholder={placeholder}
      className={`p-2 rounded-md ${
        readOnly
          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
          : "bg-gray-700 text-white focus:outline-none"
      }`}
      required={required}
    />
  </div>
);

const FormSection = ({ booking, item, handleChange, handleSubmit }) => (
  <div className="lg:w-1/3">
    <div className=" bg-gray-800/50  p-6 rounded-xl shadow">
      <h3 className="text-2xl font-bold mb-6 text-amber-300">Book Your Stay</h3>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextInput
          label="Hotel / Resort"
          name="hotel"
          value={item.name}
          readOnly
        />
        <TextInput
          label="Name"
          name="name"
          value={booking.name}
          handleChange={handleChange}
          required
        />
        <TextInput
          label="Email"
          name="email"
          type="email"
          value={booking.email}
          handleChange={handleChange}
          required
        />
        <TextInput
          label="Phone Number"
          name="phone"
          type="tel"
          value={booking.phone}
          handleChange={handleChange}
          placeholder="+94 7X XXX XXXX"
          required
        />
        <TextInput
          label="From"
          name="fromDate"
          type="date"
          value={booking.fromDate}
          handleChange={handleChange}
          required
        />

        <TextInput
          label="To"
          name="toDate"
          type="date"
          value={booking.toDate}
          handleChange={handleChange}
          required
        />
        <TextInput
          label="Guests"
          name="guests"
          type="number"
          min={1}
          value={booking.guests}
          handleChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold p-3 rounded-md transition"
        >
          make Request
        </button>
      </form>
    </div>
  </div>
);

// ---------------- Main Component ----------------
const extractYouTubeId = (url) => {
  if (!url) return null;
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const Trending = () => {
  const { navigate, addtrend } = useContext(TravelContext);
  const { name } = useParams();
  const item = addtrend.find((trending) => trending.name === name);

  // Ensure the page scrolls to top when navigating to this route or when the
  // `name` param changes (prevents preserving scroll position from previous page)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    } catch (e) {
      // ignore if window is not available (SSR)
    }
  }, [name]);
  console.log("ITEM DATA:", item);

  const [showVideo, setShowVideo] = useState(false);
  const videoId = extractYouTubeId(item?.videoUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    fromDate: "",
    toDate: "",
    guests: 1,
    hotel: item?.name || "",
  });

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form fields
    if (
      !booking.name ||
      !booking.email ||
      !booking.phone ||
      !booking.fromDate ||
      !booking.toDate
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Ensure we have an owner email to send the booking to
    if (!item?.ownerEmail) {
      console.error("Missing ownerEmail on item:", item);
      alert("Booking cannot be sent because the owner's email is missing.");
      return;
    }

    try {
      // Build payload and log for debugging
      const payload = {
        hotelName: item.name,
        ownerEmail: item.ownerEmail,
        booking,
      };
      console.log("Sending booking payload:", payload);

      const res = await axios.post(
        `${BACKEND_URL}/api/trending/sendbooking`,
        payload
      );

      if (res?.data?.success) {
        alert("Booking request sent successfully!");
      } else {
        alert(res?.data?.message || "Booking request sent (no confirmation)");
      }

      // Reset form after submission
      setBooking({
        name: "",
        email: "",
        phone: "",
        fromDate: "",
        toDate: "",
        guests: 1,
        hotel: item.name,
      });
    } catch (error) {
      console.error("Error sending booking email:", error?.response || error);
      const serverMsg = error?.response?.data?.message || error?.message;
      alert(`Failed to send booking: ${serverMsg}`);
    }
  };

  if (!item) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="bg-gray-900 text-white min-h-screen px-4 sm:px-8 lg:px-16 py-10">
      <p className="w-full h-24"></p>

      {/* Back & Title */}
      <div className="flex flex-row items-center gap-6 mb-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center text-white hover:text-amber-300 transition"
        >
          <IoArrowBackOutline size={28} />
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <h1 className="text-2xl sm:text-4xl font-bold text-cyan-400">
            {item.name}
          </h1>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-12">
        {/* Main image - large, takes up 2 cols and 2 rows */}
        <div className="col-span-2 row-span-2 overflow-hidden rounded-2xl shadow-lg group max-h-96">
          <img
            src={item.image || item.image1}
            alt={`${item.name} main`}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Additional images - smaller thumbnails */}
        {[item.image2, item.image3, item.image4, item.image5].map(
          (img, i) =>
            img && (
              <div
                key={i}
                className="overflow-hidden rounded-2xl shadow-lg group max-h-44"
              >
                <img
                  src={img}
                  alt={`${item.name} ${i + 2}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            )
        )}
      </div>

      {/* Two Column Layout */}
      {/* Video URL (display only, no embedding) */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side */}
        <div className="lg:w-2/3 space-y-10">
          <InfoCard
          
            value={
              item.videoUrl ? (
                videoId ? (
                  <>
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => setShowVideo(true)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") setShowVideo(true);
                      }}
                      className="relative w-full max-w-md cursor-pointer rounded-lg overflow-hidden"
                    >
                      <img
                        src={thumbnailUrl}
                        alt={`${item.name} video thumbnail`}
                        className="w-full h-auto object-cover rounded-lg shadow-md"
                      />
                     
                    </div>

                    {showVideo && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
                        <div className="relative w-full max-w-4xl">
                          <button
                            onClick={() => setShowVideo(false)}
                            className="absolute top-2 right-2 text-white bg-gray-800/60 px-3 py-1 rounded"
                          >
                            Close
                          </button>
                          <div
                            style={{
                              position: "relative",
                              paddingTop: "56.25%",
                            }}
                          >
                            <iframe
                              title={`${item.name} video`}
                              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: 0,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-200 underline"
                  >
                    {item.videoUrl}
                  </a>
                )
              ) : (
                "-"
              )
            }
          />
          <InfoCard
            icon={<FaMapMarkerAlt className="text-red-500" />}
            title="Location"
            value={
              item.location ? (
                <a
                  href={item.location}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-200 underline"
                >
                  {item.location}
                </a>
              ) : (
                "-"
              )
            }
          />
          <InfoCard
            icon={<FaStar className="text-yellow-400" />}
            title="Highlights"
            value={item.highlights}
          />
          <InfoCard
            icon={<FaAddressBook className="text-emerald-400" />}
            title="Address"
            value={item.address}
          />
          <InfoCard
            icon={<FaPhoneAlt className="text-red-400" />}
            title="Contact"
            value={item.contact}
          />
          <InfoCard
            icon={<FaDollarSign className="text-red-400" />}
            title="Price per person per day(RS.)"
            value={item.price}
          />
          <InfoCard
            title="Availability"
            value={
              <ul className="list-disc list-inside mt-1 ml-4">
                {item.availableThings.map((thing, index) => (
                  <li key={index} className="mt-1">
                    {thing}
                  </li>
                ))}
              </ul>
            }
          />

          <div className="bg-gray-800/50 p-4 rounded-xl shadow">
            <p className="font-semibold">Description</p>
            <p className="text-blue-200">{item.description}</p>
          </div>
        </div>

        {/* Right Side - Booking Form */}
        <FormSection
          booking={booking}
          item={item}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>

      <div className="h-20"></div>

      <a
        href={`https://wa.me/${item.contact.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition transform hover:scale-110"
      >
        <FaWhatsapp size={28} />
      </a>
    </div>
  );
};

export default Trending;
