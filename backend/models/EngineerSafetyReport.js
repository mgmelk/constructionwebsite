const mongoose = require("mongoose");

const engineerSafetyReportSchema = new mongoose.Schema(
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
    hazard: { type: String, required: true, trim: true },
    severity: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Medium",
    },
    status: {
      type: String,
      enum: ["Open", "Mitigated", "Resolved"],
      default: "Open",
    },
    actionTaken: { type: String, default: "" },
    reportedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EngineerSafetyReport", engineerSafetyReportSchema);
