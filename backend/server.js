
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// ROUTES
import storeSettingRoutes from "./routes/storeSetting.js";
import productRoutes from "./routes/productRoutes.js";
import siteContentRoutes from "./routes/siteContent.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();

// ========================================
// VERCEL PROXY CONFIGURATION
// ========================================

app.set("trust proxy", 1);

// ========================================
// CORS CONFIGURATION
// ========================================

const allowedOrigins = [
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  "https://art-studio-psi-nine.vercel.app",
  "http://localhost:3000",
  "http://localhost:5173"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With"
    ]
  })
);

// ========================================
// MIDDLEWARE
// ========================================

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ========================================
// MONGODB CONNECTION
// ========================================

let connectionPromise = null;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is missing.");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => {
        console.log("MongoDB connected successfully!");
      })
      .catch((error) => {
        connectionPromise = null;
        throw error;
      });
  }

  await connectionPromise;
}

// ========================================
// DATABASE CONNECTION MIDDLEWARE
// ========================================

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error(
      "MongoDB connection error:",
      error.message
    );

    return res.status(503).json({
      success: false,
      message: "Database connection unavailable."
    });
  }
});

// ========================================
// TEST API
// ========================================

app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "ArtStudio API is running!"
  });
});

// ========================================
// API ROUTES
// ========================================

app.use("/api/auth", authRoutes);
app.use("/api/store-settings", storeSettingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/site-content", siteContentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/orders", orderRoutes);

// ========================================
// NOT FOUND
// ========================================

app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: "API route not found."
  });
});

// ========================================
// GLOBAL ERROR HANDLER
// ========================================

app.use((error, req, res, next) => {
  console.error("Server error:", error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred."
  });
});

// ========================================
// LOCAL DEVELOPMENT
// ========================================

if (process.env.VERCEL !== "1") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(
      `ArtStudio backend running on port ${PORT}`
    );
  });
}

// ========================================
// VERCEL EXPORT
// ========================================

export default app;
