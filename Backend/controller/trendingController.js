import TrendingModel from "../schema/trendingScehema.js";
import cloudinary from "../cloudinary/cloudinary.js";
import nodemailer from "nodemailer";
import fs from "fs";

// --------------------------------------------------------
// Helper to upload image to Cloudinary (and remove local file)
// --------------------------------------------------------
const uploadToCloudinary = async (file, resourceType = "image") => {
  if (!file) return null;

  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
      folder: `trending/${resourceType}s`,
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
    console.error(`Cloudinary upload failed (${resourceType}):`, error);

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

// --------------------------------------------------------
// ADD TRENDING CONTROLLER
// --------------------------------------------------------
const addtrending = async (req, res) => {
  try {
    // ⚠️ videoUrl MUST be let (we modify it later)
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
      videoUrl, // ✅ FIXED
    } = req.body;

    // --------------------- Clean video URL ---------------------
    if (videoUrl && typeof videoUrl === "string") {
      videoUrl = videoUrl.trim();
      if (videoUrl === "") videoUrl = null;
    }

    // --------------------- Collect image files ---------------------
    let fileList = [];

    // Main image
    if (req.files?.mainImage?.[0]) {
      fileList.push(req.files.mainImage[0]);
    }

    // Multiple images
    if (Array.isArray(req.files?.images)) {
      fileList.push(...req.files.images);
    }

    // Backward compatibility image fields
    const legacyFields = [
      "image",
      "image1",
      "image2",
      "image3",
      "image4",
      "image5",
      "image6",
    ];

    legacyFields.forEach((field) => {
      if (Array.isArray(req.files?.[field])) {
        fileList.push(...req.files[field]);
      }
    });

    if (fileList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // --------------------- Upload images ---------------------
    const imageUrls = await Promise.all(
      fileList.map((file) => uploadToCloudinary(file, "image"))
    );

    if (!imageUrls[0]) {
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    // --------------------- Save Trending Data ---------------------
    const trendingData = {
      name,
      description,
      category,
      rating: rating ? parseInt(rating) : 5,
      district,
      price: price ? parseFloat(price) : 0,
      videoUrl, // ✅ saved correctly
      images: imageUrls,
      image: imageUrls[0],
      image1: imageUrls[1] || null,
      image2: imageUrls[2] || null,
      image3: imageUrls[3] || null,
      image4: imageUrls[4] || null,
      image5: imageUrls[5] || null,
      image6: imageUrls[6] || null,
      location,
      highlights,
      address,
      contact,
      ownerEmail,
      availableThings: availableThings
        ? availableThings.split(",").map((item) => item.trim())
        : [],
    };

    const trendingItem = new TrendingModel(trendingData);
    await trendingItem.save();

    // Emit socket event to notify clients about the new trending item
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

    const deletedTrending = await TrendingModel.findOneAndDelete({ name });

    if (!deletedTrending) {
      return res.status(404).json({
        success: false,
        message: `Trending item "${name}" not found`,
      });
    }

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

    // Accept fields similar to addtrending
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

    // Clean and prepare update object
    const updateData = {};

    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (category !== undefined) updateData.category = category;
    if (rating !== undefined)
      updateData.rating = rating ? parseInt(rating) : undefined;
    if (district !== undefined) updateData.district = district;
    if (price !== undefined)
      updateData.price = price ? parseFloat(price) : undefined;
    if (location !== undefined) updateData.location = location;
    if (highlights !== undefined) updateData.highlights = highlights;
    if (address !== undefined) updateData.address = address;
    if (contact !== undefined) updateData.contact = contact;
    if (ownerEmail !== undefined) updateData.ownerEmail = ownerEmail;

    if (videoUrl && typeof videoUrl === "string") {
      videoUrl = videoUrl.trim();
      if (videoUrl === "") videoUrl = null;
      updateData.videoUrl = videoUrl;
    }

    if (availableThings !== undefined) {
      updateData.availableThings = Array.isArray(availableThings)
        ? availableThings
        : availableThings
        ? availableThings.split(",").map((i) => i.trim())
        : [];
    }

    if (count !== undefined) {
      const parsedCount = parseInt(count);
      if (isNaN(parsedCount) || parsedCount < 0) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid 'count' value" });
      }
      updateData.count = parsedCount;
    }

    // --------------------- Handle image uploads (optional) ---------------------
    let fileList = [];

    if (req.files?.mainImage?.[0]) {
      fileList.push(req.files.mainImage[0]);
    }

    if (Array.isArray(req.files?.images)) {
      fileList.push(...req.files.images);
    }

    const legacyFields = [
      "image",
      "image1",
      "image2",
      "image3",
      "image4",
      "image5",
      "image6",
    ];

    legacyFields.forEach((field) => {
      if (Array.isArray(req.files?.[field])) {
        fileList.push(...req.files[field]);
      }
    });

    if (fileList.length > 0) {
      const imageUrls = await Promise.all(
        fileList.map((file) => uploadToCloudinary(file, "image"))
      );

      updateData.images = imageUrls;
      updateData.image = imageUrls[0] || null;
      updateData.image1 = imageUrls[1] || null;
      updateData.image2 = imageUrls[2] || null;
      updateData.image3 = imageUrls[3] || null;
      updateData.image4 = imageUrls[4] || null;
      updateData.image5 = imageUrls[5] || null;
      updateData.image6 = imageUrls[6] || null;
    }

    // --------------------- Perform update ---------------------
    const updated = await TrendingModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!updated) {
      return res
        .status(404)
        .json({ success: false, message: "Trending item not found" });
    }

    // Emit socket event to notify clients about update
    try {
      const io = req.app?.get("io");
      if (io) io.emit("trendingUpdated", { action: "update", item: updated });
    } catch (e) {
      console.warn("Could not emit trendingUpdated (update):", e);
    }

    res.json({
      success: true,
      message: "Trending item updated",
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

// --------------------------------------------------------
// SEND BOOKING EMAIL TO OWNER
// --------------------------------------------------------
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

export { addtrending, deleteTrendingByName, updateTrendingById, sendBooking };
