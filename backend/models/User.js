const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    fullName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    phone: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: [
            "admin",
            "project_manager",
            "engineer",
            "architect",
            "site_supervisor",
            "accountant",
            "hr_manager",
            "employee",
            "client"
        ],
        default: "client"
    },

    profileImage: {
        type: String,
        default: ""
    },

    isActive: {
        type: Boolean,
        default: true
    },

    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpires: {
        type: Date,
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);