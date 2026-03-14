import React from "react";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto bg-gray-900/70 backdrop-blur-sm rounded-lg shadow-lg p-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            {/* Privacy Policy */}
            <h1 className="text-4xl font-serif font-bold text-green-400 mb-6 text-center">
              Privacy Policy
            </h1>
            <p className="leading-relaxed mb-6">
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information when you use
              our website.
            </p>
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                Information Collection
              </h2>
              <p className="leading-relaxed">
                We only collect information that you voluntarily provide (e.g.,
                name, email, phone) when contacting us or making a booking. We
                do not sell or share your data with third parties except as
                required to complete your reservation or as mandated by law.
              </p>
            </section>
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                Cookies
              </h2>
              <p className="leading-relaxed">
                We may use cookies to enhance your browsing experience. You can
                disable cookies in your browser settings, though some features
                may not work properly.
              </p>
            </section>
            <section className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                Consent
              </h2>
              <p className="leading-relaxed">
                By using our site, you consent to the terms of this policy. If
                you have questions or concerns, please{" "}
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

          <div>
            {/* Terms and Conditions */}
            <h1 className="text-4xl font-serif font-bold text-green-400 mb-2 text-center">
              Terms and Conditions
            </h1>
            <p className="text-sm text-gray-400 text-center mb-8">
              Last updated: March 13, 2026
            </p>
            <p className="leading-relaxed mb-6">
              Welcome to our website. By visiting or using this site, you agree
              to follow the terms outlined below. These terms are designed to
              ensure a safe and fair experience for all users.
            </p>

            <div className="grid grid-cols-1 gap-6">
              {[
                {
                  title: "1. Using Our Website",
                  content:
                    "You agree to use this website responsibly and only for legal purposes. Any activity that may harm the website, interfere with its functionality, or negatively affect other users is not permitted.",
                },
                {
                  title: "2. Website Content",
                  content:
                    "All content available on this website, including text, images, graphics, logos, and other materials, belongs to this website or its content creators unless stated otherwise. You may not copy, reproduce, distribute, or use this content without permission.",
                },
                {
                  title: "3. User Accounts",
                  content:
                    "If our website allows you to create an account, you are responsible for keeping your login details secure. Any actions that take place under your account are considered your responsibility.",
                },
                {
                  title: "4. Third-Party Links",
                  content:
                    "Our website may include links to external websites for additional information or services. We are not responsible for the content, policies, or practices of those third-party websites.",
                },
                {
                  title: "5. Limitation of Liability",
                  content:
                    "While we aim to keep the website accurate and functioning properly, we cannot guarantee that it will always be error-free or uninterrupted. We are not liable for any losses or damages that may occur from using the website.",
                },
                {
                  title: "6. Updates to These Terms",
                  content:
                    "We may revise these Terms and Conditions from time to time. Any updates will be posted on this page. By continuing to use the website after changes are made, you accept the updated terms.",
                },
              ].map((section) => (
                <section key={section.title} className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-100 mb-2">
                    {section.title}
                  </h2>
                  <p className="leading-relaxed">{section.content}</p>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
