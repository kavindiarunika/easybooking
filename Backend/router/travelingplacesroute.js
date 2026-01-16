import {
  createTravelPlace,
  getTravelPlaces,
  deleteTravelPlace,
} from "../controller/travelController.js";
import express from "express";
import upload from "../middleware/multer.js";

const travelingplacesroute = express.Router();

const travelingPlace = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "otherimages", maxCount: 10 },
]);

// Create
import verifyToken from "../middleware/verifyToken.js";
travelingplacesroute.post(
  "/addtravelplace",
  travelingPlace,
  verifyToken,
  createTravelPlace
);

// Read (list)
travelingplacesroute.get("/", getTravelPlaces);

//delete
travelingplacesroute.delete("/delete", deleteTravelPlace);

// Temporary debug route to echo DELETE requests and headers (for diagnosing 404/CORS)
travelingplacesroute.delete("/debug", (req, res) => {
  console.log("Debug delete received on /api/travelplaces/debug", {
    headers: req.headers,
    body: req.body,
    method: req.method,
    path: req.path,
  });

  res.status(200).json({
    message: "debug delete received",
    path: req.path,
    method: req.method,
    headers: req.headers,
    body: req.body,
  });
});

export default travelingplacesroute;
