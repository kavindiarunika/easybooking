import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const ShowProductAcount = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchVendors = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${backendUrl}/api/product-vendor/all`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id, email) => {
    const ok = window.confirm(
      `Are you sure you want to delete ${email || id}? This cannot be undone.`,
    );
    if (!ok) return;

    setDeletingId(id);
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.delete(`${backendUrl}/api/product-vendor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(res.data?.message || "Vendor deleted");
      // refresh list
      await fetchVendors();
    } catch (err) {
      console.error(
        "Failed to delete vendor:",
        err.config?.url,
        err.response?.status,
        err.response?.data,
        err.message,
      );
      const msg = err.response?.data?.message || err.message || "Delete failed";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Product Vendor Accounts</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center">Loading vendor accounts...</div>
      ) : vendors.length === 0 ? (
        <div className="py-8 text-center text-gray-500">
          No vendor accounts found.
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded bg-white">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="p-3 text-left">Business</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Registered</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-semibold">
                    {v.businessName || v.ownerName}
                  </td>
                  <td className="p-3 text-blue-600">{v.email}</td>
                  <td className="p-3">{v.phone || "-"}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {v.createdAt
                      ? new Date(v.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={async () => {
                        const ok = window.confirm(
                          `Are you sure you want to delete ${v.email}? This cannot be undone.`,
                        );
                        if (!ok) return;
                        try {
                          const token = localStorage.getItem("adminToken");
                          await axios.delete(
                            `${backendUrl}/api/product-vendor/${v._id}`,
                            {
                              headers: { Authorization: `Bearer ${token}` },
                            },
                          );
                          // refresh list
                          fetchVendors();
                        } catch (err) {
                          console.error("Failed to delete vendor", err);
                          alert(err.response?.data?.message || "Delete failed");
                        }
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        Total Vendors: <span className="font-semibold">{vendors.length}</span>
      </div>
    </div>
  );
};

export default ShowProductAcount;
