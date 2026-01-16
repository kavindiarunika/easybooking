import express from "express";
import jwt from "jsonwebtoken";
import {
  addtrending,
  deleteTrendingByName,
  updateTrendingById,
  sendBooking,
  patchTrending,
} from "../controller/trendingController.js";
import { getProfile } from "../controller/trendingQueryController.js";
import upload from "../middleware/multer.js";
import verifyToken from "../middleware/verifyToken.js";
import TrendingModel from "../schema/trendingScehema.js";

const trendrouter = express.Router();

const trendingUpload = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "otherimages", maxCount: 50 },
  { name: "image", maxCount: 1 },
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]);

const trendingUploadMiddleware = (req, res, next) => {
  trendingUpload(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "File upload error",
      });
    }
    next();
  });
};

trendrouter.post("/add", trendingUploadMiddleware, verifyToken, addtrending);

// GET single profile for a vendor (query or token-based)
trendrouter.get("/profile", getProfile);

trendrouter.delete("/delete/:name", verifyToken, deleteTrendingByName);

trendrouter.put(
  "/update/:id",
  verifyToken,
  trendingUploadMiddleware,
  updateTrendingById
);

trendrouter.post("/sendbooking", sendBooking);
trendrouter.patch("/updatetrending/:id", patchTrending);

trendrouter.get("/trenddata", async (req, res) => {
  try {
    const { paid } = req.query;

    let filter = {};

    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.role === "vendor" && decoded.email) {
          filter.ownerEmail = decoded.email;
        }
      } catch (error) {}
    }

    if (req.query.ownerEmail) {
      filter.ownerEmail = req.query.ownerEmail;
    }

    if (paid !== undefined) {
      filter.paid = paid === "true";
    }

    const trends = await TrendingModel.find(filter).lean();

    res.json(trends);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch trending items" });
  }
});

export default trendrouter;
