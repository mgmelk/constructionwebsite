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

const respondToOptions = (req, res) => res.sendStatus(204);

router.options("/register", respondToOptions);
router.options("/login", respondToOptions);
router.options("/forgot-password", respondToOptions);
router.options("/reset-password/:token", respondToOptions);
router.options("/change-password", respondToOptions);

// Register public user
router.all("/register", (req, res, next) => {
  if (req.method === "OPTIONS") return respondToOptions(req, res);
  if (req.method === "POST") return register(req, res);
  return res.status(405).json({ message: "Method not allowed" });
});

router.all("/login", (req, res, next) => {
  if (req.method === "OPTIONS") return respondToOptions(req, res);
  if (req.method === "POST") return login(req, res);
  return res.status(405).json({ message: "Method not allowed" });
});

router.all("/forgot-password", (req, res, next) => {
  if (req.method === "OPTIONS") return respondToOptions(req, res);
  if (req.method === "POST") return forgotPassword(req, res);
  return res.status(405).json({ message: "Method not allowed" });
});

router.all("/reset-password/:token", (req, res, next) => {
  if (req.method === "OPTIONS") return respondToOptions(req, res);
  if (req.method === "POST") return resetPassword(req, res);
  return res.status(405).json({ message: "Method not allowed" });
});

router.all("/change-password", (req, res, next) => {
  if (req.method === "OPTIONS") return respondToOptions(req, res);
  if (req.method === "POST") return changePassword(req, res);
  return res.status(405).json({ message: "Method not allowed" });
});

module.exports = router;

