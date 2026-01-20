import express from "express";
import upload from "../middleware/multer.js";
import {
  addads,
  getAds,
  deleteAds,
  updateAds,
} from "../controller/AdsController.js";

const adsRouter = express.Router();

adsRouter.post(
  "/addads",
  upload.fields([
    { name: "villaad", maxCount: 5 },
    { name: "homeAd", maxCount: 5 },
    { name: "goTripAd", maxCount: 5 },
  ]),
  addads,
);

adsRouter.patch(
  "/updateads/:id",
  upload.fields([
    { name: "villaad", maxCount: 5 },
    { name: "homeAd", maxCount: 5 },
    { name: "goTripAd", maxCount: 5 },
  ]),
  updateAds,
);

adsRouter.get("/getads", getAds);
adsRouter.delete("/deleteads/:id", deleteAds);
export default adsRouter;
