import React, { useState } from "react";
import { heroImage } from "../../assets/HomepageImages/home";
const Contact = () => {
  

 

 

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-4xl bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg p-10">
        <h1 className="text-4xl font-serif font-bold mb-4 text-center text-green-400">
          Get in Touch
        </h1>
        <p className="text-center text-gray-300 mb-10">
          We'd love to hear from you. Questions, feedback or booking help – just
          drop us a line and we'll respond within 24 hours.
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* contact info column */}
          <div className="space-y-8">
            <div className="bg-green-300 text-black py-2 px-4 rounded-2xl">
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p className="">codebuilterit@gmail.com</p>
            </div>
            <div className="bg-green-300 text-black py-2 px-4 rounded-2xl">
              <h2 className="text-xl font-semibold mb-2">Phone</h2>
              <p className="">+94 76 211 2626</p>
            </div>
            <div className="bg-green-300 text-black py-2 px-4 rounded-2xl">
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <p className="">Colombo, Sri Lanka</p>
            </div>
          </div>
         <img src={heroImage.contact} alt="" className=""/>
         
        </div>
      </div>
    </div>
  );
};

export default Contact;
