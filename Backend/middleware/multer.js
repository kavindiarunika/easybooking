import multer from "multer";
import path from "path";
import fs from "fs";

// Determine uploads directory robustly (supports starting server from repo root or from Backend folder)
const backendUploads = path.join(process.cwd(), "Backend", "uploads");
const backendNestedUploads = path.join(
  process.cwd(),
  "Backend",
  "Backend",
  "uploads"
);
const cwdUploads = path.join(process.cwd(), "uploads");
let uploadDir = null;
if (fs.existsSync(backendUploads)) uploadDir = backendUploads;
else if (fs.existsSync(backendNestedUploads)) uploadDir = backendNestedUploads;
else if (fs.existsSync(cwdUploads)) uploadDir = cwdUploads;
else {
  // If none exist, create the canonical Backend/uploads
  uploadDir = backendUploads;
  fs.mkdirSync(uploadDir, { recursive: true });
}
// uploadDir now points to the real uploads folder
console.log("Upload directory set to:", uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    // Prefix with timestamp to avoid name collisions
    const uniqueName = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueName);
  },
});

const upload = multer({
  storage,
});

export default upload;
