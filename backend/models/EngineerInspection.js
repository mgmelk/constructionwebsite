const mongoose = require("mongoose");

const engineerInspectionSchema = new mongoose.Schema(
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
    title: { type: String, required: true, trim: true },
    checklist: [{ type: String, trim: true }],
    result: {
      type: String,
      enum: ["Pass", "Needs Attention", "Fail"],
      default: "Pass",
    },
    inspector: { type: String, default: "Engineer" },
    inspectionDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EngineerInspection", engineerInspectionSchema);
