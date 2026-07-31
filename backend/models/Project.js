const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, default: "Project Image" },
  uploadedAt: { type: Date, default: Date.now },
});

const documentSchema = new mongoose.Schema({
  url: { type: String, required: true },
  name: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const paymentSchema = new mongoose.Schema({
  id: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: String, default: "" },
  status: { type: String, enum: ["Paid", "Unpaid", "Pending Approval"], default: "Unpaid" },
  paymentMethod: { type: String, default: "Bank Wire Transfer" },
  receiptRef: { type: String, default: "" },
  receiptUrl: { type: String, default: "" },
  submittedAt: { type: Date, default: null },
});

const DEFAULT_PAYMENTS = [
  { id: "INV-20M-01", description: "Phase 1 Milestone Payment (Mobilization & Initial Clearance)", amount: 20000000, date: "2026-08-01", status: "Unpaid" },
  { id: "INV-30M-02", description: "Phase 2 Milestone Payment (Substructure & Foundation)", amount: 30000000, date: "2026-12-01", status: "Unpaid" },
  { id: "INV-50M-03", description: "Phase 3 Milestone Payment (Superstructure & Floor Concrete)", amount: 50000000, date: "2027-06-01", status: "Unpaid" },
  { id: "INV-50M-04", description: "Phase 4 Milestone Payment (MEP, Glass Facade & Final Handover)", amount: 50000000, date: "2028-05-01", status: "Unpaid" },
];

const projectSchema = new mongoose.Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },

    projectCode: {
      type: String,
      required: true,
      trim: true,
    },

    client: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    engineers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    description: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    budget: {
      type: Number,
      default: 150000000,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    endDate: {
      type: Date,
      default: null,
    },

    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"],
      default: "Planning",
    },

    images: [imageSchema],

    documents: [documentSchema],

    payments: {
      type: [paymentSchema],
      default: DEFAULT_PAYMENTS,
    },

    milestones: {
      type: [
        {
          title: { type: String, default: "" },
          date: { type: String, default: "" },
          progress: { type: Number, default: 0, min: 0, max: 100 },
          status: { type: String, default: "Scheduled" },
        }
      ],
      default: [],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", projectSchema);