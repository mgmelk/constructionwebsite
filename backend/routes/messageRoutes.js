const express = require("express");
const router = express.Router();
const { sendMessage, replyMessage, getMessages, markAsRead } = require("../controllers/messageController");
const protect = require("../middleware/authMiddleware");

// Route to send direct message (supports public or authenticated client calls)
router.post("/", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return protect(req, res, () => sendMessage(req, res));
  }
  return sendMessage(req, res);
});

// Route to reply to a message thread
router.post("/:id/reply", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return protect(req, res, () => replyMessage(req, res));
  }
  return replyMessage(req, res);
});

// Route to mark a message as read
router.patch("/:id/read", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return protect(req, res, () => markAsRead(req, res));
  }
  return markAsRead(req, res);
});

// Route to get direct messages
router.get("/", (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    return protect(req, res, () => getMessages(req, res));
  }
  return getMessages(req, res);
});

module.exports = router;
