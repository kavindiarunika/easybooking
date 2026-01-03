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
  { name: "otherimages", maxCount: 50 }, // new: multiple additional images (standardized)

  { name: "image", maxCount: 1 }, // legacy
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

// Safe wrapper around multer to capture and log Multer errors (helps debug unexpected fields)
const trendingUploadMiddleware = (req, res, next) => {
  // Log content-type to help diagnose unexpected fields
  console.log(
    "Incoming trending upload content-type:",
    req.headers["content-type"]
  );
  trendinguploadField(req, res, (err) => {
    if (err) {
      console.error("Multer error on trending upload:", err);
      console.error("req.body keys:", Object.keys(req.body || {}));
      // Also try to parse the raw header boundary for extra debugging
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

// ➕ Add new trending item (admin only)
trendrouter.post("/add", trendingUploadMiddleware, addtrending);

// ➖ Delete trending item by name
trendrouter.delete("/delete/:name", verifyToken, deleteTrendingByName);
// ➕ Update trending item by ID (admin only) — supports multipart/form-data for images
trendrouter.put(
  "/update/:id",
  verifyToken,
  trendingUploadMiddleware,
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
