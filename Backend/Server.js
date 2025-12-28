import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import path from "path";
import fs from "fs"; // used to detect uploads folder
import http from "http";
import { Server as SocketIO } from "socket.io";

import trendrouter from "./router/trendingRouter.js";
import loginrouter from "./controller/logincontroller.js";
import travelingplacesroute from "./router/travelingplacesroute.js";
import safariRouter from "./router/safariRoute.js";

const app = express();
const port = process.env.PORT || 4000;

// -------------------- 1. DATABASE CONNECTION --------------------
connectDB();

// -------------------- 1.5 STATIC FILES (uploads) --------------------
// Serve uploaded images from /uploads
// Support multiple possible locations where uploads might exist
const backendUploads = path.join(process.cwd(), "Backend", "uploads");
const backendNestedUploads = path.join(
  process.cwd(),
  "Backend",
  "Backend",
  "uploads"
);
const cwdUploads = path.join(process.cwd(), "uploads");
let uploadsStaticDir = null;
if (fs.existsSync(backendUploads)) uploadsStaticDir = backendUploads;
else if (fs.existsSync(backendNestedUploads))
  uploadsStaticDir = backendNestedUploads;
else if (fs.existsSync(cwdUploads)) uploadsStaticDir = cwdUploads;
else {
  // none exist yet; create the canonical Backend/uploads
  uploadsStaticDir = backendUploads;
  fs.mkdirSync(uploadsStaticDir, { recursive: true });
}
console.log("Serving uploads from:", uploadsStaticDir);
app.use("/uploads", express.static(uploadsStaticDir));

// -------------------- 2. GLOBAL MIDDLEWARE --------------------

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5237",

  // Production domains
  "https://smartsbooking.com",
  "http://smartsbooking.com",
  "https://www.smartsbooking.com",
  "http://www.smartsbooking.com",

  // Admin panel domains
  "https://admin.smartsbooking.com",
  "http://admin.smartsbooking.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl) or if the origin is in our allowed list
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Log the error for debugging purposes
        console.error(`CORS Blocked: Origin ${origin} not in allowed list.`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsers for handling JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});

// Debug logger
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});

// -------------------- 3. JWT AUTHENTICATION MIDDLEWARE --------------------

// -------------------- 4. ROUTES --------------------

// Login/Admin route
app.use("/api/admin", loginrouter);

// Protected API routes
app.use("/api/trending", trendrouter);

app.use("/api/travelplaces", travelingplacesroute);

app.use("/api/safari", safariRouter);

// -------------------- 5. ROOT & SERVER START --------------------

app.get("/", (req, res) => res.send("API working."));

// Create HTTP server and attach Socket.IO for real-time updates
const server = http.createServer(app);
const io = new SocketIO(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  },
});

// Make io available to request handlers via req.app.get('io')
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

server.listen(port, () =>
  console.log(
    `Server starting on port ${port} in ${
      process.env.NODE_ENV || "development"
    } mode.`
  )
);
