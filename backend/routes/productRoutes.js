
import express from "express";
import multer from "multer";
import { Readable } from "stream";
import { randomUUID } from "crypto";
import mongoose from "mongoose";

import Product from "../models/Product.js";
import StockReservation from "../models/StockReservation.js";
import cloudinary from "../config/cloudinary.js";
import { protect, adminOnly } from "../middleware/authmiddleware.js";

const router = express.Router();

// ==========================================
// IMAGE UPLOAD CONFIGURATION
// ==========================================

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPG, PNG and WEBP images are allowed."));
    }
  }
});

// ==========================================
// UPLOAD IMAGE TO CLOUDINARY
// ==========================================

function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "artstudio/products",
        resource_type: "image"
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    Readable.from(buffer).pipe(stream);
  });
}

// ==========================================
// GET ALL PRODUCTS
// PUBLIC ROUTE
// ==========================================

router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1
    });

    res.json({
      success: true,
      products
    });

  } catch (error) {
    console.error("Get products:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve products."
    });
  }
});

// ==========================================
// RESERVE STOCK
// CUSTOMER ROUTE
// ==========================================

router.post("/:id/reserve", async (req, res) => {
  try {
    const productId = req.params.id;
    const quantity = Number(req.body.quantity ?? 1);

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID."
      });
    }

    if (!Number.isSafeInteger(quantity) || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be a positive whole number."
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: productId,
        stock: { $gte: quantity }
      },
      {
        $inc: { stock: -quantity }
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      const existingProduct = await Product.findById(productId);

      if (!existingProduct) {
        return res.status(404).json({
          success: false,
          message: "Product not found."
        });
      }

      return res.status(409).json({
        success: false,
        message: "Not enough stock available.",
        stock: existingProduct.stock
      });
    }

    const token = randomUUID();

    try {
      await StockReservation.create({
        token,
        productId: product._id,
        quantity
      });

    } catch (reservationError) {
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: quantity }
      });

      throw reservationError;
    }

    res.json({
      success: true,
      message: "Stock reserved successfully.",
      token,
      stock: product.stock
    });

  } catch (error) {
    console.error("Reserve stock:", error);

    res.status(500).json({
      success: false,
      message: "Unable to reserve stock."
    });
  }
});

// ==========================================
// RELEASE STOCK
// CUSTOMER ROUTE
// ==========================================

router.post("/:id/release", async (req, res) => {
  try {
    const productId = req.params.id;
    const { token } = req.body;
    const quantity = Number(req.body.quantity);

    if (
      !mongoose.isValidObjectId(productId) ||
      typeof token !== "string" ||
      !token.trim() ||
      !Number.isSafeInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reservation details."
      });
    }

    const reservation = await StockReservation.findOneAndUpdate(
      {
        token,
        productId,
        quantity: { $gte: quantity }
      },
      {
        $inc: { quantity: -quantity }
      },
      {
        new: true
      }
    );

    if (!reservation) {
      return res.status(409).json({
        success: false,
        message: "Reservation not found or quantity is invalid."
      });
    }

    try {
      const product = await Product.findByIdAndUpdate(
        productId,
        { $inc: { stock: quantity } },
        { new: true }
      );

      if (!product) {
        throw new Error("Product not found while restoring stock.");
      }

    } catch (stockError) {
      await StockReservation.findByIdAndUpdate(
        reservation._id,
        { $inc: { quantity } }
      );

      throw stockError;
    }

    if (reservation.quantity === 0) {
      await StockReservation.deleteOne({
        _id: reservation._id,
        quantity: 0
      });
    }

    res.json({
      success: true,
      message: "Stock restored successfully."
    });

  } catch (error) {
    console.error("Release stock:", error);

    res.status(500).json({
      success: false,
      message: "Unable to restore stock."
    });
  }
});

// ==========================================
// COMMIT STOCK
// CUSTOMER CHECKOUT ROUTE
// ==========================================

router.post("/:id/commit", async (req, res) => {
  try {
    const productId = req.params.id;
    const { token } = req.body;

    if (
      !mongoose.isValidObjectId(productId) ||
      typeof token !== "string" ||
      !token.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reservation details."
      });
    }

    const reservation = await StockReservation.findOneAndDelete({
      token,
      productId
    });

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message: "Reservation not found or already confirmed."
      });
    }

    res.json({
      success: true,
      message: "Reserved stock confirmed."
    });

  } catch (error) {
    console.error("Commit stock:", error);

    res.status(500).json({
      success: false,
      message: "Unable to confirm reserved stock."
    });
  }
});

// ==========================================
// GET SINGLE PRODUCT
// PUBLIC ROUTE
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID."
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found."
      });
    }

    res.json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Get product:", error);

    res.status(500).json({
      success: false,
      message: "Unable to retrieve product."
    });
  }
});

// ==========================================
// ADMIN: ADD PRODUCT
// PROTECTED ROUTE
// ==========================================

