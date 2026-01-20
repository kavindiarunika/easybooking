import React from "react";

const GotripDashboard = () => {
  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-3">
        Smartsbooking Terms & Conditions
      </h2>

      <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
        <p>
          <span className="font-medium">Smartsbooking.com</span> does not charge
          any commission from any party.
        </p>

        <p>
          Your organization must agree to provide a
          <span className="font-semibold text-green-600"> 10% discount </span>
          to customers who come through us.
        </p>

        <p>
          The annual fee for all our services is
          <span className="font-semibold"> Rs. 5,000/=</span> and it must be paid
          on the due date.
        </p>
      </div>

      <div className="mt-5 flex justify-end">
        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
          I Understand
        </button>
      </div>
    </div>
  );
};

export default GotripDashboard;
