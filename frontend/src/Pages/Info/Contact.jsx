import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder - you can hook this up to backend/email service
    alert("Thank you for getting in touch, " + form.name + "!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-4xl bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg p-10">
        <h1 className="text-4xl font-serif font-bold mb-4 text-center text-yellow-400">
          Get in Touch
        </h1>
        <p className="text-center text-gray-300 mb-10">
          We'd love to hear from you. Questions, feedback or booking help – just
          drop us a line and we'll respond within 24 hours.
        </p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* contact info column */}
          <div className="space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p className="text-gray-300">codebuilterit@gmail.com</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Phone</h2>
              <p className="text-gray-300">+94 76 211 2626</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Address</h2>
              <p className="text-gray-300">Colombo, Sri Lanka</p>
            </div>
          </div>

          {/* form column */}
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={form.name}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-800 border border-gray-700 placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400 focus:ring-1"
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-800 border border-gray-700 placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400 focus:ring-1"
            />
            <textarea
              name="message"
              placeholder="Your Message"
              value={form.message}
              onChange={handleChange}
              required
              className="p-3 rounded bg-gray-800 border border-gray-700 placeholder-gray-500 focus:border-yellow-400 focus:ring-yellow-400 focus:ring-1 h-36"
            />
            <button
              type="submit"
              className="mt-2 bg-yellow-400 hover:bg-yellow-500 text-slate-900 font-semibold py-3 rounded transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
