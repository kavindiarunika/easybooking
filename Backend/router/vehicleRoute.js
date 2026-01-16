import { addVehicle } from "../controller/vehicleController.js";
import express from "express";
import upload from "../middleware/multer.js";

const vehicleRouter = express.Router();

const vehicleField = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "otherImages", maxCount: 10 },
]);

import verifyToken from "../middleware/verifyToken.js";
vehicleRouter.post("/addvehicle", vehicleField, verifyToken, addVehicle);

export default vehicleRouter;
