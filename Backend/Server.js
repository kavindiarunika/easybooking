import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import path from "path";
import fs from "fs"; // used to detect uploads folder
import http from "http";
import { Server as SocketIO } from "socket.io";
import vehicleRouter from "./router/vehicleRoute.js";
import trendrouter from "./router/trendingRouter.js";
import loginrouter from "./controller/logincontroller.js";
import travelingplacesroute from "./router/travelingplacesroute.js";
import safariRouter from "./router/safariRoute.js";
import vendorrouter from './router/vendorRouter.js'
import adsRouter from './router/adsRouter.js';
import helmet from "helmet";


const app = express();
const port = process.env.PORT || 4000;


connectDB();


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
  "http://localhost:5238",
  "http://localhost:5239", // Added for current Vite dev server

  // Production domains
  "https://smartsbooking.com",
  "http://smartsbooking.com",
  "https://www.smartsbooking.com",
  "http://www.smartsbooking.com",

  // Admin panel domains
  "https://admin.smartsbooking.com",
  "http://admin.smartsbooking.com",
];

app.use(helmet());

{/*app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "http://localhost:4000",
          "ws://localhost:4000",
          "https://sandbox.payhere.lk",
          "https://www.payhere.lk",
          "https://www.google-analytics.com",
          "https://www.paypal.com",
          "https://www.sandbox.paypal.com",
        ],
      },
    },
  })
); */}
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
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "token"],
  })
);

// Body Parsers for handling JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

{/*app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "connect-src 'self' http://localhost:4000 ws://localhost:4000 https://sandbox.payhere.lk https://www.payhere.lk https://www.google-analytics.com https://www.paypal.com https://www.sandbox.paypal.com"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  next();
});*/}

// Debug logger
app.use((req, res, next) => {
  console.log("Incoming request:", req.method, req.path);
  next();
});


// Login/Admin route
app.use("/api/admin", loginrouter);

// Protected API routes
app.use("/api/trending", trendrouter);

app.use("/api/travelplaces", travelingplacesroute);

app.use("/api/safari", safariRouter);

app.use("/api/vehicle", vehicleRouter);

app.use("/api/vendor", vendorrouter);

app.use("/api/ads", adsRouter);

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

server.listen(port, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${port}`);
  console.log(`🌐 Accessible at: http://13.49.78.21:${port}`);
});
