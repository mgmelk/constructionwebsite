const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    employeeId: {
      type: String,
      unique: true,
      required: true,
    },

    accessLevel: {
      type: String,
      enum: ["Super Admin", "Admin"],
      default: "Admin",
    },

    permissions: {
      manageUsers: {
        type: Boolean,
        default: true,
      },

      manageProjects: {
        type: Boolean,
        default: true,
      },

      manageEmployees: {
        type: Boolean,
        default: true,
      },

      manageClients: {
        type: Boolean,
        default: true,
      },

      manageMaterials: {
        type: Boolean,
        default: true,
      },

      manageEquipment: {
        type: Boolean,
        default: true,
      },

      manageFinance: {
        type: Boolean,
        default: true,
      },

      viewReports: {
        type: Boolean,
        default: true,
      },

      manageSettings: {
        type: Boolean,
        default: true,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Admin", adminSchema);