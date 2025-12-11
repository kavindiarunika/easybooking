import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";

import trendrouter from "./router/trendingRouter.js";
import loginrouter from "./controller/logincontroller.js";

const app = express();
const port = process.env.PORT || 4000;

// -------------------- 1. DATABASE CONNECTION --------------------
connectDB();

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

// -------------------- 5. ROOT & SERVER START --------------------

app.get("/", (req, res) => res.send("API working."));

app.listen(port, () =>
  console.log(
    `Server starting on port ${port} in ${
      process.env.NODE_ENV || "development"
    } mode.`
  )
);
