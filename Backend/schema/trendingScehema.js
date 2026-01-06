import mongoose from "mongoose";

const TrendingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["hotel", "restaurant", "villa", "house"],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    district: { type: String, required: true },
    price: { type: Number, required: true },
    count: { type: Number, default: 0 }, // ✅ added count field
    otherimages: {
      type: [String],
      default: [],
    },

    // primary image uploaded by admin; also stored as `image` for backward compatibility
    mainImage: String,

    image: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,

    videoUrl: String,

    location: String,
    highlights: String,
    address: String,
    contact: String,

    ownerEmail: { type: String, required: true }, // ✅ ADDED FOR EMAIL SENDING

    availableThings: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Trending", TrendingSchema);
