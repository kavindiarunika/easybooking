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
const addtrending = async (req, res) => {
  try {
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

    // ---------- clean video URL ----------
    if (videoUrl && typeof videoUrl === "string") {
      videoUrl = videoUrl.trim();
      if (videoUrl === "") videoUrl = null;
    }

    // ---------- collect image files ----------
    let fileList = [];

    // main image
    if (req.files?.mainImage?.[0]) {
      fileList.push(req.files.mainImage[0]);
    }

    // image – image6 (KEEP ORDER)
    const imageFields = ["image", "image1", "image2", "image3", "image4"];

    imageFields.forEach((field) => {
      if (req.files?.[field]?.[0]) {
        fileList.push(req.files[field][0]);
      }
    });

    // other images (NEW)
    if (Array.isArray(req.files?.otherimages)) {
      fileList.push(...req.files.otherimages);
    }

    if (fileList.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    // ---------- upload ----------
    const uploadedUrls = await Promise.all(
      fileList.map((file) => uploadToCloudinary(file, "image"))
    );

    // ---------- map uploaded images ----------
    const [
      mainImage,
      image,
      image1,
      image2,
      image3,
      image4,

      ...otherimages // ✅ REST GOES HERE
    ] = uploadedUrls;

    // ---------- save ----------
    const trendingItem = new TrendingModel({
      name,
      description,
      category,
      rating: rating ? Number(rating) : 5,
      district,
      price: price ? Number(price) : 0,

      // store mainImage explicitly and keep `image` for compatibility
      mainImage: mainImage || image || null,
      image: mainImage || image,
      image1,
      image2,
      image3,
      image4,
      ownerEmail,

      availableThings: availableThings
        ? availableThings.split(",").map((i) => i.trim())
        : [],
    });

    await trendingItem.save();

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

    // ---------------- IMAGE HANDLING ----------------
    let fileList = [];

    // mainImage
    if (req.files?.mainImage?.[0]) {
      fileList.push(req.files.mainImage[0]);
    }

    // image -> image6 (KEEP ORDER)
    const imageFields = ["image", "image1", "image2", "image3", "image4"];

    imageFields.forEach((field) => {
      if (req.files?.[field]?.[0]) {
        fileList.push(req.files[field][0]);
      }
    });

    // otherimages (NEW)
    if (Array.isArray(req.files?.otherimages)) {
      fileList.push(...req.files.otherimages);
    }

    if (fileList.length > 0) {
      const uploadedUrls = await Promise.all(
        fileList.map((file) => uploadToCloudinary(file, "image"))
      );

      const [mainImage, image, image1, image2, image3, image4, ...otherimages] =
        uploadedUrls;

      if (mainImage) {
        updateData.mainImage = mainImage;
        updateData.image = mainImage; // keep backward compatibility
      }
      if (image) updateData.image1 = image;
      if (image1) updateData.image2 = image1;
      if (image2) updateData.image3 = image2;
      if (image3) updateData.image4 = image3;

      if (otherimages.length > 0) {
        updateData.otherimages = otherimages;
      }
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

export { addtrending, deleteTrendingByName, updateTrendingById, sendBooking };
