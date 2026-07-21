const mongoose = require("mongoose");

const quoteSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      default: "",
    },
    projectType: {
      type: String,
      required: true,
    },
    projectSize: {
      type: String,
      required: true,
    },
    budget: {
      type: String,
      default: "",
    },
    details: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Estimated", "Sent"],
      default: "Pending",
    },
    estimate: {
      materialsCost: { type: Number, default: 0 },
      laborCost: { type: Number, default: 0 },
      otherCost: { type: Number, default: 0 },
      totalCost: { type: Number, default: 0 },
      estimatedDays: { type: String, default: "" },
      message: { type: String, default: "" },
      sentAt: { type: Date },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quote", quoteSchema);
