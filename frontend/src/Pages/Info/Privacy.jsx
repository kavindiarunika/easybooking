import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg p-12">
        <h1 className="text-4xl font-serif font-bold text-yellow-400 mb-6 text-center">
          Privacy Policy
        </h1>
        <p className="leading-relaxed mb-6">
          Your privacy is important to us. This policy explains how we collect,
          use, and protect your personal information when you use our website.
        </p>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">
            Information Collection
          </h2>
          <p className="leading-relaxed">
            We only collect information that you voluntarily provide (e.g.,
            name, email, phone) when contacting us or making a booking. We do
            not sell or share your data with third parties except as required to
            complete your reservation or as mandated by law.
          </p>
        </section>
        <section className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">Cookies</h2>
          <p className="leading-relaxed">
            We may use cookies to enhance your browsing experience. You can
            disable cookies in your browser settings, though some features may
            not work properly.
          </p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold text-gray-100 mb-2">Consent</h2>
          <p className="leading-relaxed">
            By using our site, you consent to the terms of this policy. If you
            have questions or concerns, please{" "}
            <Link
              to="/contact"
              className="text-blue-300 hover:text-blue-200 underline"
            >
              contact us
            </Link>{" "}
            via the contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
