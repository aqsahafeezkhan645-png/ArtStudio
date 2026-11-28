
import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    default: null
  },

  name: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  quantity: {
    type: Number,
    required: true,
    min: 1
  },

  image: {
    type: String,
    default: ""
  },

  isCustom: {
    type: Boolean,
    default: false
  },

  customData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  }
}, { _id: false });


const orderSchema = new mongoose.Schema({

  orderNumber: {
    type: String,
    required: true,
    unique: true
  },

  customer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },

    fullName: {
      type: String,
      required: true
    },

    email: {
      type: String,
      default: ""
    },

    phone: {
      type: String,
      required: true
    }
  },

  items: {
    type: [orderItemSchema],
    required: true,
    validate: {
      validator: items => items.length > 0,
      message: "An order must contain at least one item."
    }
  },

  shippingDetails: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, default: "" },
    orderNotes: { type: String, default: "" }
  },

  subtotal: {
    type: Number,
    required: true,
    min: 0
  },

  deliveryFee: {
    type: Number,
    default: 0
  },

  discount: {
    type: Number,
    default: 0
  },

  total: {
    type: Number,
    required: true,
    min: 0
  },

  paymentMethod: {
    type: String,
    default: "Cash on Delivery"
  },

  status: {
    type: String,
    enum: [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ],
    default: "Pending"
  }

}, {
  timestamps: true
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
