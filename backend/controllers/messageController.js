const Message = require("../models/Message");
const User = require("../models/User");

// Send Direct Message from Client or User (Stored in Website DB)
const sendMessage = async (req, res) => {
  try {
    const { subject, body, recipientId, recipientName, recipientPhone, projectId, projectName } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ message: "Subject and message body are required" });
    }

    let senderId = req.user?.id || null;
    let senderName = req.user?.fullName || "Client User";
    let senderEmail = req.user?.email || "client@gmail.com";

    if (senderId) {
      const u = await User.findById(senderId);
      if (u) {
        senderName = u.fullName;
        senderEmail = u.email;
      }
    }

    const messageRecord = await Message.create({
      sender: senderId,
      senderName,
      senderEmail,
      recipient: recipientId || null,
      recipientName: recipientName || "David Engineer",
      recipientPhone: recipientPhone || "+251929581296",
      project: projectId || null,
      projectName: projectName || "MG Building Commercial Complex",
      subject: subject.trim(),
      body: body.trim(),
      read: false,
      status: "Open",
      replies: [],
    });

    console.log(`[In-App Message Saved] From ${senderName} to ${messageRecord.recipientName}: "${subject}"`);

    res.status(201).json({
      success: true,
      message: "Direct message sent successfully to Engineer Dashboard",
      data: messageRecord,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Reply to a Message Thread (For Engineers, Admins, or Clients)
const replyMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req.body;

    if (!body || !body.trim()) {
      return res.status(400).json({ message: "Reply text is required" });
    }

    const messageRecord = await Message.findById(id);
    if (!messageRecord) {
      return res.status(404).json({ message: "Message thread not found" });
    }

    let senderId = req.user?.id || null;
    let senderName = req.user?.fullName || req.body.senderName || "David Engineer";
    let senderRole = req.user?.role || req.body.senderRole || "engineer";

    if (senderId) {
      const u = await User.findById(senderId);
      if (u) {
        senderName = u.fullName;
        senderRole = u.role;
      }
    }

    messageRecord.replies.push({
      sender: senderId,
      senderName,
      senderRole,
      body: body.trim(),
      createdAt: new Date(),
    });

    messageRecord.status = "Replied";
    messageRecord.read = true; // Automatically mark parent message as read when replied

    await messageRecord.save();

    console.log(`[In-App Reply Posted] By ${senderName} (${senderRole}) on thread "${messageRecord.subject}"`);

    res.json({
      success: true,
      message: "Reply posted successfully to conversation thread",
      data: messageRecord,
    });
  } catch (error) {
    console.error("replyMessage error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get Direct Messages & Conversations
const getMessages = async (req, res) => {
  try {
    let filter = {};
    const role = req.user?.role;

    // If role is client, get messages sent by or to client
    if (role === "client") {
      filter = {
        $or: [
          { sender: req.user.id },
          { recipient: req.user.id },
          { senderEmail: req.user.email },
        ],
      };
    }
    // If role is engineer or admin or unauthenticated, get all messages (or filtered by recipient)

    const messages = await Message.find(filter).sort({ updatedAt: -1 });

    res.json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Mark Message as Read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const messageRecord = await Message.findByIdAndUpdate(id, { read: true }, { new: true });
    res.json({ success: true, message: messageRecord });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  replyMessage,
  getMessages,
  markAsRead,
};
