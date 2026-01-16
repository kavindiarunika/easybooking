import TrendingModel from "../schema/trendingScehema.js";
import cloudinary from "../cloudinary/cloudinary.js";
import nodemailer from "nodemailer";
import fs from "fs";
import jwt from "jsonwebtoken";

const uploadToCloudinary = async (file, resourceType = "image") => {
  if (!file) return null;

  const maxAttempts = 3;

  if (!fs.existsSync(file.path)) {
    console.warn(
      "uploadToCloudinary: file not found, skipping:",
      file.path,
      file?.originalname
    );
    return null;
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: resourceType,
        folder: `trending/${resourceType}s`,
      });

      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (e) {
        console.warn("Failed to remove local uploaded file:", e);
      }

      return result.secure_url;
    } catch (error) {
      console.error(
        `Cloudinary upload failed (${resourceType}) attempt ${attempt}:`,
        error
      );

      // Try to remove local file if it still exists to avoid disk growth
      try {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      } catch (e) {
        console.warn("Failed to remove local uploaded file after failure:", e);
      }

      if (attempt < maxAttempts) {
        // small backoff before retrying
        await new Promise((r) => setTimeout(r, 500 * attempt));
        continue;
      }

      return null;
    }
  }
};

// --------------------------------------------------------
const addtrending = async (req, res) => {
  try {
    // Require authentication
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    let {
      name,
      description,
      category,
      rating,
      district,
      price,
      availableThings,
      location,
      highlights,
      address,
      contact,
      ownerEmail,
      videoUrl,
    } = req.body;

    // If admin creates a profile, they must provide ownerEmail
    if (req.user.role === "admin") {
      if (!ownerEmail || String(ownerEmail).trim() === "") {
        return res
          .status(400)
          .json({
            success: false,
            message: "ownerEmail is required when creating a profile as admin",
          });
      }
    } else if (req.user.role === "vendor") {
      // Vendors create only for themselves — use email from token
      ownerEmail = req.user.email;
    } else {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized to create profiles" });
    }

    // Before creating, ensure vendor doesn't already have a profile (one per vendor rule)
    if (ownerEmail) {
      const existing = await TrendingModel.findOne({ ownerEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          message:
            "A stay profile already exists for this account. Use update instead.",
        });
      }
    }

    if (videoUrl && typeof videoUrl === "string") {
      videoUrl = videoUrl.trim();
      if (videoUrl === "") videoUrl = null;
    }

    const mainImageUrl = req.files?.mainImage?.[0]
      ? await uploadToCloudinary(req.files.mainImage[0], "image")
      : null;

    const imageUrl = req.files?.image?.[0]
      ? await uploadToCloudinary(req.files.image[0], "image")
      : null;

    const image1Url = req.files?.image1?.[0]
      ? await uploadToCloudinary(req.files.image1[0], "image")
      : null;

    const image2Url = req.files?.image2?.[0]
      ? await uploadToCloudinary(req.files.image2[0], "image")
      : null;

    const image3Url = req.files?.image3?.[0]
      ? await uploadToCloudinary(req.files.image3[0], "image")
      : null;

    const image4Url = req.files?.image4?.[0]
      ? await uploadToCloudinary(req.files.image4[0], "image")
      : null;

    const otherimagesUrls = Array.isArray(req.files?.otherimages)
      ? (
          await Promise.all(
            req.files.otherimages.map((file) =>
              uploadToCloudinary(file, "image")
            )
          )
        ).filter(Boolean)
      : [];

    // Debug logging to inspect incoming files and uploads
    try {
      console.log(
        "addtrending: incoming files keys:",
        Object.keys(req.files || {})
      );
      if (Array.isArray(req.files?.otherimages)) {
        console.log(
          "addtrending: otherimages filenames:",
          req.files.otherimages.map((f) => f.originalname)
        );
      }
      console.log("addtrending: uploaded image urls counts", {
        main: !!mainImageUrl,
        image: !!imageUrl,
        image1: !!image1Url,
        image2: !!image2Url,
        image3: !!image3Url,
        image4: !!image4Url,
        otherimages: otherimagesUrls.length,
      });
    } catch (e) {
      console.warn("addtrending: logging failed", e);
    }

    // Ensure at least one image exists across all fields
    if (
      !mainImageUrl &&
      !imageUrl &&
      !image1Url &&
      !image2Url &&
      !image3Url &&
      !image4Url &&
      otherimagesUrls.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // If owner email wasn't supplied explicitly, try to infer it from a Bearer token
    if (!ownerEmail) {
      const authHeader = req.headers?.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
          const token = authHeader.split(" ")[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          if (decoded && decoded.email) ownerEmail = decoded.email;
        } catch (e) {
          // ignore token parse errors — ownerEmail stays undefined
          console.warn(
            "Could not decode token for ownerEmail inference:",
            e.message
          );
        }
      }
    }

    const toNumberSafe = (val, fallback) => {
      try {
        if (val === undefined || val === null || val === "") return fallback;
        const n = Number(val);
        return Number.isFinite(n) ? n : fallback;
      } catch (e) {
        return fallback;
      }
    };

    // ---------- save (now include `otherimages`) ----------
    const trendingItem = new TrendingModel({
      name,
      description,
      category,
      rating: toNumberSafe(rating, 5),
      district,
      price: toNumberSafe(price, 0),

      // store mainImage explicitly and keep `image` for compatibility
      mainImage: mainImageUrl || imageUrl || null,
      image: mainImageUrl || imageUrl || null,
      image1: image1Url || null,
      image2: image2Url || null,
      image3: image3Url || null,
      image4: image4Url || null,
      otherimages: otherimagesUrls,
      ownerEmail,

      // Normalize availableThings: accept string (comma separated), array, or JSON-encoded array
      availableThings: (() => {
        try {
          if (!availableThings) return [];
          if (Array.isArray(availableThings))
            return availableThings.map((i) => String(i).trim()).filter(Boolean);
          if (typeof availableThings === "string") {
            // Try JSON parse first (in case client sent JSON string)
            try {
              const parsed = JSON.parse(availableThings);
              if (Array.isArray(parsed))
                return parsed.map((i) => String(i).trim()).filter(Boolean);
            } catch (e) {
              // not JSON, fall back to comma split
            }
            return availableThings
              .split(",")
              .map((i) => i.trim())
              .filter(Boolean);
          }

          // other types (numbers, objects) — convert to string
          return [String(availableThings)];
        } catch (e) {
          return [];
        }
      })(),
    });

    await trendingItem.save();

    // Emit socket event so clients can refresh in real-time
    try {
      const io = req.app?.get("io");
      if (io) io.emit("trendingUpdated", { action: "add", item: trendingItem });
    } catch (e) {
      console.warn("Could not emit trendingUpdated (add):", e);
    }

    res.status(201).json({
      success: true,
      message: "Trending item added successfully",
      data: trendingItem,
    });
  } catch (error) {
    console.error("Error adding trending:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while adding trending",
    });
  }
};

