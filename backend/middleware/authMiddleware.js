
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// =====================================
// PROTECT ROUTES - AUTHENTICATION
// =====================================

export const protect = async (req, res, next) => {
  try {
    // Check JWT secret configuration
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not configured.");

      return res.status(500).json({
        success: false,
        message: "Server authentication is not configured."
      });
    }

    // Read token from HTTP-only cookie
    const token = req.cookies?.artstudio_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please log in to access this resource."
      });
    }

    // Verify JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Make sure the token contains a user ID
    if (!decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token."
      });
    }

    // Find current user in MongoDB
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists."
      });
    }

    // Check whether account is active
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been deactivated."
      });
    }

    // Invalidate old sessions after password reset/change
    if (
      (decoded.tokenVersion || 0) !==
      (user.tokenVersion || 0)
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session has expired. Please log in again."
      });
    }

    // Attach authenticated user to request
    req.user = user;

    next();

  } catch (error) {
    console.error("Authentication error:", error.message);

    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or expired. Please log in again."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Authentication failed. Please try again."
    });
  }
};

// =====================================
// ADMIN ONLY ROUTES
// =====================================

export const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Please log in first."
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges are required."
    });
  }

  next();
};
