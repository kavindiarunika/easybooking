import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../../App";
import { safa } from "../../assets/safari";

const EditSafari = ({ safariId: propSafariId }) => {
  const { id: paramId } = useParams();
  const safariId = propSafariId || paramId;

  const [safariData, setSafariData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    type: [],
    adventures: [],
    includeplaces: [],
    TeamMembers: "",
    whatsapp: "",
    totalDays: "",
    email: "",
    VehicleType: "",
    GuiderName: "",
    GuiderExperience: "",
  });

  const [mainImage, setMainImage] = useState(null);
  const [otherimages, setOtherimages] = useState([]);
  const [vehicleImages, setVehicleImages] = useState([]);
  const [guiderImage, setGuiderImage] = useState(null);
  const [shortVideo, setShortVideo] = useState(null);
  const [categoryType, setCategoryType] = useState("");

  useEffect(() => {
    if (!safariId) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/safari/safari/${safariId}`
        );

        setSafariData({
          name: response.data.name || "",
          description: response.data.description || "",
          price: response.data.price || "",
          category: response.data.category || "",
          type: response.data.type || [],
          adventures: response.data.adventures || [],
          includeplaces: response.data.includeplaces || [],
          TeamMembers: response.data.TeamMembers || "",
          whatsapp: response.data.whatsapp || "",
          totalDays: response.data.totalDays || "",
          email: response.data.email || "",
          VehicleType: response.data.VehicleType || "",
          GuiderName: response.data.GuiderName || "",
          GuiderExperience: response.data.GuiderExperience || "",
        });
        setCategoryType(response.data.category || "");
      } catch (error) {
        toast.error("Error fetching safari data");
      }
    };

    fetchData();
  }, [safariId]);

  const handledata = (e) => {
    setSafariData({ ...safariData, [e.target.name]: e.target.value });
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;

    setSafariData({
      ...safariData,
      [name]: value
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item),
    });
  };

  const handleTypeChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSafariData({ ...safariData, type: [...safariData.type, value] });
    } else {
      setSafariData({
        ...safariData,
        type: safariData.type.filter((t) => t !== value),
      });
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryType(e.target.value);
    setSafariData({ ...safariData, category: e.target.value, type: [] });
  };
  const handlesumbit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("name", safariData.name);
    data.append("description", safariData.description);
    data.append("price", safariData.price);
    data.append("category", safariData.category);
    data.append("TeamMembers", safariData.TeamMembers);
    data.append("whatsapp", safariData.whatsapp);
    data.append("totalDays", safariData.totalDays);
    data.append("email", safariData.email);
    data.append("vehicleType", safariData.VehicleType);
    data.append("guiderName", safariData.GuiderName);
    data.append("guiderExperience", safariData.GuiderExperience);

    safariData.adventures.forEach((item) => data.append("adventures", item));
    safariData.includeplaces.forEach((item) =>
      data.append("includeplaces", item)
    );
    safariData.type.forEach((t) => data.append("type", t));

    if (mainImage) data.append("mainImage", mainImage);
    if (guiderImage) data.append("guiderImage", guiderImage);
    if (shortVideo) data.append("shortvideo", shortVideo);
    vehicleImages.forEach((item) => data.append("vehicleimage", item));
    otherimages.forEach((item) => data.append("otherimages", item));

    try {
      toast.loading("uploading safari details");
      await axios.put(
        `${backendUrl}/api/safari/updatesafari/${safariId || paramId}`,
        data
      );
      toast.dismiss();
      toast.success("update successfully");
    } catch (error) {
      toast.error("error occur");
    }
  };
  return (
    <div className="">
      <p className="text-black text-xl mb-4">Edit Safari package</p>

      <form onSubmit={handlesumbit}>
        <div className="grid grid-cols-2 gap-4">
          {/*---------------------name---------------- */}
          <div>
            <label>plackage name:</label>
            <input
              type="text"
              name="name"
              value={safariData.name}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------description--------------- */}
          <div>
            <label>description:</label>
            <input
              type="text"
              name="description"
              value={safariData.description}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------description--------------- */}
          <div>
            <label>Price:</label>
            <input
              type="text"
              name="price"
              value={safariData.price}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          {/* Category and Type Selection */}
          <div className="col-span-2">
            <label>Category:</label>
            <select
              name="category"
              value={safariData.category}
              onChange={handleCategoryChange}
              className="w-full md:w-64 h-12 px-4 border-2 border-slate-300 rounded-xl text-black"
            >
              <option value="">Select a category</option>
              {Object.keys(safa).map((key) => (
                <option key={key} value={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Type Checkboxes */}
          {safariData.category && safa[safariData.category]?.type && (
            <div className="col-span-2">
              <label className="block text-gray-700 font-medium mb-3">
                Select Types:
              </label>
              <div className="flex flex-wrap gap-3">
                {safa[safariData.category].type.map((t, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      value={t}
                      checked={safariData.type.includes(t)}
                      onChange={handleTypeChange}
                      className="accent-blue-500"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>
          )}
          {/*---------------description--------------- */}
          <div>
            <label>TeamMembers:</label>
            <input
              type="number"
              name="TeamMembers"
              value={safariData.TeamMembers}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------whatsapp--------------- */}
          <div>
            <label>whatsapp:</label>
            <input
              type="text"
              name="whatsapp"
              value={safariData.whatsapp}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------totaldays--------------- */}
          <div>
            <label>totalDays:</label>
            <input
              type="number"
              name="totalDays"
              value={safariData.totalDays}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------email--------------- */}
          <div>
            <label>email:</label>
            <input
              type="email"
              name="email"
              value={safariData.email}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------email--------------- */}
          <div>
            <label>email:</label>
            <input
              type="email"
              name="email"
              value={safariData.email}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------vehicleType--------------- */}
          <div>
            <label>vehicleType:</label>
            <select 
              name="VehicleType"
              value={safariData.VehicleType}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            >
              <option value="Car">Car</option>
              <option value="SUV">SUV</option>
              <option value="Jeep">Jeep</option>
              <option value="Van">Van</option>
              <option value="MiniBus">Mini Bus</option>
              <option value="Bus">Bus</option>
              <option value="Pickup">Pickup Truck</option>
              <option value="Truck">Truck</option>

              {/* Two / Three Wheel */}
              <option value="Motorbike">Motorbike</option>
              <option value="Scooter">Scooter</option>
              <option value="Bicycle">Bicycle</option>
              <option value="ElectricBike">Electric Bike</option>
              <option value="TukTuk">Tuk Tuk</option>
              <option value="ATV">ATV / Quad Bike</option>

              {/* Water Vehicles */}
              <option value="Boat">Boat</option>
              <option value="SpeedBoat">Speed Boat</option>
              <option value="JetSki">Jet Ski</option>
              <option value="Canoe">Canoe</option>
              <option value="Kayak">Kayak</option>
              <option value="Yacht">Yacht</option>

              {/* Special / Travel Use */}
              <option value="SafariJeep">Safari Jeep</option>
              <option value="CamperVan">Camper Van</option>
              <option value="Caravan">Caravan</option>
              <option value="LuxuryCar">Luxury Car</option>
              <option value="OffRoad">Off Road Vehicle</option>

              {/* Air (optional – only if you plan to support later) */}
              <option value="Helicopter">Helicopter</option>
              <option value="HotAirBalloon">Hot Air Balloon</option>
            </select>
          </div>
          {/*---------------guidername----------------- */}
          <div>
            <label>guiderName:</label>
            <input
              type="text"
              name="guiderName"
              value={safariData.GuiderName}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
          {/*---------------guiderExperience------------------- */}
          <div className="mt-4">
            <label>guiderExperience:</label>
            <input
              type="number"
              name="guiderExperience"
              value={safariData.GuiderExperience}
              onChange={handledata}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
        </div>
        {/*---------------------adventure--------------------- */}
        <div className="mt-4">
          <label>Adventures(comma separate)</label>
          <input
            type="text"
            name="adventures"
            value={safariData.adventures.join(",")}
            onChange={handleArrayChange}
            placeholder="e.g. Jeep Safari, Trekking, Bird Watching"
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>
        {/*---------------------includeplaces--------------------- */}
        <div>
          <label>includeplaces(comma separate)</label>
          <input
            type="text"
            name="includeplaces"
            value={safariData.includeplaces.join(",")}
            onChange={handleArrayChange}
            className="w-full p-3 border border-gray-300 rounded"
          />
        </div>

        <div className="mt-4 flex  flex-col gap-4">
          {/*----------------mainImage--------------- */}
          <div>
            <label>main Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files[0])}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          {/*----------------other images------------- */}
          <div>
            <label>Onther images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setOtherimages(Array.from(e.target.files))}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          {/*----------------vehicleimage--------------- */}
          <div>
            <label>vehicleimage:</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={() => setVehicleImages(Array.from(e.target.files))}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>

          {/*--------------------------guiderImage------ */}
          <div>
            <label>guiderImage</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setGuiderImage(Array.from(e.target.files))}
              className="w-full p-3 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="md:col-span-2 text-center">
          <button
            type="submit"
            className="mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
          >
            Update Safari Package
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditSafari;
