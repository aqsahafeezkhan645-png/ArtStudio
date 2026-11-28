import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";

import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// =====================================
// EMAIL CONFIGURATION
// =====================================

const mailTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// =====================================
// PASSWORD RESET RATE LIMITER
// =====================================

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many attempts. Please try again later."
  }
});

// =====================================
// COOKIE SETTINGS
// =====================================

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/"
};

// =====================================
// CREATE JWT TOKEN
// =====================================

const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign(
    {
      userId: user._id.toString(),
      tokenVersion: user.tokenVersion || 0
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// =====================================
// RETURN SAFE USER DATA
// =====================================

const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  address: user.address,
  city: user.city,
  postalCode: user.postalCode,
  role: user.role
});

// =====================================
// CUSTOMER SIGNUP
// =====================================

router.post("/signup", async (req, res) => {
  try {
    const {
      fullName,
      name,
      email,
      password,
      phone,
      address,
      city,
      postalCode
    } = req.body;

    const userName = String(fullName || name || "").trim();
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!userName || !normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    if (
      typeof password !== "string" ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "Password must contain 8 to 72 characters."
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: userName,
      email: normalizedEmail,
      password: hashedPassword,
      phone: phone || "",
      address: address || "",
      city: city || "",
      postalCode: postalCode || "",
      role: "customer"
    });

    const token = createToken(user);

    res.cookie("artstudio_token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(201).json({
      success: true,
      message: "Account created successfully.",
      user: safeUser(user)
    });

  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create your account."
    });
  }
});

// =====================================
// CUSTOMER / ADMIN LOGIN
// =====================================

router.post("/login", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = req.body.password;

    if (!email || !password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Email and password are required."
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    const token = createToken(user);

    res.cookie("artstudio_token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      user: safeUser(user)
    });

  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to log in."
    });
  }
});

// =====================================
// CHECK CURRENT LOGIN SESSION
// =====================================

router.get("/me", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    user: safeUser(req.user)
  });
});

// =====================================
// UPDATE CUSTOMER PROFILE
// =====================================

router.put("/profile", protect, async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      postalCode
    } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (
        typeof name !== "string" ||
        !name.trim() ||
        name.trim().length > 100
      ) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid name."
        });
      }

      updates.name = name.trim();
    }

    for (const field of [
      "phone",
      "address",
      "city",
      "postalCode"
    ]) {
      if (req.body[field] !== undefined) {
        if (
          typeof req.body[field] !== "string" ||
          req.body[field].length > 300
        ) {
          return res.status(400).json({
            success: false,
            message: `Invalid ${field}.`
          });
        }

        updates[field] = req.body[field].trim();
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No profile information was provided."
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: safeUser(updatedUser)
    });

  } catch (error) {
    console.error("Profile update error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile."
    });
  }
});

// =====================================
// CHANGE ADMIN LOGIN EMAIL
// =====================================

router.put("/admin/change-email", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only an administrator can use this setting."
      });
    }

    const newEmail = String(req.body.newEmail || "")
      .trim()
      .toLowerCase();

    const currentPassword = req.body.currentPassword;

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid new email address."
      });
    }

    if (typeof currentPassword !== "string" || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: "Your current password is required."
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user || !user.isActive) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found."
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "Your current password is incorrect."
      });
    }

    if (newEmail === user.email) {
      return res.status(400).json({
        success: false,
        message: "This is already your current login email."
      });
    }

    const emailAlreadyUsed = await User.findOne({
      email: newEmail,
      _id: { $ne: user._id }
    });

    if (emailAlreadyUsed) {
      return res.status(409).json({
        success: false,
        message: "This email is already being used by another account."
      });
    }

    user.email = newEmail;
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    const token = createToken(user);

    res.cookie("artstudio_token", token, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Admin login email updated successfully.",
      user: safeUser(user)
    });

  } catch (error) {
    console.error("Admin email change error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This email is already being used by another account."
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to update the admin login email."
    });
  }
});

// =====================================
// CHANGE PASSWORD - LOGGED IN USER
// =====================================

router.put("/change-password", protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string"
    ) {
      return res.status(400).json({
        success: false,
        message: "Please enter your current and new passwords."
      });
    }

    if (
      newPassword.length < 8 ||
      newPassword.length > 72
    ) {
      return res.status(400).json({
        success: false,
        message: "New password must contain 8 to 72 characters."
      });
    }

    const user = await User.findById(req.user._id)
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found."
      });
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "Your current password is incorrect."
      });
    }

    const samePassword = await bcrypt.compare(
      newPassword,
      user.password
    );

    if (samePassword) {
      return res.status(400).json({
        success: false,
        message: "Please choose a different password."
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    // Invalidate previous login sessions.
    user.tokenVersion = (user.tokenVersion || 0) + 1;

    await user.save();

    // Issue a fresh login cookie for the current user.
    const newToken = createToken(user);

    res.cookie("artstudio_token", newToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully."
    });

  } catch (error) {
    console.error("Change password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to change password."
    });
  }
});

