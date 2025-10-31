import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { IoArrowBackOutline } from "react-icons/io5";
import { TravelContext } from "../../Context/TravelContext";
import { FaMapMarkerAlt, FaStar, FaAddressBook, FaPhoneAlt } from "react-icons/fa";
import emailjs from "@emailjs/browser";

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

const TextInput = ({ label, name, value, handleChange, type = "text", readOnly, min, required, placeholder }) => (
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
      className={`p-2 rounded-md ${readOnly ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-gray-700 text-white focus:outline-none"}`}
      required={required}
    />
  </div>
);

const FormSection = ({ booking, item, handleChange, handleSubmit }) => (
  <div className="lg:w-1/3 bg-gray-800/50 p-6 rounded-2xl shadow-lg">
    <h3 className="text-2xl font-bold mb-6 text-amber-300">Book Your Stay</h3>
    <form className="space-y-4" onSubmit={handleSubmit}>
      <TextInput label="Hotel / Resort" name="hotel" value={item.name} readOnly />
      <TextInput label="Name" name="name" value={booking.name} handleChange={handleChange} required />
      <TextInput label="Email" name="email" type="email" value={booking.email} handleChange={handleChange} required />
      <TextInput label="Phone Number" name="phone" type="tel" value={booking.phone} handleChange={handleChange} placeholder="+94 7X XXX XXXX" required />
      <TextInput label="Date" name="date" type="date" value={booking.date} handleChange={handleChange} required />
      <TextInput label="Guests" name="guests" type="number" min={1} value={booking.guests} handleChange={handleChange} required />

      <button
        type="submit"
        className="w-full bg-amber-400 hover:bg-amber-300 text-gray-900 font-semibold p-3 rounded-md transition"
      >
        Book Now
      </button>
    </form>
  </div>
);

// ---------------- Main Component ----------------

const Trending = () => {
  const { navigate, addtrend } = useContext(TravelContext);
  const { name } = useParams();
  const item = addtrend.find((trending) => trending.name === name);

  const [booking, setBooking] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    guests: 1,
    hotel: item?.name || "",
  });

  const handleChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  // WhatsApp sender
  const handleWhatsApp = (booking) => {
    const phoneNumber = "94760176493"; // Replace with your number
    const message = `
Booking Request:
Hotel: ${booking.hotel}
Name: ${booking.name}
Email: ${booking.email}
Phone: ${booking.phone}
Date: ${booking.date}
Guests: ${booking.guests}
    `;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!booking.name || !booking.email || !booking.phone || !booking.date) {
      alert("Please fill in all required fields.");
      return;
    }

    // Open WhatsApp first
    handleWhatsApp(booking);

    // Send Email via EmailJS
    try {
      const res = await emailjs.send(
        "service_x1d4vvg",   // Your EmailJS service ID
        "template_yn4aabs",  // Your EmailJS template ID
        booking,
        "_YBk0WyT8x6fOKs-n"  // Your EmailJS public key
      );

      console.log("Email sent!", res.status, res.text);
      alert("Booking request sent via email ✅");

    } catch (err) {
      console.error("EmailJS error:", err);
      alert("Failed to send booking request ❌");
    }

    // Reset form
    setBooking({
      name: "",
      email: "",
      phone: "",
      date: "",
      guests: 1,
      hotel: item.name,
    });
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
          <h1 className="text-2xl sm:text-4xl font-bold text-cyan-400">{item.name}</h1>
          <h2 className="text-2xl sm:text-3xl text-green-300 italic">({item.subname})</h2>
        </div>
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-12">
        {[item.image1, item.image2, item.image3, item.image4, item.image5].map((img, i) => (
          <div
            key={i}
            className={`overflow-hidden rounded-2xl shadow-lg group ${i === 0 ? "col-span-2 row-span-2 max-h-96" : "max-h-44"}`}
          >
            <img
              src={img}
              alt={`${item.name} ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left Side */}
        <div className="lg:w-2/3 space-y-10">
          <InfoCard icon={<FaMapMarkerAlt className="text-red-500" />} title="Location" value={item.location} />
          <InfoCard icon={<FaStar className="text-yellow-400" />} title="Highlights" value={item.highlights} />
          <InfoCard icon={<FaAddressBook className="text-emerald-400" />} title="Address" value={item.address} />
          <InfoCard icon={<FaPhoneAlt className="text-red-400" />} title="Contact" value={item.contact} />
        </div>

        {/* Right Side - Booking Form */}
        <FormSection booking={booking} item={item} handleChange={handleChange} handleSubmit={handleSubmit} />
      </div>

      <div className="h-20"></div>
    </div>
  );
};

export default Trending;
