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
    count: { type: Number, default: 0 },
    otherimages: {
      type: [String],
      default: [],
    },
    otherimagesPublicIds: {
      type: [String],
      default: [],
    },
    mainImage: String,
    mainImagePublicId: String,

    image: String,
    imagePublicId: String,
    image1: String,
    image1PublicId: String,
    image2: String,
    image2PublicId: String,
    image3: String,
    image3PublicId: String,
    image4: String,
    image4PublicId: String,

    videoUrl: String,
    videoPublicId: String,

    location: String,
    country: String,
    city: String,
    highlights: String,
    address: String,
    contact: String,
    paid: { type: Boolean, default: false },
    paidAt: { type: Date, default: Date.now },
    expireAt: { type: Date },
    ownerEmail: { type: String, required: true },

    availableThings: [String],
  },
  { timestamps: true },
);

export default mongoose.model("Trending", TrendingSchema);
