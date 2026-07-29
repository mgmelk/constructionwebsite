const mongoose = require("mongoose");

const engineerDailyReportSchema = new mongoose.Schema(
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
    reportDate: { type: Date, default: Date.now },
    summary: { type: String, required: true, trim: true },
    activities: [{ type: String, trim: true }],
    materials: [{ type: String, trim: true }],
    issues: [{ type: String, trim: true }],
    photos: [{ type: String }],
    status: {
      type: String,
      enum: ["Draft", "Submitted", "Reviewed"],
      default: "Submitted",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EngineerDailyReport", engineerDailyReportSchema);
