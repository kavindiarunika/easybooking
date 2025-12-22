import TravelPlace from "../schema/travelingSchema.js";
import cloudinary from "../cloudinary/cloudinary.js";

/* Upload image to Cloudinary */
const uploadImage = async (file, folder) => {
  if (!file) return null;

  const result = await cloudinary.uploader.upload(file.path, {
    folder: folder,
  });

  return result.secure_url;
};

/* ================= CREATE ================= */
export const createTravelPlace = async (req, res) => {
  try {
    const { name, description, district } = req.body;

    if (!name || !description || !district) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.files?.mainImage) {
      return res.status(400).json({ message: "Main image is required" });
    }

    // Upload main image
    const mainImage = await uploadImage(
      req.files.mainImage[0],
      "travelplaces/main"
    );

    // Upload other images
    let images = [];
    if (req.files.images) {
      images = await Promise.all(
        req.files.images.map((img) =>
          uploadImage(img, "travelplaces/gallery")
        )
      );
    }

    const travelPlace = new TravelPlace({
      name,
      description,
      district,
      mainImage,
      images,
    });

    await travelPlace.save();

    res.status(201).json({
      message: "Travel place created",
      travelPlace,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= READ ================= */
export const getTravelPlaces = async (req, res) => {
  try {
    const places = await TravelPlace.find().sort({ createdAt: -1 });
    res.json({ travelPlaces: places });
  } catch (error) {
    res.status(500).json({ message: "Failed to load places" });
  }
};
