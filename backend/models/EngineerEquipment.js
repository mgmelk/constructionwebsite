const mongoose = require("mongoose");

const engineerEquipmentSchema = new mongoose.Schema(
  {
    engineer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    name: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Available", "In Use", "Maintenance", "Offline"],
      default: "Available",
    },
    location: { type: String, default: "Site" },
    lastChecked: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EngineerEquipment", engineerEquipmentSchema);
