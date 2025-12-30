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

// ---------------- FILE FILTER ----------------
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp/;
  const extOk = allowed.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeOk = allowed.test(file.mimetype);

  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
  }
};

// ---------------- MULTER CONFIG (🔥 FIX) ----------------
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 20 * 1024 * 1024, // ✅ 20 MB per image
    files: 60,                 // ✅ max total files
  },
});

export default upload;
