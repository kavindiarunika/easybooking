import mongoose from "mongoose";

const TrendingSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["restaurant", "villa", "hotel", "house"],
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    district: { type: String, required: true },
    price: { type: Number, required: true },
    images: [String],

    image: String,
    image1: String,
    image2: String,
    image3: String,
    image4: String,
    image5: String,
    image6: String,

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