// =====================================
// FORGOT PASSWORD - SEND RESET EMAIL
// =====================================

router.post(
  "/forgot-password",
  passwordResetLimiter,
  async (req, res) => {
    const genericMessage =
      "If an account exists with that email, a password reset link will be sent shortly.";

    try {
      const email = String(req.body.email || "")
        .trim()
        .toLowerCase();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(200).json({
          success: true,
          message: genericMessage
        });
      }

      const user = await User.findOne({ email });

      // Do not reveal whether an email is registered.
      if (!user || !user.isActive) {
        return res.status(200).json({
          success: true,
          message: genericMessage
        });
      }

      if (
        !process.env.FRONTEND_URL ||
        !process.env.SMTP_USER ||
        !process.env.SMTP_PASS
      ) {
        throw new Error("Email configuration is incomplete.");
      }

      // Generate a secure random token.
      const resetToken = crypto.randomBytes(32).toString("hex");

      // Store only the token hash.
      user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

      // Expire after 15 minutes.
      user.resetPasswordExpires = new Date(
        Date.now() + 15 * 60 * 1000
      );

      await user.save();

      const frontendUrl = process.env.FRONTEND_URL.replace(/\/+$/, "");

      const resetUrl =
        `${frontendUrl}/reset-password/${resetToken}`;

      try {
        await mailTransporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: user.email,
          subject: "Reset your ArtStudio password",

          text: `We received a request to reset your ArtStudio password.

Open this link within 15 minutes:
${resetUrl}

If you did not request this, you can ignore this email.`,

          html: `
            <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 28px; color: #302744;">
              <h2 style="color: #7952e8;">Reset your ArtStudio password</h2>

              <p>We received a request to reset your account password.</p>

              <p>This secure link expires in 15 minutes.</p>

              <p style="margin: 28px 0;">
                <a href="${resetUrl}"
                   style="background: #7952e8; color: white; padding: 13px 22px; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Reset Password
                </a>
              </p>

              <p>If the button does not work, copy this link into your browser:</p>

              <p style="word-break: break-all;">${resetUrl}</p>

              <p>If you did not request this, ignore this email.</p>
            </div>
          `
        });

      } catch (mailError) {
        // Invalidate the token if email delivery fails.
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        throw mailError;
      }

      return res.status(200).json({
        success: true,
        message: genericMessage
      });

    } catch (error) {
      console.error("Forgot password error:", error);

      // Do not expose account existence or internal errors.
      return res.status(200).json({
        success: true,
        message: genericMessage
      });
    }
  }
);

// =====================================
// RESET PASSWORD - VERIFY EMAIL TOKEN
// =====================================

router.post(
  "/reset-password/:token",
  passwordResetLimiter,
  async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (
        typeof token !== "string" ||
        !/^[a-f0-9]{64}$/i.test(token)
      ) {
        return res.status(400).json({
          success: false,
          message: "This reset link is invalid or has expired."
        });
      }

      if (
        typeof newPassword !== "string" ||
        newPassword.length < 8 ||
        newPassword.length > 72
      ) {
        return res.status(400).json({
          success: false,
          message: "Password must contain 8 to 72 characters."
        });
      }

      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

      const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: new Date() },
        isActive: true
      }).select(
        "+resetPasswordToken +resetPasswordExpires +password"
      );

      if (!user) {
        return res.status(400).json({
          success: false,
          message: "This reset link is invalid or has expired. Please request a new one."
        });
      }

      user.password = await bcrypt.hash(newPassword, 12);

      // Make the reset link single-use.
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      // Invalidate all previously issued JWT sessions.
      user.tokenVersion = (user.tokenVersion || 0) + 1;

      await user.save();

      return res.status(200).json({
        success: true,
        message: "Your password has been reset successfully. Please log in again."
      });

    } catch (error) {
      console.error("Reset password error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to reset your password. Please try again."
      });
    }
  }
);

// =====================================
// LOGOUT
// =====================================

router.post("/logout", (req, res) => {
  res.clearCookie("artstudio_token", cookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully."
  });
});

// =====================================
// ADMIN - GET REGISTERED CUSTOMER COUNT
// =====================================

router.get("/admin/customer-count", protect, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only administrators can view customer statistics."
      });
    }

    const customerCount = await User.countDocuments({
      role: "customer"
    });

    return res.status(200).json({
      success: true,
      customerCount
    });
  } catch (error) {
    console.error("Customer count error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load customer count."
    });
  }
});

export default router;