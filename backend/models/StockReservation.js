
import mongoose from "mongoose";

const stockReservationSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Reservation quantity must be a whole number."
      }
    }
  },
  {
    timestamps: true
  }
);

const StockReservation = mongoose.model(
  "StockReservation",
  stockReservationSchema
);

export default StockReservation;
