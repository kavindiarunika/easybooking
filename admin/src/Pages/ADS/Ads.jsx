import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";

const Ads = () => {
  const [homeAds, setHomeAds] = useState([]);
  const [villaAds, setVillaAds] = useState([]);
  const [goTripAds, setGoTripAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
   

    const data = new FormData();
    homeAds.forEach(file => data.append("homeAd", file));
    villaAds.forEach(file => data.append("villaad", file));
    goTripAds.forEach(file => data.append("goTripAd", file));

    try {
      setLoading(true);
      toast.loading("Uploading ads...");

      await axios.post(`${backendUrl}/api/ads/addads`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.dismiss();
      toast.success("Ads uploaded successfully!");

      setHomeAds([]);
      setVillaAds([]);
      setGoTripAds([]);
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload ads. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Advertisement Upload
        </h1>

        {/* Home Ads */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            Home Page Ads
          </label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setHomeAds(Array.from(e.target.files))
            }
            className="w-full border rounded-lg p-2"
          />
          {homeAds.length > 0 && (
            <p className="text-sm text-gray-500">
              {homeAds.length} file(s) selected
            </p>
          )}
        </div>

        {/* Safari Ads */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            Safari / Trip Ads
          </label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setGoTripAds(Array.from(e.target.files))
            }
            className="w-full border rounded-lg p-2"
          />
          {goTripAds.length > 0 && (
            <p className="text-sm text-gray-500">
              {goTripAds.length} file(s) selected
            </p>
          )}
        </div>

        {/* Stay Ads */}
        <div className="space-y-2">
          <label className="font-medium text-gray-700">
            Stay / Villa Ads
          </label>
          <input
            type="file"
            multiple
            onChange={(e) =>
              setVillaAds(Array.from(e.target.files))
            }
            className="w-full border rounded-lg p-2"
          />
          {villaAds.length > 0 && (
            <p className="text-sm text-gray-500">
              {villaAds.length} file(s) selected
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload Advertisements"}
        </button>
      </form>
    </div>
  );
};

export default Ads;
