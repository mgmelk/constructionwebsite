const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
} = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

// Register public user
router.post("/register", register);
router.options("/register", (req, res) => res.sendStatus(204));
router.post("/login", login);
router.options("/login", (req, res) => res.sendStatus(204));
router.post("/forgot-password", forgotPassword);
router.options("/forgot-password", (req, res) => res.sendStatus(204));
router.post("/reset-password/:token", resetPassword);
router.options("/reset-password/:token", (req, res) => res.sendStatus(204));
router.post("/change-password", protect, changePassword);
router.options("/change-password", (req, res) => res.sendStatus(204));

module.exports = router;

