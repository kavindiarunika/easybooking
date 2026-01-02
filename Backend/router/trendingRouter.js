import express from "express";
import {
  addtrending,
  deleteTrendingByName,
  updateTrendingById,
  sendBooking,
} from "../controller/trendingController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";
import TrendingModel from "../schema/trendingScehema.js";

const trendrouter = express.Router();


const trendinguploadField = upload.fields([
  { name: "mainImage", maxCount: 1 }, // new: separate main image
  { name: "images", maxCount: 50 }, // new: multiple additional images
  { name: "image", maxCount: 1 }, // legacy
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
  { name: "image5", maxCount: 1 },
  { name: "image6", maxCount: 1 },
]);

// ➕ Add new trending item (admin only)
trendrouter.post("/add", trendinguploadField, addtrending);

// ➖ Delete trending item by name
trendrouter.delete("/delete/:name", verifyToken, deleteTrendingByName);
// ➕ Update trending item by ID (admin only) — supports multipart/form-data for images
trendrouter.put(
  "/update/:id",
  verifyToken,
  trendinguploadField,
  updateTrendingById
);
trendrouter.post("/sendbooking", sendBooking);

// 📦 Get all trending items
trendrouter.get("/trenddata", async (req, res) => {
  try {
    const trends = await TrendingModel.find();
   
    res.json(trends);
  } catch (err) {
    console.error("Error fetching trending data:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default trendrouter;
