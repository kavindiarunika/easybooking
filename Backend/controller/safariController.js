import safari from "../schema/safariSchema.js";
import mongoose from "mongoose";
import cloudinary from "../cloudinary/cloudinary.js";
import fs from "fs";

const uploadimage = async (file, folder) => {
  if (!file) return null;

  const isVideo = file.mimetype && file.mimetype.startsWith("video/");
  const opts = { folder };
  if (isVideo) opts.resource_type = "video";

  try {
    const result = await cloudinary.uploader.upload(file.path, opts);

    // Cleanup temporary uploaded file from local disk
    if (fs.existsSync(file.path)) {
      try {
        await fs.promises.unlink(file.path);
      } catch (unlinkErr) {
        console.warn(
          "Failed to unlink temp file:",
          file.path,
          unlinkErr.message || unlinkErr
        );
      }
    }

    return result.secure_url;
  } catch (err) {
    console.error("Cloudinary upload error for file:", file.originalname, err);
    const message = err.message || "Upload failed";
    const http_code = err.http_code || err.status || 500;
    const e = new Error(`Upload failed for ${file.originalname}: ${message}`);
    e.http_code = http_code;
    // try to remove temp file on error as well
    try {
      if (fs.existsSync(file.path)) await fs.promises.unlink(file.path);
    } catch (cleanupErr) {
      console.warn(
        "Failed to cleanup temp after upload error:",
        cleanupErr.message || cleanupErr
      );
    }
    throw e;
  }
};