router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      const {
        name,
        category,
        price,
        discountPrice,
        description,
        dimensions,
        paperType,
        envelope,
        stock,
        theme,
        isBestseller,
        isNew
      } = req.body;

      if (!name?.trim() || !category?.trim() || price === undefined) {
        return res.status(400).json({
          success: false,
          message: "Product name, category and price are required."
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "Please select a product image."
        });
      }

      const numericPrice = Number(price);
      const numericStock = Number(stock ?? 20);

      if (!Number.isFinite(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({
          success: false,
          message: "Enter a valid product price."
        });
      }

      if (!Number.isSafeInteger(numericStock) || numericStock < 0) {
        return res.status(400).json({
          success: false,
          message: "Stock must be a non-negative whole number."
        });
      }

      let numericDiscountPrice = null;

      if (discountPrice !== "" && discountPrice !== undefined) {
        numericDiscountPrice = Number(discountPrice);

        if (
          !Number.isFinite(numericDiscountPrice) ||
          numericDiscountPrice <= 0 ||
          numericDiscountPrice >= numericPrice
        ) {
          return res.status(400).json({
            success: false,
            message: "Discount price must be positive and less than the standard price."
          });
        }
      }

      const uploaded = await uploadToCloudinary(req.file.buffer);

      const product = await Product.create({
        name: name.trim(),
        category: category.trim(),
        price: numericPrice,
        discountPrice: numericDiscountPrice,
        description: description || "",
        dimensions: dimensions || '5" x 7"',
        paperType: paperType || "",
        envelope: envelope || "",
        stock: numericStock,
        theme: theme || "Floral",
        image: uploaded.secure_url,
        cloudinaryPublicId: uploaded.public_id,
        isBestseller: isBestseller === "true",
        isNew: isNew === "true"
      });

      res.status(201).json({
        success: true,
        message: "Product created successfully.",
        product
      });

    } catch (error) {
      console.error("Create product:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Unable to create product."
      });
    }
  }
);

// ==========================================
// ADMIN: UPDATE PRODUCT
// PROTECTED ROUTE
// ==========================================

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID."
        });
      }

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found."
        });
      }

      const fields = [
        "name",
        "category",
        "description",
        "dimensions",
        "paperType",
        "envelope",
        "theme"
      ];

      for (const field of fields) {
        if (req.body[field] !== undefined) {
          product[field] = req.body[field];
        }
      }

      if (req.body.price !== undefined) {
        const price = Number(req.body.price);

        if (!Number.isFinite(price) || price <= 0) {
          return res.status(400).json({
            success: false,
            message: "Enter a valid product price."
          });
        }

        product.price = price;
      }

      if (req.body.discountPrice !== undefined) {
        if (req.body.discountPrice === "") {
          product.discountPrice = null;
        } else {
          const discountPrice = Number(req.body.discountPrice);

          const finalPrice =
            req.body.price !== undefined
              ? Number(req.body.price)
              : product.price;

          if (
            !Number.isFinite(discountPrice) ||
            discountPrice <= 0 ||
            discountPrice >= finalPrice
          ) {
            return res.status(400).json({
              success: false,
              message: "Discount price must be positive and less than the standard price."
            });
          }

          product.discountPrice = discountPrice;
        }
      }

      if (req.body.stock !== undefined) {
        const stock = Number(req.body.stock);

        if (!Number.isSafeInteger(stock) || stock < 0) {
          return res.status(400).json({
            success: false,
            message: "Stock must be a non-negative whole number."
          });
        }

        product.stock = stock;
      }

      if (req.body.isBestseller !== undefined) {
        product.isBestseller = req.body.isBestseller === "true";
      }

      if (req.body.isNew !== undefined) {
        product.isNew = req.body.isNew === "true";
      }

      if (req.file) {
        const uploaded = await uploadToCloudinary(req.file.buffer);

        if (product.cloudinaryPublicId) {
          await cloudinary.uploader.destroy(
            product.cloudinaryPublicId
          );
        }

        product.image = uploaded.secure_url;
        product.cloudinaryPublicId = uploaded.public_id;
      }

      await product.save();

      res.json({
        success: true,
        message: "Product updated successfully.",
        product
      });

    } catch (error) {
      console.error("Update product:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Unable to update product."
      });
    }
  }
);

// ==========================================
// ADMIN: DELETE PRODUCT
// PROTECTED ROUTE
// ==========================================

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({
          success: false,
          message: "Invalid product ID."
        });
      }

      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found."
        });
      }

      const activeReservation = await StockReservation.exists({
        productId: product._id
      });

      if (activeReservation) {
        return res.status(409).json({
          success: false,
          message: "This product has active cart reservations and cannot be deleted yet."
        });
      }

      if (product.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(
          product.cloudinaryPublicId
        );
      }

      await product.deleteOne();

      res.json({
        success: true,
        message: "Product deleted successfully."
      });

    } catch (error) {
      console.error("Delete product:", error);

      res.status(500).json({
        success: false,
        message: "Unable to delete product."
      });
    }
  }
);

// ==========================================
// HANDLE UPLOAD ERRORS
// ==========================================

router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Image must be smaller than 5 MB."
          : error.message
    });
  }

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next();
});

export default router;
