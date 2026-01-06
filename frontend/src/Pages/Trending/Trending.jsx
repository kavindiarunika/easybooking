import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { TravelContext } from "../../Context/TravelContext";
import { CiSaveDown1 } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {
  FaMapMarkerAlt,
  FaStar,
  FaAddressBook,
  FaPhoneAlt,
  FaDollarSign,
  FaWhatsapp,
} from "react-icons/fa";
import api from "../../api";

// ---------------- Helper Components ----------------
const InfoCard = ({ icon, title, value }) => (
  <div className="flex items-center gap-3 bg-gray-800/50 p-4 rounded-xl shadow w-full">
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
      required={required}
      className={`p-2 rounded-md ${
        readOnly
          ? "bg-gray-600 text-gray-300 cursor-not-allowed"
          : "bg-gray-700 text-white"
      }`}
    />
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

  const item = addtrend.find(
    (t) => t.name.trim() === decodeURIComponent(name).trim()
  );

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [name]);

  const [showVideo, setShowVideo] = useState(false);
  const [showMoreImages, setShowMoreImages] = useState(false);

  if (!item) return <div className="text-white p-10">Loading...</div>;

  const videoId = extractYouTubeId(item.videoUrl);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : null;

  // ---------------- Booking ----------------
  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    fromDate: "",
    toDate: "",
    guests: 1,
    hotel: item.name,
  });

  const handleChange = (e) =>
    setBooking({ ...booking, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!item.ownerEmail) {
      alert("Owner email missing");
      return;
    }

    try {
      const payload = {
        hotelName: item.name,
        ownerEmail: item.ownerEmail,
        booking,
      };

      const res = await api.post("/api/trending/sendbooking", payload);

      if (res.data.success) alert("Booking request sent!");
      setBooking({
        name: "",
        email: "",
        phone: "",
        fromDate: "",
        toDate: "",
        guests: 1,
        hotel: item.name,
      });
    } catch (err) {
      alert("Booking failed");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen px-6 py-10">
      <p className="h-30 w-full"></p>
      {/* Back */}
      <div className=" flex flex-row  gap-4">
        <button
          onClick={() => navigate("/villa")}
          className="flex items-center gap-2 mb-6"
        >
          <IoArrowBackOutline size={26} />
        </button>

        <h1 className="text-3xl font-bold text-cyan-400 mb-6">{item.name}</h1>
      </div>

      {/* ================= GALLERY ================= */}
      <div className="mb-10">
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
          {/* MAIN IMAGE */}
          <div className="col-span-2 row-span-2 aspect-[16/9] rounded-xl overflow-hidden  relative">
            <img
              src={item.mainImage || item.image || item.image1}
              alt="main"
              className="w-full h-[50vh] sm:h-[80vh] object-cover"
            />
          </div>

          {/* SIDE IMAGES */}
          {[item.image1, item.image2, item.image3, item.image4]
            .filter(Boolean)
            .map((img, i) => (
              <div
                key={i}
                className="aspect-[16/9] rounded-xl overflow-hidden bg-gray-100"
              >
                <img
                  src={img}
                  alt={`img-${i + 1}`}
                  className="w-full h-[10vh] sm:h-[50vh] object-cover"
                />
              </div>
            ))}
          {Array.isArray(item.otherimages) && item.otherimages.length > 0 && (
            <div className="absolute top-[60vh] right-20 text-center text-green-400 font-bold text-sm  sm:text-xl hover:text-amber-300">
              <button
                onClick={() => setShowMoreImages(!showMoreImages)}
                className="h-[10vh] sm:h-[20vh] p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                {showMoreImages ? "Hide Photos" : "View More Photos"}
                <CiSaveDown1 className="inline ml-2 w-4 h-4 sm:w-12 sm:h-12" />
              </button>
            </div>
          )}
          {/* VIEW MORE BUTTON */}
        </div>

        {/* FULLSCREEN GALLERY MODAL */}
        {showMoreImages && Array.isArray(item.otherimages) && (
          <div className="sm:fixed inset-0 bg-black/70 z-50 flex  p-0 sm:p-4 ">
            <div className="bg-gray-900 rounded-lg w-full max-w-[95vw] sm:max-w-3xl md:max-w-6xl max-h-[90vh] overflow-y-auto mx-auto px-3 sm:px-0">
              {/* CLOSE BUTTON */}
              <div className="flex justify-center sm:justify-end p-3 sm:p-2 border-b border-gray-700 sticky top-0 bg-gray-900 z-10">
                <button
                  aria-label="Close gallery"
                  onClick={() => setShowMoreImages(false)}
                  className="text-white bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  <IoMdClose size={22} />
                </button>
              </div>

              {/* IMAGES GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-2 p-3 sm:p-4 justify-items-center">
                {(Array.isArray(item.otherimages) ? item.otherimages : []).map(
                  (src, idx) => (
                    <div
                      key={idx}
                      className="w-full rounded overflow-hidden bg-gray-800 flex justify-center p-2"
                    >
                      <img
                        src={src}
                        alt={`other-${idx}`}
                        className="w-full max-w-[92%] max-h-[60vh] h-auto object-contain"
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= CONTENT ================= */}
      <div className="grid lg:grid-cols-3 gap-10">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <InfoCard
            icon={<FaMapMarkerAlt className="text-red-500" />}
            title="Location"
            value={item.location}
          />
          <InfoCard
            icon={<FaStar className="text-yellow-400" />}
            title="Highlights"
            value={item.highlights}
          />
          <InfoCard
            icon={<FaAddressBook className="text-green-400" />}
            title="Address"
            value={item.address}
          />
          <InfoCard
            icon={<FaPhoneAlt className="text-blue-400" />}
            title="Contact"
            value={item.contact}
          />
          <InfoCard
            icon={<FaDollarSign className="text-emerald-400" />}
            title="Price (Rs.)"
            value={item.price}
          />

          <div className="bg-gray-800/50 p-4 rounded-xl">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-blue-200">{item.description}</p>
          </div>

          {/* VIDEO */}
          {videoId && (
            <div className="cursor-pointer" onClick={() => setShowVideo(true)}>
              <img src={thumbnailUrl} alt="video" className="rounded-xl" />
            </div>
          )}
        </div>

        {/* RIGHT - BOOKING */}
        <div className="bg-gray-800/50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4 text-amber-300">
            Book Your Stay
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              label="Phone"
              name="phone"
              value={booking.phone}
              handleChange={handleChange}
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

            <button className="w-full bg-amber-400 text-gray-900 p-3 rounded-lg font-semibold">
              Make Request
            </button>
          </form>
        </div>
      </div>

      {/* WHATSAPP */}
      {item?.contact && (
        <a
          href={`https://wa.me/${item.contact.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 p-4 rounded-full"
        >
          <FaWhatsapp size={28} />
        </a>
      )}
    </div>
  );
};

export default Trending;
