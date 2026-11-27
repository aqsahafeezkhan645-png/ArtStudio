
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discountPrice: {
      type: Number,
      default: null,
      min: 0
    },

    description: {
      type: String,
      default: ""
    },

    dimensions: {
      type: String,
      default: '5" x 7"'
    },

    paperType: {
      type: String,
      default: ""
    },

    envelope: {
      type: String,
      default: ""
    },

    stock: {
      type: Number,
      default: 20,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Stock must be a whole number."
      }
    },

    theme: {
      type: String,
      default: "Floral"
    },

    image: {
      type: String,
      required: true
    },

    cloudinaryPublicId: {
      type: String,
      default: ""
    },

    isBestseller: {
      type: Boolean,
      default: false
    },

    isNew: {
      type: Boolean,
      default: true
    },

    rating: {
      type: Number,
      default: 5
    },

    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
