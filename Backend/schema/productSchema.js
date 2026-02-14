import mongoose from "mongoose";

const product = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorAuth",
      required: true,
    },
    ownerEmail: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    mainImage: { type: String, required: true },
    mainImagePublicId: { type: String, required: false }, // Cloudinary public_id for main image
    OtherImages: { type: [String], required: false },
    OtherImagesPublicIds: { type: [String], required: false }, // Cloudinary public_ids for other images
    colors: { type: [String], required: false },
    size: { type: String, required: false },
    subProducts: [
      {
        subImage: { type: String },
        subImagePublicId: { type: String, required: false }, // Cloudinary public_id for sub image
        subName: { type: String },
        subDescription: { type: String },
        subPrice: { type: Number },
        subsize: { type: String },
        subOtherImages: { type: [String] },
        subOtherImagesPublicIds: { type: [String], required: false }, // Cloudinary public_ids for sub other images
      },
    ],
    whatsapp: { type: String, required: true },
    email: { type: String, required: true },
    stock: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviews: [
      {
        userId: { type: String },
        rating: { type: Number },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const productModel = mongoose.model("product", product);
export default productModel;
