import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { backendUrl } from "../../App";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiLoader,
  FiCheckCircle,
} from "react-icons/fi";

const NewStays = ({ token: propToken }) => {
  // Get token from props or localStorage
  const token = propToken || localStorage.getItem("token");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dismissedVendors, setDismissedVendors] = useState([]);

  // Fetch registered vendors
  const fetchVendors = useCallback(async () => {
    const authToken = propToken || localStorage.getItem("token");
    if (!authToken) {
      toast.error("No authentication token. Please login again.");
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching vendors with token:", authToken);
      const res = await axios.get(`${backendUrl}/api/vendor/all`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      console.log("API Response:", res.data);

      if (res.data.success && res.data.vendors) {
        // Filter to show only vendors that haven't been accepted yet
        const newVendors = res.data.vendors.filter((v) => !v.accept);

        if (newVendors.length > 0) {
          setVendors(newVendors);
        } else {
          setVendors([]);
          toast.info("No new vendors to review");
        }
      } else {
        toast.warning(res.data.message || "Could not load vendors");
      }
    } catch (err) {
      console.error("Error fetching vendors:", err);
      toast.error(
        err.response?.data?.message ||
          "Error fetching vendors. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [propToken]);

  useEffect(() => {
    if (token) {
      fetchVendors();
    }
  }, [token, fetchVendors]);

  // Handle Okay button - remove from list only
  const handleOkay = (vendorId) => {
    setDismissedVendors([...dismissedVendors, vendorId]);
    setVendors(vendors.filter((v) => v._id !== vendorId));
    toast.success("Vendor dismissed from list");
  };

  // Handle Accept button - accept vendor and remove from list
  const handleAccept = async (vendorId) => {
    try {
      console.log("Accepting vendor with ID:", vendorId);
      console.log("API URL:", `${backendUrl}/api/vendor/accept/${vendorId}`);
      const res = await axios.put(
        `${backendUrl}/api/vendor/accept/${vendorId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      console.log("Accept response:", res.data);
      if (res.data.success) {
        toast.success("Vendor accepted successfully!");
        setVendors(vendors.filter((v) => v._id !== vendorId));
      } else {
        toast.error(res.data.message || "Failed to accept vendor");
      }
    } catch (err) {
      console.error("Error accepting vendor:", err);
      console.error("Error status:", err.response?.status);
      console.error("Error data:", err.response?.data);
      toast.error(err.response?.data?.message || "Error accepting vendor");
    }
  };

  // Filter out dismissed vendors
  const displayVendors = vendors.filter(
    (v) => !dismissedVendors.includes(v._id),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center gap-2 text-gray-600">
          <FiLoader className="animate-spin" size={24} />
          <span>Loading vendors...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Registered Vendors
        </h1>
        <p className="text-gray-600">
          Total vendors:{" "}
          <span className="font-semibold text-blue-600">
            {displayVendors.length}
          </span>
        </p>
      </div>

      {displayVendors.length === 0 ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <FiCheckCircle className="text-blue-500 mx-auto mb-3" size={48} />
          <p className="text-gray-700 text-lg">No vendors to review</p>
          <p className="text-gray-500 text-sm">
            All vendors have been reviewed
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayVendors.map((vendor) => (
            <div
              key={vendor._id}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <FiUser size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg truncate">
                      {vendor.hotelName || vendor.vendorName || "N/A"}
                    </h3>
                    <p className="text-blue-100 text-sm">{vendor.category}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3">
                {/* Email */}
                <div className="flex items-start gap-3">
                  <FiMail
                    className="text-red-500 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-gray-800 break-all">
                      {vendor.email}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-3">
                  <FiPhone
                    className="text-green-500 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm text-gray-800">
                      {vendor.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <FiMapPin
                    className="text-purple-500 flex-shrink-0 mt-1"
                    size={18}
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm text-gray-800">
                      {vendor.city}, {vendor.district}{" "}
                      {vendor.country && `(${vendor.country})`}
                    </p>
                  </div>
                </div>

                {/* Business Address */}
                {vendor.businessAddress && (
                  <div className="pt-2 border-t border-gray-200">
                    <p className="text-xs text-gray-500 mb-1">
                      Business Address
                    </p>
                    <p className="text-sm text-gray-700">
                      {vendor.businessAddress}
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="pt-2 border-t border-gray-200">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      vendor.isVerified
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {vendor.isVerified
                      ? "✓ Verified"
                      : "⏳ Pending Verification"}
                  </span>
                </div>
              </div>

              {/* Footer with Accept and Okay Buttons */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => handleAccept(vendor._id)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  ✓ Accept
                </button>
                <button
                  onClick={() => handleOkay(vendor._id)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  ✓ Okay
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default NewStays;
