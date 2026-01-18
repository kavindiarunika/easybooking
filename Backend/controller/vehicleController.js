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
    res.status(201).json({ success: true, message: "Vehicle added successfully", data: vehicleData });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get vehicle profile by owner email
export const getVehicleProfile = async (req, res) => {
  try {
    const { ownerEmail } = req.query;
    if (!ownerEmail) {
      return res.status(400).json({ message: "Owner email is required" });
    }

    const vehicleProfile = await vehicle.findOne({ ownerEmail });
    if (!vehicleProfile) {
      return res.status(404).json({ message: "No vehicle found for this owner" });
    }

    res.status(200).json(vehicleProfile);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Update vehicle
export const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      Price,
      type,
      description,
      discrict,
      passagngers,
      facilities,
      whatsapp,
    } = req.body;

    const existingVehicle = await vehicle.findById(id);
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Update fields
    existingVehicle.name = name || existingVehicle.name;
    existingVehicle.Price = Price || existingVehicle.Price;
    existingVehicle.type = type || existingVehicle.type;
    existingVehicle.description = description || existingVehicle.description;
    existingVehicle.discrict = discrict || existingVehicle.discrict;
    existingVehicle.passagngers = passagngers || existingVehicle.passagngers;
    existingVehicle.whatsapp = whatsapp || existingVehicle.whatsapp;

    if (facilities) {
      existingVehicle.facilities = facilities.split(",").map((f) => f.trim());
    }

    // Handle image uploads
    if (req.files?.mainImage) {
      existingVehicle.mainImage = await uploadImage(req.files.mainImage[0], "vehicle/main");
    }

    if (req.files?.otherImages) {
      const otherImages = await Promise.all(
        req.files.otherImages.map((img) => uploadImage(img, "vehicle/other"))
      );
      existingVehicle.otherImages = otherImages;
    }

    await existingVehicle.save();
    res.status(200).json({ success: true, message: "Vehicle updated successfully", data: existingVehicle });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await vehicle.find();
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
