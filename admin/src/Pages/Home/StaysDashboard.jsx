import React from "react";

const StaysDashboard = () => (
  <div className="p-6 bg-white rounded-xl shadow-sm">
    <h2 className="text-2xl font-bold mb-4 text-blue-700">Stays Dashboard</h2>
    <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
      <p className="text-lg font-semibold text-blue-800 mb-2">
        Smartsbooking.com does not charge any commission from any party.
      </p>
      <p className="text-gray-700 mb-1">
        Your organization must agree to provide a <span className="font-bold">10% discount</span> to customers who come through us.
      </p>
      <p className="text-gray-700 mb-1">
        The annual fee for all our services is <span className="font-bold">Rs. 5000/=</span> and it must be paid on the due date.
      </p>
    </div>
    <div className="text-gray-600">
      <p>Welcome to your Stays Dashboard. Please review the above terms and ensure compliance to continue using our platform.</p>
    </div>
  </div>
);

export default StaysDashboard;
