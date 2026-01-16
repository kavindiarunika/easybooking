import express from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  createSfari,
  updateSafari,
  getAllsafari,
  getSafariById,
  deleteSafari,
  searchSafari,
  getSafariByEmail,
} from "../controller/safariController.js";
import upload from "../middleware/multer.js";

const safariRouter = express.Router();

const uplodImage = upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "otherimages", maxCount: 10 },
  { name: "shortvideo", maxCount: 1 },
  { name: "vehicleImage", maxCount: 10 },
  { name: "GuiderImage", maxCount: 1 },
]);

safariRouter.get("/search", searchSafari);
safariRouter.get("/safari", getSafariByEmail);

safariRouter.post("/addsafari", uplodImage, verifyToken, createSfari);
safariRouter.get("/allsafari", getAllsafari);
safariRouter.get("/safari/:id", getSafariById);
safariRouter.put("/updatesafari/:id", uplodImage, updateSafari);
safariRouter.delete("/deletesafari/:id", deleteSafari);

export default safariRouter;
