import express from "express";
import cloudinary from "../cloudinary/cloudinary.js";
import vehicle from "../schema/vehicleSchema.js";

const uploadImage = async (file, folder) => {
  if (!file) return null;

  const result = await cloudinary.uploader.upload(file.path, { folder });

  return result.secure_url;
};

export const addVehicle = async (req, res) => {
  try {
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const {
      name,
      Price,
      type,
      description,
      discrict,
      passagngers,
      facilities,
      whatsapp,
      ownerEmail: providedOwner,
    } = req.body;

    // Determine ownerEmail: vendor creates for self; admin may specify ownerEmail
    let ownerEmail = providedOwner;
    if (req.user.role === "vendor") {
      ownerEmail = req.user.email;
    }
    if (
      !name ||
      !Price ||
      !type ||
      !description ||
      !discrict ||
      !passagngers ||
      !facilities ||
      !whatsapp
    ) {
      return res.json({ message: "all fields are required" });
    }

    if (!req.files?.mainImage) {
      return res.status(400).json({ message: "main image is required" });
    }
    if (!req.files?.otherImages) {
      return res.status(400).json({ message: "other images are required" });
    }

    const mainImage = await uploadImage(req.files.mainImage[0], "vehicle/main");

    const otherImage = await Promise.all(
      req.files.otherImages.map((img) => uploadImage(img, "vehicle/other"))
    );
    const vehicleData = new vehicle({
      name,
      Price,
      type,
      description,
      discrict,
      passagngers,
      facilities: facilities.split(",").map((facil) => facil.trim()),
      mainImage: mainImage,
      otherImages: otherImage,
      whatsapp,
      ownerEmail,
    });

    await vehicleData.save();
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
