import TrendingModel from "../schema/trendingScehema.js";
import cloudinary from "../cloudinary/cloudinary.js";
import nodemailer from "nodemailer";

// --------------------------------------------------------
// Helper to upload image/video to Cloudinary
// --------------------------------------------------------
const uploadToCloudinary = async (file, resourceType = "image") => {
  if (!file) return null;
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: resourceType,
      folder: `trending/${resourceType}s`,
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Cloudinary upload failed for ${resourceType}:`, error);
    return null;
  }
};

// --------------------------------------------------------
// ADD TRENDING CONTROLLER
// --------------------------------------------------------
const addtrending = async (req, res) => {
  try {
    const {
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
      ownerEmail, // NEW FIELD: Owner Email
    } = req.body;

    // --------------------- Prepare Image Uploads ---------------------
    // Collect main image first, then all other images
    let fileList = [];

    // Add main image (required)
    if (req.files?.mainImage?.[0]) {
      fileList.push(req.files.mainImage[0]);
    }

    // Add additional images
    if (Array.isArray(req.files?.images)) {
      fileList.push(...req.files.images);
    }

    // Also collect legacy single image fields for backward compatibility
    const explicitFields = [
      "image",
      "image1",
      "image2",
      "image3",
      "image4",
      "image5",
      "image6",
    ];
    explicitFields.forEach((f) => {
      if (Array.isArray(req.files?.[f])) fileList.push(...req.files[f]);
    });

    // Validate required main image presence
    if (fileList.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields (Main image and at least one additional image are required).",
      });
    }

    const imageUrls = await Promise.all(
      fileList.map((file) => uploadToCloudinary(file, "image"))
    );

    if (!imageUrls || imageUrls.length === 0 || !imageUrls[0]) {
      return res
        .status(500)
        .json({ success: false, message: "Main image upload failed." });
    }

    // --------------------- Optional Video URL (from body) ---------------------
    // Previously we accepted an uploaded video file. Now we expect a URL string.
    let videoUrl = req.body.videoUrl || null;
    if (videoUrl && typeof videoUrl === "string")
      videoUrl = videoUrl.trim() || null;

    // --------------------- Save Trending Data ---------------------
    const trendingData = {
      name,
      description,
      category,
      rating: rating ? parseInt(rating) : 5,
      district,
      price: parseFloat(price),
      videoUrl,
      // Save array of uploaded image URLs and also populate legacy fields for compatibility
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

    res.json({ success: true, message: "Trending item added successfully" });
  } catch (error) {
    console.error("Error adding trending:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

// --------------------------------------------------------
// DELETE TRENDING CONTROLLER
// --------------------------------------------------------
const deleteTrendingByName = async (req, res) => {
  const { name } = req.params;
  try {
    const deletedTrending = await TrendingModel.findOneAndDelete({ name });
    if (!deletedTrending) {
      return res.status(404).json({
        success: false,
        message: `Trending item with name "${name}" not found`,
      });
    }
    res.json({
      success: true,
      message: `Trending item "${name}" deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting trending item:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting trending item",
    });
  }
};

// --------------------------------------------------------
// OPTIONAL: Send Booking Email to Owner
// --------------------------------------------------------
const sendBooking = async (req, res) => {
  try {
    const { hotelName, ownerEmail, booking } = req.body;

    if (!hotelName || !ownerEmail || !booking) {
      return res.status(400).json({
        success: false,
        message: "Missing required booking details",
      });
    }

    // Format booking details
    const { name, email, phone, date, guests } = booking;

    // Transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // app password
      },
    });

    // Email content
    const mailOptions = {
      from: `Travel Booking <${process.env.EMAIL_USER}>`,
      to: ownerEmail, // send to hotel owner
      subject: `New Booking Request - ${hotelName}`,
      html: `
        <h2>New Booking Request</h2>
        <p>A customer has submitted a booking request for your hotel.</p>

        <h3>Hotel Details</h3>
        <p><strong>Hotel:</strong> ${hotelName}</p>

        <h3>Customer Information</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>

        <h3>Booking Information</h3>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Guests:</strong> ${guests}</p>

        <br/>
        <p>Please contact the customer to confirm the booking.</p>
      `,
    };

    // Send email
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

export { addtrending, deleteTrendingByName, sendBooking };
