import { v2 as cloudinary } from 'cloudinary'; 

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,    // Changed
  api_key: process.env.CLOUDINARY_API_KEY,     
  api_secret: process.env.CLOUDINARY_API_SECRET,    // Changed
  secure: true, 
});

export default cloudinary;