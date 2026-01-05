import safari from "../schema/safariSchema.js";
import cloudinary from "../cloudinary/cloudinary.js";

const uploadimage = async (file, folder) => {
  if (!file) return null;

  const result = await cloudinary.uploader.upload(file.path, { folder });

  return result.secure_url;
};

export const createSfari = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      adventures,
      includeplaces,
      TeamMembers,
      whatsapp,
      totalDays,
      email,
      VehicleType,

      GuiderName,

      GuiderExperience,
    } = req.body;

    if (
      !name ||
      !description ||
      !price ||
      !adventures ||
      !includeplaces ||
      !TeamMembers ||
      !whatsapp ||
      !totalDays ||
      !email ||
      !VehicleType ||
      !GuiderName ||
      !GuiderExperience
    ) {
      return res.status(400).json({ message: "all fields must be required" });
    }
    if (!req.files?.mainImage) {
      console.log(
        "mainImage missing, files present:",
        Object.keys(req.files || {})
      );
      return res.status(400).json({
        message: "main image is required",
        files: Object.keys(req.files || {}),
      });
    }

    const mainImage = await uploadimage(req.files.mainImage[0], "safari/main");

    // Safely upload guider image if provided
    const GuiderImage = req.files?.GuiderImage
      ? await uploadimage(req.files.GuiderImage[0], "safari/guider")
      : null;

    let vehicleImage = [];
    if (req.files.vehicleImage) {
      vehicleImage = await Promise.all(
        req.files.vehicleImage.map((img) => uploadimage(img, "safari/vehicle"))
      );
    }

    let otherimages = [];
    if (req.files?.otherimages) {
      otherimages = await Promise.all(
        req.files.otherimages.map((img) => uploadimage(img, "safari/gallery"))
      );
    }

    // Safely upload short video if provided
    const shortvideo = req.files?.shortvideo
      ? await uploadimage(req.files.shortvideo[0], "safari/video")
      : null;

    const safariData = new safari({
      name,
      description,
      price,
      adventures,
      includeplaces,
      TeamMembers,
      whatsapp,
      totalDays,
      email,
      mainImage: mainImage,
      otherimages: otherimages,
      shortvideo: shortvideo,
      VehicleType: VehicleType,
      vehicleImage: vehicleImage,
      GuiderName: GuiderName,
      GuiderImage: GuiderImage,
      GuiderExperience: GuiderExperience,
    });

    await safariData.save();

    return res.status(201).json({
      message: "safari created",
    });
  } catch (error) {
    console.error("createSfari error:", error);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};

export const getAllsafari = async (req, res) => {
  try {
    // Use Mongoose sort so sorting happens in the DB; sort by createdAt (newest first)
    const safaris = await safari.find().sort({ createdAt: -1 });
    res.json({ safaris });
  } catch (error) {
    console.error("getAllsafari error:", error);
    res
      .status(500)
      .json({ message: "failed to load safari", error: error.message });
  }
};

// Get single safari by id
export const getSafariById = async (req, res) => {
  const { id } = req.params;
  try {
    const found = await safari.findById(id);
    if (!found) return res.status(404).json({ message: "Safari not found" });
    res.json({ safari: found });
  } catch (error) {
    console.error("getSafariById error:", error);
    res
      .status(500)
      .json({ message: "failed to load safari", error: error.message });
  }
};

//update safari

export const updateSafari = async (req, res) => {
  try {
    const safariDoc = await safari.findById(req.params.id);

    if (!safariDoc) {
      return res.status(404).json({ message: "database cannot find" });
    }

    safariDoc.name = req.body.name || safariDoc.name;
    safariDoc.description = req.body.description || safariDoc.description;
    safariDoc.price = req.body.price || safariDoc.price;
    safariDoc.TeamMembers = req.body.TeamMembers || safariDoc.TeamMembers;
    safariDoc.whatsapp = req.body.whatsapp || safariDoc.whatsapp;
    safariDoc.totalDays = req.body.totalDays || safariDoc.totalDays;
    safariDoc.email = req.body.email || safariDoc.email;
    safariDoc.VehicleType = req.body.VehicleType || safariDoc.VehicleType;
    safariDoc.GuiderName = req.body.GuiderName || safariDoc.GuiderName;
    safariDoc.GuiderExperience =
      req.body.GuiderExperience || safariDoc.GuiderExperience;

    if (req.body.adventures) safariDoc.adventures = req.body.adventures;
    if (req.body.includeplaces)
      safariDoc.includeplaces = req.body.includeplaces;

    if (req.files?.mainImage) {
      safariDoc.mainImage = req.files.mainImage[0].path;
    }
    if (req.files?.otherimages) {
      safariDoc.otherimages = req.files.otherimages.map((img) => img.path);
    }

    if (req.files?.vehicleImage) {
      safariDoc.vehicleImage = req.files.vehicleImage.map((img) => img.path);
    }

    if (req.files?.GuiderImage) {
      safariDoc.GuiderImage = req.files.GuiderImage[0].path;
    }
    if (req.files?.shortvideo) {
      safariDoc.shortvideo = req.files.shortvideo[0].path;
    }

    await safariDoc.save();

    return res.status(200).json({ message: "safari updated" });
  } catch (error) {
    console.error("updateSafari error:", error);
    return res
      .status(500)
      .json({ message: "server error", error: error.message });
  }
};



  // Delete safari by id
  export const deleteSafari = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await safari.findByIdAndDelete(id);
      if (!deleted)
        return res.status(404).json({ message: "Safari not found" });
      return res.status(200).json({ message: "safari deleted" });
    } catch (error) {
      console.error("deleteSafari error:", error);
      return res
        .status(500)
        .json({ message: "server error", error: error.message });
    }
  };
  
  // Search safari by name
export const searchSafari = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Name query is required" });
    }

    const safaris = await safari.find({
      name: { $regex: name.trim(), $options: "i" },
    });

    return res.status(200).json(safaris);
  } catch (error) {
    console.error("searchSafari error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

