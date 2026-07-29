const mongoose = require("mongoose");

const engineerNotificationSchema = new mongoose.Schema(
  {
    engineer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Info", "Warning", "Success", "Critical"],
      default: "Info",
    },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EngineerNotification", engineerNotificationSchema);
