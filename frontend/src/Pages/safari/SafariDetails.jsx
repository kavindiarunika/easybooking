import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../../App.jsx";
import { IoLogoWhatsapp } from "react-icons/io";

const SafariDetails = () => {
  const { id } = useParams();
  const [safari, setSafari] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    
    const getSafariById = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/safari/safari/${id}`);
        setSafari(res.data.safari);
      } catch (err) {
        setError("Failed to load safari details");
      } finally {
        setLoading(false);
      }
    };

    getSafariById();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        {error}
      </div>
    );

  if (!safari)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Safari not found
      </div>
    );

  return (
    <>
      {/* ================= MAIN CONTENT ================= */}
      <main className="w-full bg-black/30 text-white min-h-screen">
        {/* Spacer for fixed navbar */}
        <div className="h-32"></div>

        {/* TITLE */}
        <div className="flex flex-row justify-between items-center gap-2 mt-4">
           <h1 className="text-4xl md:text-3xl font-bold text-amber-300 mb-8 px-4">
          {safari.name}
        </h1>
        <h1 className=" md:text-xl text-sm font-bold rounded-full bg-green-300/80 shadow-2xl shadow-emerald-300 text-black mb-8 p-4 mr-4">
          -10%
        </h1>

        </div>
       

        {/* MAIN LAYOUT */}
        <div className="flex flex-col lg:flex-row items-start gap-10 px-4">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <img
              src={safari.mainImage}
              alt={safari.name}
              className="w-full h-[45vh] rounded-xl object-cover"
            />

            {safari.otherimages?.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                {safari.otherimages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Safari ${index + 1}`}
                    className="w-full h-[22vh] rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-1/2">
            {/* PRICE INFO */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/30 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-300">Per person</p>
                <h3 className="text-2xl font-bold">LKR {safari.price}</h3>
              </div>
              <div className="bg-white/30 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-300">Duration</p>
                <h3 className="text-2xl font-bold">{safari.totalDays} Days</h3>
              </div>
              <div className="bg-white/30 rounded-lg p-3 text-center">
                <p className="text-sm text-gray-300">Team Members</p>
                <h3 className="text-2xl font-bold">{safari.TeamMembers}</h3>
              </div>
            </div>

            <p className="text-gray-200 mb-6">{safari.description}</p>

            <div className="ml-2 mt-4">
              {" "}
              <p className="text-2xl text-green-200 mb-4">
                Safari Vehicle
              </p>{" "}
              <div className="grid grid-cols-4 gap-6 text-xl ">
                {" "}
                {safari.vehicleImage.map((vehicle, index) => (
                  <img
                    src={vehicle}
                    alt=""
                    className="w-full h-[20vh] rounded-2xl"
                  />
                ))}{" "}
              </div>{" "}
            </div>
            {/* ADVENTURES */}
            <h3 className="text-2xl text-green-200 mb-4 mt-4">Adventures</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {safari.adventures.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="text-gray-300">{item}</span>
                </div>
              ))}
            </div>

            {/* INCLUDED PLACES */}
            {safari.includeplaces?.length > 0 && (
              <>
                <h3 className="text-2xl mb-4">Included Places</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  {safari.includeplaces.map((place, index) => (
                    <div
                      key={index}
                      className="bg-white/10 rounded-lg px-4 py-2"
                    >
                      {place}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* GUIDE */}
            <h3 className="text-2xl mb-4">Guide Details</h3>
            <div className="bg-slate-600/30 rounded-2xl p-4 flex flex-col sm:flex-row gap-6 items-center">
              <img
                src={safari.GuiderImage}
                alt={safari.GuiderName}
                className="w-28 h-28 sm:w-40 sm:h-40 rounded-full object-cover"
              />

              <div className="text-center sm:text-left">
                <p className="text-xl text-amber-200 mb-2">
                  {safari.GuiderName}
                </p>
                <p className="text-gray-200 text-sm sm:text-base">
                  Hello, I’m {safari.GuiderName} with {safari.GuiderExperience}{" "}
                  years of experience. I’ll guide you through {safari.name}{" "}
                  safari and exciting adventures like{" "}
                  {safari.adventures.join(", ")}.
                </p>
                <p className="mt-3 text-sm">
                  <span className="block text-green-400">
                    Email: {safari.email}
                  </span>
                  <span className="block text-green-400">
                    WhatsApp: {safari.whatsapp}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ================= FLOATING WHATSAPP BUTTON ================= */}
   <div
  className="fixed left-4 sm:left-6 z-[99999] flex flex-col gap-4 pointer-events-auto"
  style={{ bottom: "calc(1.5rem + env(safe-area-inset-bottom, 0px))" }}
>
  
  <a
    href={`https://wa.me/${safari.whatsapp}?text=Hello%20I%20am%20interested%20in%20${encodeURIComponent(
      safari.name
    )}`}
    target="_blank"
    rel="noopener noreferrer"
    aria-label="Chat on WhatsApp"
    className="
      flex items-center justify-center
      bg-green-500 hover:bg-green-600
      text-white
      rounded-full
      shadow-2xl
      p-3
      w-12 h-12 sm:w-auto sm:h-auto sm:px-5 sm:py-3
      transition-all
    "
  >
    <IoLogoWhatsapp className="w-6 h-6 sm:w-8 sm:h-8" />
    <span className="hidden sm:inline ml-2 font-semibold">
      Chat on WhatsApp
    </span>
  </a>

 
</div>

    </>
  );
};

export default SafariDetails;
