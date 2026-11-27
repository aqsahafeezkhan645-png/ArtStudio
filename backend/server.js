
// Load environment variables before loading routes
import "dotenv/config";

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// ========================================
// ROUTES
// ========================================

import storeSettingRoutes from "./routes/storeSetting.js";
import productRoutes from "./routes/productRoutes.js";
import siteContentRoutes from "./routes/siteContent.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ========================================
// TEST API
// ========================================

app.get("/", (req, res) => {
  res.status(200).json({
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

// CONTACT US EMAIL API
app.use("/api/contact", contactRoutes);

// ========================================
// NOT FOUND ROUTE
// ========================================

app.use((req, res) => {
  res.status(404).json({
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

  res.status(500).json({
    success: false,
    message: "An unexpected server error occurred."
  });
});

// ========================================
// START SERVER
// ========================================

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing in the .env file."
      );
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        "JWT_SECRET is missing in the .env file."
      );
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(
        `ArtStudio backend running on port ${PORT}`
      );

      console.log(
        `Authentication routes: http://localhost:${PORT}/api/auth`
      );

      console.log(
        `Products API: http://localhost:${PORT}/api/products`
      );

      console.log(
        `Store Settings API: http://localhost:${PORT}/api/store-settings`
      );

      console.log(
        `Contact API: http://localhost:${PORT}/api/contact`
      );
    });

  } catch (error) {
    console.error(
      "Backend startup failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();
