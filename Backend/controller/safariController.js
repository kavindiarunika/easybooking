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

    // Debugging: log incoming request info to help find missing files
    console.log("--- createSfari incoming ---");
    console.log("content-type:", req.headers["content-type"]);
    console.log("body keys:", Object.keys(req.body || {}));
    console.log("files keys:", Object.keys(req.files || {}));

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

    let images = [];
    if (req.files.images) {
      images = await Promise.all(
        req.files.images.map((img) => uploadimage(img, "safari/gallery"))
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
      images: images,
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

export const updateSafari = async(req,res) =>{

  try{

    const safari =await safari.findById(req.params.id);

    if(!safari){
      return res.status(404).json({message:"database cannot find"})
    }
    safari.name = req.body.name || safari.name;
    safari.description =req.body.description ||safari.description;
    safari.price = req.body.price || safari.price;
    safari.TeamMembers =req.body.TeamMembers || safari.TeamMembers;
    safari.whatsapp = req.body.whatsapp || safari.whatsapp;
    safari.totalDays = req.body.totalDays || safari.totalDays;
    safari.email = req.body.email || safari.email;
    safari.VehicleType = req.body.VehicleType || safari.VehicleType;
    safari.GuiderName = req.body.GuiderName || safari.GuiderName;
    safari.GuiderExperience = req.body.GuiderExperience || safari.GuiderExperience;

    if(req.body.adventures)safari.adventures = req.body.adventures;
    if(req.body.includeplaces)safari.includeplaces = req.body.includeplaces;

    if(req.files?.mainImage){
      safari.mainImage = req.files.mainImage[0].path;
    }
    if(req.files?.images){
      safari.imzges = req.files.images.map((img) =>img.path);
    }


     if(req.files?.vehicleImage){
         safari.vehicleImage = req.files.vehicleImage.map((img) =>img.path)
            }
    
            if(req.files?.GuiderImage){
              safari.GuiderImage = req.files.GuiderImage[0].path;
            }
     if(req.files?.shortvideo){
       safari.shortvideo = req.files.shortvideo[0].path;
     }

     await safari.save();

  }
  catch(error){
    console.error("updateSafari error:", error);
  }
}
