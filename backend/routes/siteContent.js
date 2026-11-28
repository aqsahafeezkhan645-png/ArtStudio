
import express from "express";
import { randomUUID } from "node:crypto";
import multer from "multer";
import SiteContent from "../models/SiteContent.js";
import cloudinary from "../config/cloudinary.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

const ALLOWED_SECTIONS = [
  "header",
  "home",
  "about",
  "contact",
  "footer",
  "pages"
];

const ALLOWED_IMAGE_FIELDS = {
  header: ["logo"],
  home: ["heroImage"],
  about: ["image", "storyImage"]
};

const HOME_ARRAY_IMAGE_LIMITS = {
  categories: 6,
  instagramGallery: 4
};

const ABOUT_ARRAY_IMAGE_LIMITS = {
  galleryImages: 3
};

const CMS_IMAGE_FOLDER = "artstudio/site-content";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Only JPG, PNG and WEBP images are allowed.")
      );
    }

    cb(null, true);
  }
});

function isAllowedImageDestination(section, field, index) {
  if (ALLOWED_IMAGE_FIELDS[section]?.includes(field)) {
    return true;
  }

  if (
    section === "home" &&
    Object.prototype.hasOwnProperty.call(
      HOME_ARRAY_IMAGE_LIMITS,
      field
    )
  ) {
    return (
      Number.isInteger(index) &&
      index >= 0 &&
      index < HOME_ARRAY_IMAGE_LIMITS[field]
    );
  }

  if (
    section === "about" &&
    Object.prototype.hasOwnProperty.call(
      ABOUT_ARRAY_IMAGE_LIMITS,
      field
    )
  ) {
    return (
      Number.isInteger(index) &&
      index >= 0 &&
      index < ABOUT_ARRAY_IMAGE_LIMITS[field]
    );
  }

  return false;
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: CMS_IMAGE_FOLDER,
        resource_type: "image"
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        resolve(result);
      }
    );

    stream.end(buffer);
  });
}

// PUBLIC: Get website content.
router.get("/", async (req, res) => {
  try {
    let content = await SiteContent.findOne();

    if (!content) {
      content = await SiteContent.create({});
    }

    return res.status(200).json({
      success: true,
      content: content.toObject()
    });
  } catch (error) {
    console.error("CMS fetch error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load website content."
    });
  }
});

// ADMIN: Generate Cloudinary upload signature.
router.post(
  "/upload-signature",
  protect,
  adminOnly,
  (req, res) => {
    try {
      const { section, field, index } = req.body || {};

      if (!isAllowedImageDestination(section, field, index)) {
        return res.status(400).json({
          success: false,
          message: "Invalid CMS image destination."
        });
      }

      const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
      const apiKey = process.env.CLOUDINARY_API_KEY;
      const apiSecret = process.env.CLOUDINARY_API_SECRET;

      if (!cloudName || !apiKey || !apiSecret) {
        console.error(
          "Cloudinary environment variables are missing."
        );

        return res.status(500).json({
          success: false,
          message: "Cloudinary is not configured on the server."
        });
      }

      const timestamp = Math.floor(Date.now() / 1000);

      const suffix = Number.isInteger(index)
        ? `_${index}`
        : "";

      const publicId =
        `cms_${section}_${field}${suffix}_${randomUUID()}`;

      const paramsToSign = {
        folder: CMS_IMAGE_FOLDER,
        public_id: publicId,
        timestamp
      };

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret
      );

      return res.status(200).json({
        success: true,
        cloudName,
        apiKey,
        timestamp,
        folder: CMS_IMAGE_FOLDER,
        publicId,
        signature
      });
    } catch (error) {
      console.error("Cloudinary signature error:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to prepare secure image upload."
      });
    }
  }
);

// ADMIN: Upload image through backend.
router.post(
  "/upload-image",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select an image to upload."
        });
      }

      const { section, field, index } = req.body;

      if (!isAllowedImageDestination(section, field, index)) {
        return res.status(400).json({
          success: false,
          message: "Invalid CMS image destination."
        });
      }

      const result = await uploadToCloudinary(req.file.buffer);

      return res.status(200).json({
        success: true,
        message: "Image uploaded successfully.",
        imageUrl: result.secure_url,
        publicId: result.public_id
      });
    } catch (error) {
      console.error("CMS image upload error:", error);

      return res.status(500).json({
        success: false,
        message: error.message || "Unable to upload image."
      });
    }
  }
);

// ADMIN: Save website content.
router.put("/", protect, adminOnly, async (req, res) => {
  try {
    const updates = req.body;

    if (
      !updates ||
      typeof updates !== "object" ||
      Array.isArray(updates) ||
      Object.keys(updates).length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide valid website content."
      });
    }

    const invalidSections = Object.keys(updates).filter(
      key => !ALLOWED_SECTIONS.includes(key)
    );

    if (invalidSections.length > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid content section: " +
          invalidSections.join(", ")
      });
    }

    let content = await SiteContent.findOne();

    if (!content) {
      content = new SiteContent();
    }

    for (const section of Object.keys(updates)) {
      if (
        updates[section] === null ||
        typeof updates[section] !== "object" ||
        Array.isArray(updates[section])
      ) {
        return res.status(400).json({
          success: false,
          message: `Invalid data for ${section}.`
        });
      }

      content.set(section, updates[section]);
      content.markModified(section);
    }

    await content.save();

    const savedContent = await SiteContent.findById(content._id);

    return res.status(200).json({
      success: true,
      message: "Website content saved successfully.",
      content: savedContent.toObject()
    });
  } catch (error) {
    console.error("CMS save error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to save website content."
    });
  }
});

// Handle upload errors.
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    const message =
      error.code === "LIMIT_FILE_SIZE"
        ? "Image must be smaller than 5 MB."
        : error.message;

    return res.status(400).json({
      success: false,
      message
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message || "Image upload failed."
    });
  }

  next();
});

export default router;
