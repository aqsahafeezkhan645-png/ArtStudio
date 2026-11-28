
import express from "express";
import mongoose from "mongoose";

import Order from "../models/order.js";
import Product from "../models/Product.js";
import StockReservation from "../models/StockReservation.js";

import {
  protect,
  adminOnly
} from "../middleware/authMiddleware.js";

const router = express.Router();

// ==========================================
// CREATE ORDER
// POST /api/orders
// PUBLIC ROUTE - GUEST CHECKOUT SUPPORTED
// ==========================================

router.post("/", async (req, res) => {
  const deletedReservations = [];

  try {
    const { items, shippingDetails } = req.body;

    // Validate cart
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your shopping cart is empty."
      });
    }

    // Validate shipping details
    if (
      !shippingDetails ||
      !shippingDetails.fullName?.trim() ||
      !shippingDetails.phone?.trim() ||
      !shippingDetails.address?.trim() ||
      !shippingDetails.city?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required shipping details."
      });
    }

    const orderItems = [];
    const reservationsToDelete = [];
    const usedTokens = new Set();

    let subtotal = 0;

    // ======================================
    // VALIDATE CART ITEMS
    // ======================================

    for (const item of items) {
      const quantity = Number(item.quantity);

      if (
        !Number.isSafeInteger(quantity) ||
        quantity < 1
      ) {
        throw new Error("Invalid product quantity.");
      }

      // CUSTOM CARD
      if (item.isCustom) {
        const price = Number(item.price);

        if (!Number.isFinite(price) || price < 0) {
          throw new Error("Invalid custom card price.");
        }

        orderItems.push({
          productId: null,
          name: item.name || "Custom Greeting Card",
          price,
          quantity,
          image: item.image || "",
          isCustom: true,
          customData: item.customData || {}
        });

        subtotal += price * quantity;

        continue;
      }

      // REGULAR PRODUCT
      if (!mongoose.isValidObjectId(item.id)) {
        throw new Error("Invalid product ID.");
      }

      const product = await Product.findById(item.id);

      if (!product) {
        throw new Error(
          `Product "${item.name || "Unknown"}" was not found.`
        );
      }

      // Validate reservation list
      const reservations = Array.isArray(item.reservations)
        ? item.reservations
        : [];

      if (reservations.length === 0) {
        throw new Error(
          `Stock reservation missing for ${product.name}. Remove this item and add it again.`
        );
      }

      let reservedQuantity = 0;

      for (const reservation of reservations) {
        const token = reservation.token;
        const reservedAmount = Number(reservation.quantity);

        if (
          typeof token !== "string" ||
          !token.trim() ||
          !Number.isSafeInteger(reservedAmount) ||
          reservedAmount < 1 ||
          usedTokens.has(token)
        ) {
          throw new Error(
            `Invalid stock reservation for ${product.name}.`
          );
        }

        usedTokens.add(token);

        reservedQuantity += reservedAmount;

        reservationsToDelete.push({
          token,
          productId: product._id,
          quantity: reservedAmount
        });
      }

      if (reservedQuantity !== quantity) {
        throw new Error(
          `Reserved quantity does not match cart quantity for ${product.name}.`
        );
      }

      // Always use the database price for regular products
      const price = Number(
        product.discountPrice || product.price
      );

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(
          `Invalid price for ${product.name}.`
        );
      }

      orderItems.push({
        productId: product._id,
        name: product.name,
        price,
        quantity,
        image: product.image || "",
        isCustom: false
      });

      subtotal += price * quantity;
    }

    // ======================================
    // VERIFY AND DELETE RESERVATIONS
    // ======================================

    for (const expected of reservationsToDelete) {
      const reservation = await StockReservation.findOneAndDelete({
        token: expected.token,
        productId: expected.productId,
        quantity: expected.quantity
      });

      if (!reservation) {
        throw new Error(
          "A stock reservation has expired or is invalid. Please refresh your cart and try again."
        );
      }

      // Save immediately so failed orders can restore reservations
      deletedReservations.push(reservation);
    }

    // ======================================
    // CALCULATE TOTAL
    // ======================================

    const deliveryFee = subtotal > 3000 ? 0 : 250;
    const discount = 0;
    const total = subtotal + deliveryFee - discount;

    // ======================================
    // GENERATE ORDER NUMBER
    // ======================================

    const orderNumber =
      `ART-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

    // ======================================
    // SAVE ORDER IN MONGODB
    // ======================================

    const newOrder = await Order.create({
      orderNumber,

      customer: {
        fullName: shippingDetails.fullName.trim(),
        email: shippingDetails.email?.trim() || "",
        phone: shippingDetails.phone.trim()
      },

      items: orderItems,

      shippingDetails: {
        fullName: shippingDetails.fullName.trim(),
        phone: shippingDetails.phone.trim(),
        email: shippingDetails.email?.trim() || "",
        address: shippingDetails.address.trim(),
        city: shippingDetails.city.trim(),
        postalCode: shippingDetails.postalCode?.trim() || "",
        orderNotes: shippingDetails.orderNotes?.trim() || ""
      },

      subtotal,
      deliveryFee,
      discount,
      total,

      // Must match the Order.js model enum
      paymentMethod: "COD",
      status: "Pending"
    });

    // ======================================
    // SUCCESS RESPONSE
    // ======================================

    return res.status(201).json({
      success: true,
      message: "Your order has been placed successfully!",
      order: newOrder
    });

  } catch (error) {
    console.error("Create order error:", error);

    // ======================================
    // RESTORE RESERVATIONS IF ORDER FAILED
    // ======================================

    if (deletedReservations.length > 0) {
      try {
        for (const reservation of deletedReservations) {
          const alreadyExists = await StockReservation.exists({
            token: reservation.token
          });

          if (!alreadyExists) {
            await StockReservation.create({
              token: reservation.token,
              productId: reservation.productId,
              quantity: reservation.quantity
            });
          }
        }
      } catch (restoreError) {
        console.error(
          "Reservation restoration error:",
          restoreError
        );
      }
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to place your order."
    });
  }
});

// ==========================================
// GET ALL ORDERS - ADMIN ONLY
// GET /api/orders
// ==========================================

router.get("/", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load orders."
    });
  }
});

export default router;
