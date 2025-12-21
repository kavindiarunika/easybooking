import TravelPlace from "../schema/travelingSchema.js";
import path from "path";
import fs from "fs";
import cloudinary from "../cloudinary/cloudinary.js";

/* ================= Helper: upload file to Cloudinary and remove local file ================= */
const uploadToCloudinary = async (file, folder = "travelplaces") => {
  if (!file) return null;
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "image",
      folder: folder,
    });

    // Remove the local file after successful upload
    try {
      fs.unlink(file.path, (err) => {
        if (err) console.warn("Failed to remove local uploaded file:", err);
      });
    } catch (e) {
      console.warn("Cleanup failed:", e);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);

    // Try to remove local file even if upload failed
    try {
      fs.unlink(file.path, (err) => {
        if (err)
          console.warn(
            "Failed to remove local uploaded file after failure:",
            err
          );
      });
    } catch (e) {
      console.warn("Cleanup failed:", e);
    }

    return null;
  }
};

/* ================= CREATE ================= */
export const createTravelPlace = async (req, res) => {
  try {
    const { name, description, district } = req.body;

    const mainImageFile = req.files?.mainImage?.[0];
    const imageFiles = req.files?.images || [];

    if (!name || !district || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!mainImageFile) {
      return res.status(400).json({ message: "Main image missing" });
    }

    // Upload main image to Cloudinary
    const mainImageUrl = await uploadToCloudinary(
      mainImageFile,
      "travelplaces/main"
    );
    if (!mainImageUrl) {
      return res.status(500).json({ message: "Failed to upload main image" });
    }

    // Upload gallery images (if any)
    const uploadedImageUrls = await Promise.all(
      imageFiles.map((f) => uploadToCloudinary(f, "travelplaces/gallery"))
    );

    const newTravelPlace = new TravelPlace({
      name,
      description,
      district,
      mainImage: mainImageUrl,
      images: (uploadedImageUrls || []).filter(Boolean),
    });

    await newTravelPlace.save();

    res.status(201).json({
      message: "Travel place created successfully",
      travelPlace: newTravelPlace,
    });
  } catch (error) {
    console.error("Create travel place error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* ================= READ ================= */
export const getTravelPlaces = async (req, res) => {
  try {
    const places = await TravelPlace.find().sort({ createdAt: -1 }).lean();

    // Keep backward compatibility: if stored value is a filename (legacy), prefix with /uploads
    const transformed = places.map((p) => ({
      ...p,
      mainImage: p.mainImage
        ? p.mainImage.toString().startsWith("http")
          ? p.mainImage
          : `/uploads/${p.mainImage}`
        : null,
      images: (p.images || []).map((img) =>
        img.toString().startsWith("http") ? img : `/uploads/${img}`
      ),
    }));

    res.status(200).json({ travelPlaces: transformed });
  } catch (error) {
    console.error("Fetch travel places error:", error);
    res.status(500).json({ message: "Failed to fetch travel places" });
  }
};
