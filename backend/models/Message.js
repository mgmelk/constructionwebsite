const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.Mixed,
    },
    recipientName: {
      type: String,
      default: "David Engineer",
    },
    recipientPhone: {
      type: String,
      default: "+251929581296",
    },
    project: {
      type: mongoose.Schema.Types.Mixed,
    },
    projectName: {
      type: String,
      default: "MG Building Commercial Complex",
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Open", "Replied", "Resolved"],
      default: "Open",
    },
    replies: [
      {
        sender: {
          type: mongoose.Schema.Types.Mixed,
        },
        senderName: {
          type: String,
          required: true,
        },
        senderRole: {
          type: String,
          default: "engineer",
        },
        body: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Message", messageSchema);
