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
    // Require authentication
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const { name, description, district, ownerEmail: providedOwner } = req.body;

    // Admin may specify ownerEmail; vendors create for themselves
    let ownerEmail = providedOwner;
    if (req.user.role === "vendor") {
      ownerEmail = req.user.email;
    }

    const {
      name: _name,
      description: _description,
      district: _district,
    } = { name, description, district };

    if (!_name || !_description || !_district) {
      return res.status(400).json({ message: "All fields are required" });
    }

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
    let otherimages = [];
    if (req.files?.otherimages) {
      otherimages = await Promise.all(
        req.files.otherimages.map((img) =>
          uploadImage(img, "travelplaces/gallery")
        )
      );
    }

    const travelPlace = new TravelPlace({
      name,
      description,
      district,
      mainImage,
      otherimages,
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

/*-----------------------------delete-------------------- */
export const deleteTravelPlace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ massage: "name is requires" });
    }

    const place = await TravelPlace.findOne({
      name: name,
    });
    if (!place) {
      return res.status(404).json({ massage: "place not found" });
    }

    await TravelPlace.deleteOne({ _id: place._id });

    res.status(200).json({ massage: "place delete successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
};
