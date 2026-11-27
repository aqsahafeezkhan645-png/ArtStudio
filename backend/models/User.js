
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    phone: {
      type: String,
      default: ""
    },

    address: {
      type: String,
      default: ""
    },

    city: {
      type: String,
      default: ""
    },

    postalCode: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["customer", "admin"],
      default: "customer"
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // FORGOT PASSWORD: hashed reset token
    resetPasswordToken: {
      type: String,
      default: undefined,
      select: false
    },

    // Reset link expiration time
    resetPasswordExpires: {
      type: Date,
      default: undefined,
      select: false
    },

    // Invalidates previously issued JWT sessions
    tokenVersion: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model("User", userSchema);

export default User;
