

import express from "express";
import StoreSetting from "../models/StoreSetting.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";


const router = express.Router();

const DEFAULT_SETTINGS = {
  email: "hello@artstudio.cards",
  phone: "+92 300 1234567",
  address: "ArtStudio Workshop, Gulberg III, Lahore, Pakistan",
  workingHours: "Mon - Sat: 10:00 AM - 8:00 PM PKT",

  instagram: "",
  facebook: "",
  tiktok: "",
  pinterest: "",
  youtube: "",

  storeName: "ArtStudio",
  tagline: "Handmade & Customized",
  announcement: ""
};

// GET: Public access to store information
// Customers need this information for the Contact page.
router.get("/", async (req, res) => {
  try {
    let settings = await StoreSetting.findOne();

    if (!settings) {
      settings = await StoreSetting.create(DEFAULT_SETTINGS);
    }

    return res.status(200).json({
      success: true,
      settings
    });

  } catch (error) {
    console.error("GET store settings:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to retrieve store information."
    });
  }
});

// PUT: Only authenticated admins can update settings
router.put("/", protect, adminOnly, async (req, res) => {
  try {
    const {
      email,
      phone,
      address,
      workingHours,
      instagram,
      facebook,
      tiktok,
      pinterest,
      youtube,
      storeName,
      tagline,
      announcement
    } = req.body;

    // Validate required fields
    const requiredFields = {
      email,
      phone,
      address,
      workingHours,
      storeName
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (typeof value !== "string" || !value.trim()) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`
        });
      }
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address."
      });
    }

    // Validate optional text fields
    const optionalFields = {
      instagram,
      facebook,
      tiktok,
      pinterest,
      youtube,
      tagline,
      announcement
    };

    for (const [field, value] of Object.entries(optionalFields)) {
      if (value !== undefined && typeof value !== "string") {
        return res.status(400).json({
          success: false,
          message: `${field} must be text.`
        });
      }
    }

    // Validate social media URLs
    const urlFields = {
      instagram,
      facebook,
      tiktok,
      pinterest,
      youtube
    };

    for (const [field, value] of Object.entries(urlFields)) {
      if (value && value.trim()) {
        try {
          const parsed = new URL(value.trim());

          if (!["http:", "https:"].includes(parsed.protocol)) {
            throw new Error("Invalid URL protocol");
          }
        } catch {
          return res.status(400).json({
            success: false,
            message: `Please enter a valid ${field} URL starting with https://`
          });
        }
      }
    }

    // Prepare MongoDB update
    const update = {
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      workingHours: workingHours.trim(),

      instagram: (instagram || "").trim(),
      facebook: (facebook || "").trim(),
      tiktok: (tiktok || "").trim(),
      pinterest: (pinterest || "").trim(),
      youtube: (youtube || "").trim(),

      storeName: storeName.trim(),
      tagline: (tagline || "").trim(),
      announcement: (announcement || "").trim()
    };

    const settings = await StoreSetting.findOneAndUpdate(
      {},
      update,
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    return res.status(200).json({
      success: true,
      message: "Website settings updated successfully!",
      settings
    });

  } catch (error) {
    console.error("UPDATE store settings:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update website settings."
    });
  }
});

export default router;
