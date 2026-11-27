
import mongoose from "mongoose";

// ========================================
// STORE SETTINGS SCHEMA
// ========================================

const storeSettingSchema = new mongoose.Schema(
  {
    // Contact Information
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },

    phone: {
      type: String,
      required: true,
      trim: true
    },

    address: {
      type: String,
      required: true,
      trim: true
    },

    workingHours: {
      type: String,
      required: true,
      trim: true
    },

    // Social Media Accounts
    instagram: {
      type: String,
      default: "",
      trim: true
    },

    facebook: {
      type: String,
      default: "",
      trim: true
    },

    tiktok: {
      type: String,
      default: "",
      trim: true
    },

    pinterest: {
      type: String,
      default: "",
      trim: true
    },

    youtube: {
      type: String,
      default: "",
      trim: true
    },

    // Website Branding
    storeName: {
      type: String,
      default: "ArtStudio",
      trim: true
    },

    tagline: {
      type: String,
      default: "Handmade & Customized",
      trim: true
    },

    announcement: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// ========================================
// PREVENT MODEL OVERWRITE ERROR
// ========================================

const StoreSetting =
  mongoose.models.StoreSetting ||
  mongoose.model("StoreSetting", storeSettingSchema);

// ========================================
// EXPORT MODEL
// ========================================

export default StoreSetting;
