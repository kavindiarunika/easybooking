import multer from "multer";
import path from "path";
import fs from "fs";

// Determine uploads directory based on this module's location so it is stable
// regardless of the working directory used to start the server.
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// canonical uploads directory (Backend/uploads)
const canonicalUploads = path.join(__dirname, "..", "uploads");
let uploadDir = null;

if (fs.existsSync(canonicalUploads)) {
  uploadDir = canonicalUploads;
} else {
  // create the upload directory if it doesn't exist
  uploadDir = canonicalUploads;
  fs.mkdirSync(uploadDir, { recursive: true });
}

console.log("Upload directory set to:", uploadDir);

// Use memory storage for buffer-based uploads to Cloudinary
// This avoids file system issues and is more reliable
const storage = multer.memoryStorage();

// Original disk storage (kept as fallback reference)
const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, uploadDir);
  },
  filename: function (req, file, callback) {
    // Prefix with timestamp to avoid name collisions
    const uniqueName = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueName);
  },
});

// ---------------- FILE FILTER ----------------
const fileFilter = (req, file, cb) => {
  // Allow images: jpeg, jpg, png, webp
  const imageFilter = /jpeg|jpg|png|webp/;
  // Allow videos: mp4, mov, avi, mkv, webm
  const videoFilter = /mp4|mov|avi|mkv|webm|quicktime/;

  const ext = path.extname(file.originalname).toLowerCase();
  const mime = file.mimetype;

  const isImage = imageFilter.test(ext) && imageFilter.test(mime);
  const isVideo = videoFilter.test(ext) || /^video\//.test(mime);

  if (isImage || isVideo) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only image files (jpg, jpeg, png, webp) and video files (mp4, mov, avi, mkv, webm) are allowed",
      ),
    );
  }
};

// ---------------- MULTER CONFIG (🔥 FIX) ----------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // ✅ 50 MB per file (allows short videos)
    files: 60, // ✅ max total files
  },
});

export default upload;
