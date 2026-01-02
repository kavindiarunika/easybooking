import express from "express";
import {
  createSfari,
  updateSafari,
  getAllsafari,
  getSafariById,
} from "../controller/safariController.js";
import upload from "../middleware/multer.js";

const safariRouter = express.Router();

const uplodImage = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "shortvideo", maxCount: 1 },
  { name: "vehicleImage", maxCount: 10 },
  { name: "GuiderImage", maxCount: 1 },
]);

safariRouter.post("/addsafari", uplodImage, createSfari);
safariRouter.get("/allsafari", getAllsafari);
// Get single safari by id
safariRouter.get("/safari/:id", getSafariById);
safariRouter.put("/updatesafari/:id", uplodImage, updateSafari);

export default safariRouter;
