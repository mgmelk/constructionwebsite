const express = require("express");
const router = express.Router();
const {
  createQuoteRequest,
  listQuoteRequests,
  estimateQuote,
  sendQuoteEmail,
} = require("../controllers/quoteController");
const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Public quote request from homepage
router.post("/request", createQuoteRequest);

// Admin routes for managing quotes
router.get("/", protect, authorize("admin"), listQuoteRequests);
router.put("/:id/estimate", protect, authorize("admin"), estimateQuote);
router.post("/:id/send", protect, authorize("admin"), sendQuoteEmail);

module.exports = router;