// --------------------------------------------------------
// DELETE TRENDING CONTROLLER
// --------------------------------------------------------
const deleteTrendingByName = async (req, res) => {
  try {
    const { name } = req.params;

    // find first to check ownership
    const item = await TrendingModel.findOne({ name });
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: `Trending item "${name}" not found` });
    }

    if (req.user?.role !== "admin" && req.user?.email !== item.ownerEmail) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this item",
      });
    }

    const deletedTrending = await TrendingModel.findOneAndDelete({ name });

    // Emit socket event to notify clients about deletion
    try {
      const io = req.app?.get("io");
      if (io) io.emit("trendingUpdated", { action: "delete", name });
    } catch (e) {
      console.warn("Could not emit trendingUpdated (delete):", e);
    }

    res.json({
      success: true,
      message: `Trending item "${name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting trending:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting trending item",
    });
  }
};

// --------------------------------------------------------
// UPDATE TRENDING CONTROLLER
// --------------------------------------------------------
const updateTrendingById = async (req, res) => {
  try {
    const { id } = req.params;

    // ensure the caller owns this resource (or is admin)
    const existingItem = await TrendingModel.findById(id);
    if (!existingItem) {
      return res
        .status(404)
        .json({ success: false, message: "Trending item not found" });
    }

    if (
      req.user?.role !== "admin" &&
      req.user?.email !== existingItem.ownerEmail
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this item",
      });
    }

    let {
      name,
      description,
      category,
      rating,
      district,
      price,
      availableThings,
      location,
      highlights,
      address,
      contact,
      ownerEmail,
      videoUrl,
      count,
    } = req.body;

    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (rating !== undefined) updateData.rating = Number(rating);
    if (district !== undefined) updateData.district = district;
    if (price !== undefined) updateData.price = Number(price);
    if (location !== undefined) updateData.location = location;
    if (highlights !== undefined) updateData.highlights = highlights;
    if (address !== undefined) updateData.address = address;
    if (contact !== undefined) updateData.contact = contact;
    if (ownerEmail !== undefined) updateData.ownerEmail = ownerEmail;

    if (videoUrl !== undefined) {
      videoUrl = videoUrl?.trim();
      updateData.videoUrl = videoUrl === "" ? null : videoUrl;
    }

    if (availableThings !== undefined) {
      updateData.availableThings = Array.isArray(availableThings)
        ? availableThings
        : availableThings
        ? availableThings.split(",").map((i) => i.trim())
        : [];
    }

    if (count !== undefined) {
      const parsedCount = Number(count);
      if (isNaN(parsedCount) || parsedCount < 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid count value" });
      }
      updateData.count = parsedCount;
    }

    // ---------------- IMAGE HANDLING (robust per-field uploads) ----------------

    const mainImageUrl = req.files?.mainImage?.[0]
      ? await uploadToCloudinary(req.files.mainImage[0], "image")
      : null;

    const imageUrl = req.files?.image?.[0]
      ? await uploadToCloudinary(req.files.image[0], "image")
      : null;

    const image1Url = req.files?.image1?.[0]
      ? await uploadToCloudinary(req.files.image1[0], "image")
      : null;

    const image2Url = req.files?.image2?.[0]
      ? await uploadToCloudinary(req.files.image2[0], "image")
      : null;

    const image3Url = req.files?.image3?.[0]
      ? await uploadToCloudinary(req.files.image3[0], "image")
      : null;

    const image4Url = req.files?.image4?.[0]
      ? await uploadToCloudinary(req.files.image4[0], "image")
      : null;

    const otherimagesUrls = Array.isArray(req.files?.otherimages)
      ? (
          await Promise.all(
            req.files.otherimages.map((file) =>
              uploadToCloudinary(file, "image")
            )
          )
        ).filter(Boolean)
      : [];

    // Apply updates only for the fields that were uploaded
    if (mainImageUrl) {
      updateData.mainImage = mainImageUrl;
      updateData.image = mainImageUrl; // keep backward compatibility
    }
    if (imageUrl) updateData.image1 = imageUrl;
    if (image1Url) updateData.image2 = image1Url;
    if (image2Url) updateData.image3 = image2Url;
    if (image3Url) updateData.image4 = image3Url;

    if (otherimagesUrls.length > 0) {
      // overwrite otherimages if the update supplied other images
      updateData.otherimages = otherimagesUrls;
    }

    // ---------------- UPDATE ----------------
    const updated = await TrendingModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Trending item not found" });
    }

    // socket emit
    const io = req.app?.get("io");
    if (io) io.emit("trendingUpdated", { action: "update", item: updated });

    res.json({
      success: true,
      message: "Trending item updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating trending:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating trending",
    });
  }
};

const sendBooking = async (req, res) => {
  try {
    const { hotelName, ownerEmail, booking } = req.body;

    if (!hotelName || !ownerEmail || !booking) {
      return res.status(400).json({
        success: false,
        message: "Missing booking details",
      });
    }

    const { name, email, phone, fromDate, toDate, guests } = booking;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Travel Booking <${process.env.EMAIL_USER}>`,
      to: ownerEmail,
      subject: `New Booking Request - ${hotelName}`,
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Hotel:</strong> ${hotelName}</p>

        <h3>Customer Details</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <h3>Booking Dates</h3>
        <p><strong>From:</strong> ${fromDate}</p>
        <p><strong>To:</strong> ${toDate}</p>
        <p><strong>Guests:</strong> ${guests}</p>

        <p>Please contact the customer to confirm the booking.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Booking email sent successfully",
    });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({
      success: false,
      message: "Error sending booking email",
    });
  }
};

const patchTrending = async (req, res) => {
  try {
    const paid = req.body?.paid;
    if (paid === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Missing 'paid' in request body" });
    }

    const updateData = { paid };

    if (paid === true) {
      const paidAt = new Date();
      const expireAt = new Date(paidAt);
      expireAt.setDate(expireAt.getDate() + 365);

      updateData.paidAt = paidAt;
      updateData.expireAt = expireAt;
    } else {
      updateData.expireAt = null;
      updateData.paidAt = null;
    }

    const updated = await TrendingModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Trending item not found" });
    }

    // Emit socket event so clients can refresh in real-time
    try {
      const io = req.app?.get("io");
      if (io) io.emit("trendingUpdated", { action: "update", item: updated });
    } catch (e) {
      console.warn("Could not emit trendingUpdated (patch):", e);
    }

    res.json({ success: true, message: "Paid status updated", data: updated });
  } catch (error) {
    console.error("Error updating paid status:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating paid status",
    });
  }
};

export {
  addtrending,
  deleteTrendingByName,
  updateTrendingById,
  sendBooking,
  patchTrending,
};
