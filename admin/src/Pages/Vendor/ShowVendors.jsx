import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";

const ShowVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${backendUrl}/api/product-vendor/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setVendors(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Failed to fetch vendors", err);
      setError(
        err.response?.data?.message ||
          "Failed to fetch vendor accounts. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Vendor Accounts</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Loading vendors...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No vendors found.</div>
      ) : (
        <div className="overflow-x-auto shadow rounded">
          <table className="w-full table-auto bg-white border-collapse">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-4 text-left">Business Name</th>
                <th className="p-4 text-left">Owner Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Total Products</th>
                <th className="p-4 text-left">Rating</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joined</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-semibold">{vendor.businessName}</td>
                  <td className="p-4">{vendor.ownerName}</td>
                  <td className="p-4 text-blue-600">{vendor.email}</td>
                  <td className="p-4">{vendor.phone || "-"}</td>
                  <td className="p-4 text-center">
                    <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {vendor.totalProducts || 0}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-yellow-500 font-semibold">
                      {vendor.rating ? vendor.rating.toFixed(1) : "N/A"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        vendor.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vendor.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {vendor.createdAt
                      ? new Date(vendor.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-right text-sm text-gray-600">
        Total Vendors: <span className="font-bold">{vendors.length}</span>
      </div>
    </div>
  );
};

export default ShowVendors;
