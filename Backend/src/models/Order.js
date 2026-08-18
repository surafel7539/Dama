import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ==============================
    // BUYER
    // ==============================
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ==============================
    // ORDER ITEMS
    // ==============================
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        seller: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        title: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // ==============================
    // TOTAL ORDER AMOUNT
    // ==============================
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ==============================
    // SHIPPING INFORMATION
    // ==============================
    shippingInfo: {
      fullName: {
        type: String,
        required: true,
        trim: true,
      },

      address: {
        type: String,
        required: true,
        trim: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
      },
    },

    // ==============================
    // PAYMENT METHOD
    // ==============================
    paymentMethod: {
      type: String,
      enum: ["telebirr", "card"],
      required: true,
    },

    // ==============================
    // ORDER STATUS
    // ==============================
    status: {
      type: String,
      enum: [
        "Pending",
        "In Transit",
        "Delivered",
      ],
      default: "Pending",
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);