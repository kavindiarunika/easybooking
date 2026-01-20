import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { MdDelete } from "react-icons/md";

const AdsUpdate = () => {
  const [ads, setAds] = useState(null);
  const [homeAds, setHomeAds] = useState([]);
  const [villaAds, setVillaAds] = useState([]);
  const [goTripAds, setGoTripAds] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch existing ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/ads/getads`);
        setAds(response.data);
      } catch (error) {
        toast.error("Failed to load ads");
      }
    };
    fetchAds();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    homeAds.forEach((file) => data.append("homeAd", file));
    villaAds.forEach((file) => data.append("villaad", file));
    goTripAds.forEach((file) => data.append("goTripAd", file));

    try {
      setLoading(true);
      toast.loading("Updating ads...");

      // If ads exist, update them; otherwise create new ones
      if (ads && ads._id) {
        await axios.patch(`${backendUrl}/api/ads/updateads/${ads._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Create new ads if they don't exist
        await axios.post(`${backendUrl}/api/ads/addads`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.dismiss();
      toast.success("Ads updated successfully!");

      // Refresh ads
      const response = await axios.get(`${backendUrl}/api/ads/getads`);
      setAds(response.data);

      setHomeAds([]);
      setVillaAds([]);
      setGoTripAds([]);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to update ads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete individual ad
  const handleDelete = async (adId, type, index) => {
    try {
      await axios.delete(
        `${backendUrl}/api/ads/deleteads/${adId}?type=${type}`,
      );
      toast.success("Ad deleted successfully");

      // Remove deleted ad from state
      setAds((prev) => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index),
      }));
    } catch (error) {
      toast.error("Failed to delete ad");
    }
  };

  // Reusable component to render ads for each category
  const AdSection = ({ title, type }) => (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {ads?.[type]?.length > 0 ? (
          ads[type].map((item, index) => (
            <div
              key={index}
              className="relative rounded-lg overflow-hidden shadow-md bg-white/70"
            >
              {/* Delete icon */}
              <MdDelete
                onClick={() => handleDelete(item._id, type, index)}
                className="absolute top-2 right-2 z-10 text-red-600 text-xl hover:text-red-800 cursor-pointer transition-all duration-200"
              />

              {/* Media */}
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  crossOrigin="anonymous"
                  className="w-full h-[150px] object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={`${title} Ad`}
                  crossOrigin="anonymous"
                  className="w-full h-[150px] object-cover"
                />
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No {title} available</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Current Ads Display */}
        {ads && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Current Ads</h2>
            <AdSection title="Home Page Ads" type="homeAd" />
            <AdSection title="Villa/Stay Ads" type="villaad" />
            <AdSection title="GoTrip/Safari Ads" type="goTripAd" />
          </div>
        )}

        {/* Update Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Update Ads</h2>

          {/* Home Ads Upload */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">
              Home Page Ads (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setHomeAds(Array.from(e.target.files))}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 focus:border-green-500 focus:outline-none"
            />
            {homeAds.length > 0 && (
              <p className="text-sm text-green-600">
                {homeAds.length} file(s) selected
              </p>
            )}
          </div>

          {/* Villa Ads Upload */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">
              Villa/Stay Ads (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setVillaAds(Array.from(e.target.files))}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 focus:border-green-500 focus:outline-none"
            />
            {villaAds.length > 0 && (
              <p className="text-sm text-green-600">
                {villaAds.length} file(s) selected
              </p>
            )}
          </div>

          {/* GoTrip Ads Upload */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">
              GoTrip/Safari Ads (Optional)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setGoTripAds(Array.from(e.target.files))}
              className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 focus:border-green-500 focus:outline-none"
            />
            {goTripAds.length > 0 && (
              <p className="text-sm text-green-600">
                {goTripAds.length} file(s) selected
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              loading ||
              (!homeAds.length && !villaAds.length && !goTripAds.length)
            }
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Advertisements"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdsUpdate;
