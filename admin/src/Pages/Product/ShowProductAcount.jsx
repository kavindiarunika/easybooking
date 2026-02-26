import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { FiEdit2, FiTrash2, FiLock } from "react-icons/fi";

const ShowProductAcount = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingVendor, setEditingVendor] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [passwordModal, setPasswordModal] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

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

  useEffect(() => {
    fetchVendors();
  }, []);

  // Handle Edit
  const handleEditClick = (vendor) => {
    setEditingVendor(vendor._id);
    setEditForm({
      businessName: vendor.businessName,
      ownerName: vendor.ownerName,
      email: vendor.email,
      phone: vendor.phone,
    });
  };

  const handleEditSubmit = async () => {
    if (!editForm.businessName || !editForm.ownerName || !editForm.email) {
      alert("Please fill in all required fields");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.put(
        `${backendUrl}/api/product-vendor/update/${editingVendor}`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Update response:", response.data);
      alert("Vendor updated successfully!");
      setEditingVendor(null);
      setEditForm({});
      fetchVendors();
    } catch (err) {
      console.error("Edit error:", err);
      alert(err.response?.data?.message || "Failed to update vendor");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (vendorId) => {
    if (!window.confirm("Are you sure you want to delete this vendor account? This action cannot be undone.")) {
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.delete(`${backendUrl}/api/product-vendor/delete/${vendorId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Delete response:", response.data);
      alert("Vendor deleted successfully!");
      fetchVendors();
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete vendor");
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async () => {
    if (!newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    setActionLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      console.log("Changing password for vendor:", passwordModal);
      console.log("Backend URL:", backendUrl);
      console.log("Full URL:", `${backendUrl}/api/product-vendor/change-password/${passwordModal}`);
      
      const response = await axios.put(
        `${backendUrl}/api/product-vendor/change-password/${passwordModal}`,
        { password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log("Password change response:", response.data);
      alert("Password changed successfully!");
      setPasswordModal(null);
      setNewPassword("");
      setConfirmPassword("");
      fetchVendors();
    } catch (err) {
      console.error("Password change error:", err);
      console.error("Error details:", err.response?.data);
      alert(err.response?.data?.message || err.message || "Failed to change password");
    } finally {
      setActionLoading(false);
    }
  };

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
                <th className="p-3 text-left">Actions</th>
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
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEditClick(v)}
                      className="px-3 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600 transition flex items-center gap-1 text-sm"
                      title="Edit vendor"
                    >
                      <FiEdit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => setPasswordModal(v._id)}
                      className="px-3 py-1.5 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition flex items-center gap-1 text-sm"
                      title="Change password"
                    >
                      <FiLock size={16} />
                      Password
                    </button>
                    <button
                      onClick={() => handleDelete(v._id)}
                      disabled={actionLoading}
                      className="px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1 text-sm disabled:opacity-50"
                      title="Delete vendor"
                    >
                      <FiTrash2 size={16} />
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

      {/* Edit Modal */}
      {editingVendor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Edit Vendor Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Business Name *</label>
                <input
                  type="text"
                  value={editForm.businessName}
                  onChange={(e) => setEditForm({ ...editForm, businessName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Owner Name *</label>
                <input
                  type="text"
                  value={editForm.ownerName}
                  onChange={(e) => setEditForm({ ...editForm, ownerName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Email *</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setEditingVendor(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition font-semibold disabled:opacity-50"
              >
                {actionLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {passwordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Change Vendor Password</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1">New Password *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-yellow-500"
                />
              </div>
              <p className="text-xs text-gray-600">Password must be at least 6 characters long.</p>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setPasswordModal(null);
                  setNewPassword("");
                  setConfirmPassword("");
                }}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={actionLoading}
                className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition font-semibold disabled:opacity-50"
              >
                {actionLoading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowProductAcount;