export const createSfari = async (req, res) => {
  try {
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Determine ownerEmail based on role
    let ownerEmail = null;
    if (req.user.role === "admin") {
      const { email } = req.body;
      if (!email || String(email).trim() === "") {
        return res
          .status(400)
          .json({
            message:
              "Owner email is required when admin creates a safari profile",
          });
      }
      ownerEmail = email;
    } else if (req.user.role === "vendor") {
      ownerEmail = req.user.email;
    } else {
      return res
        .status(403)
        .json({ message: "Not authorized to create safari profiles" });
    }

    // Check if vendor already has a safari profile
    if (ownerEmail) {
      const exists = await safari.findOne({ email: ownerEmail });
      if (exists) {
        return res
          .status(409)
          .json({
            message: "A safari profile already exists for this account",
          });
      }
    }

    // Helpful debug logs to understand what's being submitted
    console.log("createSfari - body keys:", Object.keys(req.body || {}));
    console.log("createSfari - files keys:", Object.keys(req.files || {}));

    const {
      name,
      description,
      price,
      adventures,
      category,
      type,
      includeplaces,
      TeamMembers,
      whatsapp,
      totalDays,
      // email field is handled via ownerEmail variable
      VehicleType,
      GuiderName,
      GuiderExperience,
    } = req.body;

    const requiredFields = [
      "name",
      "description",
      "price",
      "adventures",
      "category",
      "type",
      "includeplaces",
      "TeamMembers",
      "whatsapp",
      "totalDays",
      "email",
      "VehicleType",
      "GuiderName",
      "GuiderExperience",
    ];

    const missing = requiredFields.filter((f) => {
      const val = req.body[f];
      if (Array.isArray(val)) return val.length === 0;
      return val === undefined || val === null || String(val).trim() === "";
    });

    if (missing.length > 0) {
      console.warn("createSfari - missing required fields:", missing);
      return res
        .status(400)
        .json({ message: "Missing required fields", missing });
    }

    if (!req.files?.mainImage) {
      console.log(
        "mainImage missing, files present:",
        Object.keys(req.files || {})
      );
      return res.status(400).json({
        message: "main image is required",
        files: Object.keys(req.files || {}),
      });
    }

    const mainImage = await uploadimage(req.files.mainImage[0], "safari/main");

    // Safely upload guider image if provided
    const GuiderImage = req.files?.GuiderImage
      ? await uploadimage(req.files.GuiderImage[0], "safari/guider")
      : null;

    let vehicleImage = [];
    if (req.files.vehicleImage) {
      vehicleImage = await Promise.all(
        req.files.vehicleImage.map((img) => uploadimage(img, "safari/vehicle"))
      );
    }

    let otherimages = [];
    if (req.files?.otherimages) {
      otherimages = await Promise.all(
        req.files.otherimages.map((img) => uploadimage(img, "safari/gallery"))
      );
    }

    // Safely upload short video if provided
    const shortvideo = req.files?.shortvideo
      ? await uploadimage(req.files.shortvideo[0], "safari/video")
      : null;

    const safariData = new safari({
      name,
      description,
      price,
      adventures,
      category,
      type,
      includeplaces,
      TeamMembers,
      whatsapp,
      totalDays,
      email: ownerEmail,
      mainImage: mainImage,
      otherimages: otherimages,
      shortvideo: shortvideo,
      VehicleType: VehicleType,
      vehicleImage: vehicleImage,
      GuiderName: GuiderName,
      GuiderImage: GuiderImage,
      GuiderExperience: GuiderExperience,
    });

    await safariData.save();

    return res.status(201).json({
      message: "safari created",
    });
  } catch (error) {
    console.error("createSfari error:", error);

    // Cloudinary upload errors may include a status/http_code property
    if (error.http_code) {
      return res
        .status(error.http_code || 400)
        .json({ message: error.message });
    }

    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

export const getAllsafari = async (req, res) => {
  try {
    // Use Mongoose sort so sorting happens in the DB; sort by createdAt (newest first)
    const safaris = await safari.find().sort({ createdAt: -1 });
    res.json({ safaris });
  } catch (error) {
    console.error("getAllsafari error:", error);
    res
      .status(500)
      .json({ message: "failed to load safari", error: error.message });
  }
};

// Get single safari by id
export const getSafariById = async (req, res) => {
  const { id } = req.params;
  try {
    const found = await safari.findById(id);
    if (!found) return res.status(404).json({ message: "Safari not found" });
    res.json({ safari: found });
  } catch (error) {
    console.error("getSafariById error:", error);
    res
      .status(500)
      .json({ message: "failed to load safari", error: error.message });
  }
};

//update safari

export const updateSafari = async (req, res) => {
  try {
    const { id } = req.params;

    // validate id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .json({ message: "Invalid or missing id parameter" });
    }

    const safariDoc = await safari.findById(id);

    if (!safariDoc) {
      return res.status(404).json({ message: "database cannot find" });
    }

    safariDoc.name = req.body.name || safariDoc.name;
    safariDoc.description = req.body.description || safariDoc.description;
    safariDoc.price = req.body.price || safariDoc.price;
    safariDoc.TeamMembers = req.body.TeamMembers || safariDoc.TeamMembers;
    safariDoc.category = req.body.category || safariDoc.category;
    safariDoc.whatsapp = req.body.whatsapp || safariDoc.whatsapp;
    safariDoc.totalDays = req.body.totalDays || safariDoc.totalDays;
    safariDoc.email = req.body.email || safariDoc.email;
    safariDoc.VehicleType = req.body.VehicleType || safariDoc.VehicleType;
    safariDoc.GuiderName = req.body.GuiderName || safariDoc.GuiderName;
    safariDoc.GuiderExperience =
      req.body.GuiderExperience || safariDoc.GuiderExperience;

    if (req.body.adventures) safariDoc.adventures = req.body.adventures;
    if (req.body.type) safariDoc.type = req.body.type;
    if (req.body.includeplaces)
      safariDoc.includeplaces = req.body.includeplaces;

    if (req.files?.mainImage) {
      try {
        safariDoc.mainImage = await uploadimage(
          req.files.mainImage[0],
          "safari/main"
        );
      } catch (uploadErr) {
        console.error("Failed to upload mainImage during update:", uploadErr);
        return res
          .status(uploadErr.http_code || 400)
          .json({ message: uploadErr.message });
      }
    }

    if (req.files?.otherimages) {
      try {
        safariDoc.otherimages = await Promise.all(
          req.files.otherimages.map((img) => uploadimage(img, "safari/gallery"))
        );
      } catch (uploadErr) {
        console.error("Failed to upload otherimages during update:", uploadErr);
        return res
          .status(uploadErr.http_code || 400)
          .json({ message: uploadErr.message });
      }
    }

    if (req.files?.vehicleImage) {
      try {
        safariDoc.vehicleImage = await Promise.all(
          req.files.vehicleImage.map((img) =>
            uploadimage(img, "safari/vehicle")
          )
        );
      } catch (uploadErr) {
        console.error(
          "Failed to upload vehicleImage during update:",
          uploadErr
        );
        return res
          .status(uploadErr.http_code || 400)
          .json({ message: uploadErr.message });
      }
    }

    if (req.files?.GuiderImage) {
      try {
        safariDoc.GuiderImage = await uploadimage(
          req.files.GuiderImage[0],
          "safari/guider"
        );
      } catch (uploadErr) {
        console.error("Failed to upload GuiderImage during update:", uploadErr);
        return res
          .status(uploadErr.http_code || 400)
          .json({ message: uploadErr.message });
      }
    }
    if (req.files?.shortvideo) {
      try {
        safariDoc.shortvideo = await uploadimage(
          req.files.shortvideo[0],
          "safari/video"
        );
      } catch (uploadErr) {
        console.error("Failed to upload shortvideo during update:", uploadErr);
        return res
          .status(uploadErr.http_code || 400)
          .json({ message: uploadErr.message });
      }
    }

    await safariDoc.save();

    return res.status(200).json({ message: "safari updated" });
  } catch (error) {
    console.error("updateSafari error:", error);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

// Delete safari by id
export const deleteSafari = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await safari.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Safari not found" });
    return res.status(200).json({ message: "safari deleted" });
  } catch (error) {
    console.error("deleteSafari error:", error);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

// Search safari by name
export const searchSafari = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name query is required" });
    }

    const safaris = await safari.find({
      name: { $regex: name.trim(), $options: "i" },
    });

    return res.status(200).json(safaris);
  } catch (error) {
    console.error("searchSafari error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get safari by owner email
export const getSafariByEmail = async (req, res) => {
  try {
    const { ownerEmail } = req.query;

    if (!ownerEmail) {
      return res.status(400).json({ message: "ownerEmail query is required" });
    }

    const safariDoc = await safari.findOne({ email: ownerEmail });

    if (!safariDoc) {
      return res
        .status(404)
        .json({ message: "Safari not found for this email" });
    }

    return res.status(200).json(safariDoc);
  } catch (error) {
    console.error("getSafariByEmail error:", error);

    // If the error indicates a server selection or buffering timeout, return 503 (service unavailable)
    if (
      error.name === "MongooseServerSelectionError" ||
      /buffering timed out/i.test(error.message || "")
    ) {
      return res
        .status(503)
        .json({ message: "Database unavailable. Please try again later." });
    }

    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
