import {
  createTravelPlace,
  getTravelPlaces,
} from "../controller/travelController.js";
import express from "express";
import upload from "../middleware/multer.js";

const travelingplacesroute = express.Router();

const travelingPlace = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
]);

// Create
travelingplacesroute.post("/addtravelplace", travelingPlace, createTravelPlace);

// Read (list)
travelingplacesroute.get("/", getTravelPlaces);

export default travelingplacesroute;
