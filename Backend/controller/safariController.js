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
    } = req.body;

    if(!name || !description || !price || !adventures ||!includeplaces || !TeamMembers || !whatsapp || !totalDays || !email){
       return res.status(400).json({message:"all fields must be required"})
    }

    if(!res.files ?.mainImage){
       return res.status(400).json({message:"main image is required"})
    }

    const mainImage =await uploadimage(
      req.files.mainImage[0],
      'safari/main'
    )

    let images=[];
    if(req.files.images){

      images  = await Promise.all(
        req.files.images.map((img) =>(
          uploadimage(img, 'safari/gallery')
        ))

      )
    }

    const shortvideo = await uploadimage(
      req.files.shortvideo[0],
      'safari/video'
    )

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
      mainImage:mainImage,
      images:images,
      shortvideo:shortvideo
    });

    await safariData.save();

   return  res.status(201).json({
      message:"safari created"
    });


    
  } catch (error) {
  return   res.status(500).json({message:"server error"})
  }
};
