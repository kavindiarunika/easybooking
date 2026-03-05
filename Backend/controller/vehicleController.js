import express from "express";
import cloudinary from "../cloudinary/cloudinary.js";
import vehicle from "../schema/vehicleSchema.js";
import {
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinaryHelper.js";

const uploadImage = async (file, folder) => {
  if (!file) return null;
  // multer is configured to use memoryStorage, so the file buffer is
  // available on `file.buffer`. Use the helper which wraps upload_stream
  // to send buffers to Cloudinary.
  const result = await uploadToCloudinary(file.buffer, folder);
  return result;
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
      district,
      passagngers,
      facilities,
      whatsapp,
      ownerEmail: providedOwner,
    } = req.body;

    // Determine ownerEmail: default to authenticated user's email unless an admin explicitly
    // provided a different owner.
    let ownerEmail = providedOwner;
    if (
      !ownerEmail ||
      req.user.role === "vendor" ||
      req.user.role === "vehicle"
    ) {
      ownerEmail = req.user.email;
    }
    // normalize to lowercase to avoid case mismatch issues
    ownerEmail = ownerEmail.toLowerCase();
    if (
      !name ||
      !Price ||
      !type ||
      !description ||
      !district ||
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

    const mainImageData = await uploadImage(
      req.files.mainImage[0],
      "vehicle/main",
    );

    const otherImagesData = await Promise.all(
      req.files.otherImages.map((img) => uploadImage(img, "vehicle/other")),
    );

    const vehicleData = new vehicle({
      name,
      Price,
      type,
      description,
      district,
      passagngers,
      facilities: facilities.split(",").map((facil) => facil.trim()),
      mainImage: mainImageData.secure_url,
      otherImages: otherImagesData.map((img) => img.secure_url),
      whatsapp,
      ownerEmail,
    });

    await vehicleData.save();
    res.status(201).json({
      success: true,
      message: "Vehicle added successfully",
      data: vehicleData,
    });
  } catch (error) {
    console.error("Error adding vehicle:", error);
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
      return res
        .status(404)
        .json({ message: "No vehicle found for this owner" });
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
      district,
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
    existingVehicle.district = district || existingVehicle.district;
    existingVehicle.passagngers = passagngers || existingVehicle.passagngers;
    existingVehicle.whatsapp = whatsapp || existingVehicle.whatsapp;

    if (facilities) {
      existingVehicle.facilities = facilities.split(",").map((f) => f.trim());
    }

    // Handle main image upload
    if (req.files?.mainImage) {
      // NOTE: we no longer store public IDs, so old image deletion cannot be performed.
      const mainImageData = await uploadImage(
        req.files.mainImage[0],
        "vehicle/main",
      );
      existingVehicle.mainImage = mainImageData.secure_url;
    }

    // Handle other images upload
    if (req.files?.otherImages) {
      // NOTE: no stored public IDs to delete; old images will remain in Cloudinary.
      const otherImagesData = await Promise.all(
        req.files.otherImages.map((img) => uploadImage(img, "vehicle/other")),
      );
      existingVehicle.otherImages = otherImagesData.map(
        (img) => img.secure_url,
      );
    }

    await existingVehicle.save();
    res.status(200).json({
      success: true,
      message: "Vehicle updated successfully",
      data: existingVehicle,
    });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all vehicles
export const getAllVehicles = async (req, res) => {
  try {
    // allow optional filtering by ownerEmail query parameter
    let filter = {};
    if (req.query.ownerEmail) {
      // normalize incoming ownerEmail
      const q = req.query.ownerEmail.toLowerCase();
      // when the client asks for a specific owner, include docs where the field
      // is missing (undefined) as a fallback. This helps users see vehicles they
      // created before ownerEmail was populated.
      filter = {
        $or: [{ ownerEmail: q }, { ownerEmail: { $exists: false } }],
      };
    }

    const vehicles = await vehicle.find(filter);
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Get vehicle by ID
export const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const found = await vehicle.findById(id);
    if (!found) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.status(200).json(found);
  } catch (error) {
    console.error("Error fetching vehicle by id:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;

    const existingVehicle = await vehicle.findById(id);
    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Note: Cloudinary public IDs are no longer stored, so images will not be deleted automatically.

    // Delete from database
    await vehicle.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
