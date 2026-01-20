import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../../App";
import { toast } from "react-toastify";

const VendorManage = ({ token }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorDetails, setVendorDetails] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [category, setCategory] = useState("stays");
  const [isVerified, setIsVerified] = useState(true);
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [packageName, setPackageName] = useState("");

  const categories = [
    { value: "stays", label: "Stays" },
    { value: "ontrip", label: "On Trip" },
    { value: "vehicle_rent", label: "Vehicle Rent" },
  ];

  // Fetch all vendors
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendUrl}/api/vendor/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setVendors(res.data.vendors);
      } else {
        console.error("API error:", res.data.message);
        toast.error(res.data.message || "Failed to fetch vendors");
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error(error.response?.data?.message || "Failed to fetch vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [token]);

  // Add new vendor
  const handleAddVendor = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${backendUrl}/api/vendor/registerByAdmin`,
        { 
          email, 
          phone, 
          password, 
          category,
          bankAccountName,
          bankAccountNumber,
          bankCode,
          businessAddress,
          packageName
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Vendor added successfully");
        setShowAddModal(false);
        resetForm();
        fetchVendors();
      }
    } catch (error) {
      console.error("Error adding vendor:", error);
      toast.error(error.response?.data?.message || "Failed to add vendor");
    }
  };

  // Edit vendor
  const handleEditVendor = async (e) => {
    e.preventDefault();
    try {
      const updateData = { 
        email, 
        phone, 
        category, 
        isVerified,
        bankAccountName,
        bankAccountNumber,
        bankCode,
        businessAddress,
        packageName
      };
      if (password) updateData.password = password;

      const res = await axios.put(
        `${backendUrl}/api/vendor/${selectedVendor._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Vendor updated successfully");
        setShowEditModal(false);
        resetForm();
        fetchVendors();
      }
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast.error(error.response?.data?.message || "Failed to update vendor");
    }
  };

  // Delete vendor
  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vendor?")) return;

    try {
      const res = await axios.delete(`${backendUrl}/api/vendor/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Vendor deleted successfully");
        fetchVendors();
      }
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error(error.response?.data?.message || "Failed to delete vendor");
    }
  };

  // Open edit modal
  const openEditModal = (vendor) => {
    setSelectedVendor(vendor);
    setEmail(vendor.email);
    setPhone(vendor.phone || "");
    setCategory(vendor.category);
    setIsVerified(vendor.isVerified);
    setBankAccountName(vendor.bankAccountName || "");
    setBankAccountNumber(vendor.bankAccountNumber || "");
    setBankCode(vendor.bankCode || "");
    setBusinessAddress(vendor.businessAddress || "");
    setPackageName(vendor.packageName || "");
    setPassword("");
    setShowEditModal(true);
  };

  // Open detail modal
  const openDetailModal = async (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailModal(true);
    setDetailLoading(true);
    
    try {
      const res = await axios.get(`${backendUrl}/api/vendor/details/${vendor._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        setVendorDetails(res.data);
      }
    } catch (error) {
      console.error("Error fetching vendor details:", error);
      toast.error("Failed to fetch vendor details");
    } finally {
      setDetailLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setEmail("");
    setPhone("");
    setPassword("");
    setCategory("stays");
    setIsVerified(true);
    setBankAccountName("");
    setBankAccountNumber("");
    setBankCode("");
    setBusinessAddress("");
    setPackageName("");
    setSelectedVendor(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Vendor Management</h1>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + Add Vendor
        </button>
      </div>

      {/* Vendors Table */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : vendors.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No vendors found</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Category
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Verified
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                  Created At
                </th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor, index) => (
                <tr key={vendor._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">{index + 1}</td>
                  <td className="px-4 py-3 text-sm">{vendor.email}</td>
                  <td className="px-4 py-3 text-sm">{vendor.phone || "-"}</td>
                  <td className="px-4 py-3 text-sm capitalize">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        vendor.category === "stays"
                          ? "bg-green-100 text-green-700"
                          : vendor.category === "ontrip"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {vendor.category.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        vendor.isVerified
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {vendor.isVerified ? "Yes" : "No"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {formatDate(vendor.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => openDetailModal(vendor)}
                      className="bg-indigo-500 text-white px-3 py-1 rounded mr-2 hover:bg-indigo-600 transition text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => openEditModal(vendor)}
                      className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600 transition text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm"
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

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add New Vendor</h2>
            <form onSubmit={handleAddVendor}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="vendor@example.com"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter business address"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stay/Vehicle Package Name
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Gold Package, Premium Villa Package"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account Name
                </label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Account holder name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Account number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Code / Swift Code
                </label>
                <input
                  type="text"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Bank code or swift code"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                >
                  Add Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Vendor Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Vendor</h2>
            <form onSubmit={handleEditVendor}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91 9876543210"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new password"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Verified
                  </span>
                </label>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Address
                </label>
                <input
                  type="text"
                  value={businessAddress}
                  onChange={(e) => setBusinessAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter business address"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stay/Vehicle Package Name
                </label>
                <input
                  type="text"
                  value={packageName}
                  onChange={(e) => setPackageName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Gold Package, Premium Villa Package"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account Name
                </label>
                <input
                  type="text"
                  value={bankAccountName}
                  onChange={(e) => setBankAccountName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Account holder name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={bankAccountNumber}
                  onChange={(e) => setBankAccountNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Account number"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Code / Swift Code
                </label>
                <input
                  type="text"
                  value={bankCode}
                  onChange={(e) => setBankCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Bank code or swift code"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Update Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vendor Detail Modal */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Vendor Details</h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setVendorDetails(null);
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {detailLoading ? (
              <div className="text-center py-10">Loading vendor details...</div>
            ) : vendorDetails ? (
              <div>
                {/* Vendor Info Card */}
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-indigo-600">
                        {vendorDetails.vendor?.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{vendorDetails.vendor?.email}</h3>
                      <p className="text-indigo-100">📞 {vendorDetails.vendor?.phone || "No phone"}</p>
                      <p className="text-indigo-100 capitalize">
                        Category: {vendorDetails.vendor?.category?.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-indigo-100">Phone</p>
                      <p className="text-lg font-semibold">
                        {vendorDetails.vendor?.phone || "-"}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-indigo-100">Status</p>
                      <p className="text-lg font-semibold">
                        {vendorDetails.vendor?.isVerified ? "✅ Verified" : "❌ Not Verified"}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-indigo-100">Created</p>
                      <p className="text-lg font-semibold">
                        {formatDate(vendorDetails.vendor?.createdAt)}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-indigo-100">Updated</p>
                      <p className="text-lg font-semibold">
                        {formatDate(vendorDetails.vendor?.updatedAt)}
                      </p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                      <p className="text-sm text-indigo-100">Vendor ID</p>
                      <p className="text-xs font-mono truncate">{vendorDetails.vendor?._id}</p>
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-green-600">{vendorDetails.stats?.totalStays || 0}</p>
                    <p className="text-sm text-green-700">Stays</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-blue-600">{vendorDetails.stats?.totalTravelPlaces || 0}</p>
                    <p className="text-sm text-blue-700">Travel Places</p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-purple-600">{vendorDetails.stats?.totalVehicles || 0}</p>
                    <p className="text-sm text-purple-700">Vehicles</p>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
                    <p className="text-3xl font-bold text-orange-600">{vendorDetails.stats?.totalListings || 0}</p>
                    <p className="text-sm text-orange-700">Total Listings</p>
                  </div>
                </div>

                {/* Listings Sections */}
                {/* Stays */}
                {vendorDetails.listings?.stays?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                      Stays ({vendorDetails.listings.stays.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vendorDetails.listings.stays.map((stay) => (
                        <div key={stay._id} className="border rounded-lg p-4 hover:shadow-md transition">
                          {stay.images?.[0] && (
                            <img
                              src={stay.images[0]}
                              alt={stay.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h5 className="font-semibold text-gray-800">{stay.name}</h5>
                          <p className="text-sm text-gray-500">{stay.location}</p>
                          <p className="text-sm text-green-600 font-medium">Rs.{stay.price}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Travel Places */}
                {vendorDetails.listings?.travelPlaces?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                      Travel Places ({vendorDetails.listings.travelPlaces.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vendorDetails.listings.travelPlaces.map((place) => (
                        <div key={place._id} className="border rounded-lg p-4 hover:shadow-md transition">
                          {place.images?.[0] && (
                            <img
                              src={place.images[0]}
                              alt={place.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h5 className="font-semibold text-gray-800">{place.name}</h5>
                          <p className="text-sm text-gray-500">{place.location}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Vehicles */}
                {vendorDetails.listings?.vehicles?.length > 0 && (
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
                      Vehicles ({vendorDetails.listings.vehicles.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {vendorDetails.listings.vehicles.map((vehicle) => (
                        <div key={vehicle._id} className="border rounded-lg p-4 hover:shadow-md transition">
                          {vehicle.images?.[0] && (
                            <img
                              src={vehicle.images[0]}
                              alt={vehicle.name}
                              className="w-full h-32 object-cover rounded-lg mb-3"
                            />
                          )}
                          <h5 className="font-semibold text-gray-800">{vehicle.name}</h5>
                          <p className="text-sm text-gray-500">{vehicle.type}</p>
                          <p className="text-sm text-purple-600 font-medium">Rs.{vehicle.pricePerDay}/day</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Listings Message */}
                {vendorDetails.stats?.totalListings === 0 && (
                  <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">
                    <p className="text-lg">No listings found for this vendor</p>
                    <p className="text-sm">This vendor hasn't added any properties yet.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">Failed to load vendor details</div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setVendorDetails(null);
                }}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorManage;
