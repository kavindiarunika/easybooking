import { addVehicle, getVehicleProfile, updateVehicle, getAllVehicles } from "../controller/vehicleController.js";
import express from "express";
import upload from "../middleware/multer.js";

const vehicleRouter = express.Router();

const vehicleField = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "otherImages", maxCount: 10 },
]);

import verifyToken from "../middleware/verifyToken.js";
vehicleRouter.post("/addvehicle", vehicleField, verifyToken, addVehicle);
vehicleRouter.get("/profile", verifyToken, getVehicleProfile);
vehicleRouter.put("/update/:id", vehicleField, verifyToken, updateVehicle);
vehicleRouter.get("/all", getAllVehicles);

export default vehicleRouter;
