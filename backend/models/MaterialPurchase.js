const mongoose = require("mongoose");

const materialPurchaseSchema = new mongoose.Schema(
  {
    materialName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    unit: {
      type: String,
      default: "pcs",
      trim: true,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    supplier: {
      type: String,
      default: "",
      trim: true,
    },
    invoiceNumber: {
      type: String,
      default: "",
      trim: true,
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    purchasedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Received", "Canceled"],
      default: "Pending",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("MaterialPurchase", materialPurchaseSchema);
