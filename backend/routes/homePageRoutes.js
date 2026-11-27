
import express from "express";
import multer from "multer";
import { Readable } from "stream";
import HomePage from "../models/HomePage.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPG, PNG and WEBP images are allowed."));
  }
});

function requireAdmin(req, res, next) {
  if (
    !process.env.ADMIN_API_KEY ||
    req.header("x-admin-key") !== process.env.ADMIN_API_KEY
  ) {
    return res.status(401).json({
      success: false,
      message: "Admin authorization required."
    });
  }
  next();
}

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "artstudio/homepage", resource_type: "image" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
}

const defaultCategories = [
  {
    title: "Birthday Cards",
    category: "Birthday",
    subtitle: "Whimsical blooms & festive notes",
    image: "",
    count: "14 Designs"
  },
  {
    title: "Anniversary Cards",
    category: "Anniversary",
    subtitle: "Twin botanical bouquets & heartfelt vows",
    image: "",
    count: "9 Designs"
  },
  {
    title: "Wedding Cards",
    category: "Wedding",
    subtitle: "Embossed foil & dried florals",
    image: "",
    count: "11 Designs"
  },
  {
    title: "Love & Friendship",
    category: "Friendship",
    subtitle: "Kindred spirits & pure warmth",
    image: "",
    count: "16 Designs"
  },
  {
    title: "Thank You Cards",
    category: "Thank You",
    subtitle: "Pressed purple pansies & gratitude",
    image: "",
    count: "8 Designs"
  },
  {
    title: "Congratulations",
    category: "Congratulations",
    subtitle: "Golden blossoms for shining moments",
    image: "",
    count: "10 Designs"
  }
];

router.get("/", async (req, res) => {
  try {
    let page = await HomePage.findOne();

    if (!page) {
      page = await HomePage.create({
        categories: defaultCategories
      });
    }

    res.json({ success: true, homePage: page });
  } catch (error) {
    console.error("Get homepage:", error);
    res.status(500).json({
      success: false,
      message: "Unable to load homepage content."
    });
  }
});

router.put(
  "/",
  requireAdmin,
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "categoryImage_0", maxCount: 1 },
    { name: "categoryImage_1", maxCount: 1 },
    { name: "categoryImage_2", maxCount: 1 },
    { name: "categoryImage_3", maxCount: 1 },
    { name: "categoryImage_4", maxCount: 1 },
    { name: "categoryImage_5", maxCount: 1 },
    { name: "categoryImage_6", maxCount: 1 },
    { name: "categoryImage_7", maxCount: 1 },
    { name: "categoryImage_8", maxCount: 1 },
    { name: "categoryImage_9", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const data = JSON.parse(req.body.homePage);
      let page = await HomePage.findOne();

      if (!page) page = new HomePage();

      const oldHeroId = page.hero?.imagePublicId;

      const hero = { ...data.hero };

      if (req.files?.heroImage?.[0]) {
        const uploaded = await uploadToCloudinary(
          req.files.heroImage[0].buffer
        );
        hero.image = uploaded.secure_url;
        hero.imagePublicId = uploaded.public_id;
      }

      if (
        req.files?.heroImage?.[0] &&
        oldHeroId
      ) {
        await cloudinary.uploader.destroy(oldHeroId);
      }

      const categories = Array.isArray(data.categories)
        ? data.categories
        : [];

      for (let i = 0; i < categories.length; i++) {
        const file = req.files?.[`categoryImage_${i}`]?.[0];

        if (file) {
          const uploaded = await uploadToCloudinary(file.buffer);

          if (categories[i].cloudinaryPublicId) {
            await cloudinary.uploader.destroy(
              categories[i].cloudinaryPublicId
            );
          }

          categories[i].image = uploaded.secure_url;
          categories[i].cloudinaryPublicId = uploaded.public_id;
        }
      }

      page.hero = hero;
      page.categoriesHeading = data.categoriesHeading || "";
      page.categoriesSubtitle = data.categoriesSubtitle || "";
      page.categories = categories;

      await page.save();

      res.json({
        success: true,
        message: "Homepage updated successfully.",
        homePage: page
      });
    } catch (error) {
      console.error("Save homepage:", error);
      res.status(500).json({
        success: false,
        message: error.message || "Unable to save homepage."
      });
    }
  }
);

router.use((error, req, res, next) => {
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  next();
});

export default router;
