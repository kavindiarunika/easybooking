import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { MdDelete } from "react-icons/md";
import { IoAdd } from "react-icons/io5";

const AdsUpdate = () => {
  const [ads, setAds] = useState(null);
  const [homeAdsPreviews, setHomeAdsPreviews] = useState([
    null,
    null,
    null,
    null,
  ]);
  const [homeAdsFiles, setHomeAdsFiles] = useState([null, null, null, null]);
  const [villaAdsPreviews, setVillaAdsPreviews] = useState([null, null]);
  const [villaAdsFiles, setVillaAdsFiles] = useState([null, null]);
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
    homeAdsFiles.forEach((file) => {
      if (file) data.append("homeAd", file);
    });
    villaAdsFiles.forEach((file) => {
      if (file) data.append("villaad", file);
    });
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

      setHomeAdsPreviews([null, null, null, null]);
      setHomeAdsFiles([null, null, null, null]);
      setVillaAdsPreviews([null, null]);
      setVillaAdsFiles([null, null]);
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

  // Handle individual home ad file selection
  const handleHomeAdChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPreviews = [...homeAdsPreviews];
        newPreviews[index] = event.target.result;
        setHomeAdsPreviews(newPreviews);
      };
      reader.readAsDataURL(file);

      const newFiles = [...homeAdsFiles];
      newFiles[index] = file;
      setHomeAdsFiles(newFiles);
    }
  };

  // Handle remove home ad
  const handleRemoveHomeAd = (index) => {
    const newPreviews = [...homeAdsPreviews];
    const newFiles = [...homeAdsFiles];
    newPreviews[index] = null;
    newFiles[index] = null;
    setHomeAdsPreviews(newPreviews);
    setHomeAdsFiles(newFiles);
  };

  // Handle individual villa ad file selection
  const handleVillaAdChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPreviews = [...villaAdsPreviews];
        newPreviews[index] = event.target.result;
        setVillaAdsPreviews(newPreviews);
      };
      reader.readAsDataURL(file);

      const newFiles = [...villaAdsFiles];
      newFiles[index] = file;
      setVillaAdsFiles(newFiles);
    }
  };

  // Handle remove villa ad
  const handleRemoveVillaAd = (index) => {
    const newPreviews = [...villaAdsPreviews];
    const newFiles = [...villaAdsFiles];
    newPreviews[index] = null;
    newFiles[index] = null;
    setVillaAdsPreviews(newPreviews);
    setVillaAdsFiles(newFiles);
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
        {/* Update Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg p-6 space-y-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">Update Ads</h2>

          {/* Home Ads Upload - 4 slots */}
          <div className="space-y-4">
            <label className="font-medium text-gray-700 block">
              Home Page Ads - Add Up to 4 Images/Videos (One by One)
            </label>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {homeAdsPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden"
                >
                  {preview ? (
                    <>
                      {preview.includes("data:video") ? (
                        <video
                          src={preview}
                          controls
                          className="w-full h-[150px] object-cover"
                        />
                      ) : (
                        <img
                          src={preview}
                          alt={`Ad ${index + 1}`}
                          className="w-full h-[150px] object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveHomeAd(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
                      >
                        <MdDelete size={20} />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-[150px] cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleHomeAdChange(index, e)}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <IoAdd size={32} className="text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">
                          Click to add Ad {index + 1}
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {homeAdsFiles.filter((f) => f !== null).length}/4 ads selected
            </p>
          </div>

          {/* Villa Ads Upload - 2 slots */}
          <div className="space-y-4">
            <label className="font-medium text-gray-700 block">
              Villa/Stay Ads - Add Up to 2 Images/Videos (One by One)
            </label>
            <div className="grid grid-cols-2 gap-4">
              {villaAdsPreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden"
                >
                  {preview ? (
                    <>
                      {preview.includes("data:video") ? (
                        <video
                          src={preview}
                          controls
                          className="w-full h-[150px] object-cover"
                        />
                      ) : (
                        <img
                          src={preview}
                          alt={`Villa Ad ${index + 1}`}
                          className="w-full h-[150px] object-cover"
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveVillaAd(index)}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
                      >
                        <MdDelete size={20} />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-[150px] cursor-pointer hover:bg-gray-100 transition">
                      <input
                        type="file"
                        accept="image/*,video/*"
                        onChange={(e) => handleVillaAdChange(index, e)}
                        className="hidden"
                      />
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <IoAdd size={32} className="text-gray-400 mb-2" />
                        <p className="text-xs text-gray-500">
                          Click to add Villa Ad {index + 1}
                        </p>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              {villaAdsFiles.filter((f) => f !== null).length}/2 ads selected
            </p>
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
              (!homeAdsFiles.some((f) => f !== null) &&
                !villaAdsFiles.some((f) => f !== null) &&
                !goTripAds.length)
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
