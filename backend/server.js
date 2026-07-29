const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const clientRoutes = require("./routes/clientRoutes");
const hrManagerRoutes = require("./routes/hrManagerRoutes");
const engineerRoutes = require("./routes/engineerRoutes");
const quoteRoutes = require("./routes/quoteRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const path = require("path");
const fs = require("fs");

const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("/{*splat}", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Construction Company Backend is Running...");
  });
}

app.get("/api/test", (req, res) => {
  res.json({ message: "Hello React" });
});

const mongoose = require("mongoose");

// Database readiness middleware for API routes
app.use("/api", (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    console.log(`[API Warning] Database connection not ready (readyState: ${mongoose.connection.readyState}). Re-triggering connectDB()...`);
    connectDB();
    return res.status(503).json({
      message: "Database connection failed. Please ensure your IP address is whitelisted in MongoDB Atlas Network Access."
    });
  }
  next();
});

// Authentication routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/hr-managers", hrManagerRoutes);
app.use("/api/engineers", engineerRoutes);

// Dev-only debug endpoint to list users (do not enable in production)
if (process.env.NODE_ENV !== "production") {
  const User = require("./models/User");
  app.get("/api/debug/users", async (req, res) => {
    try {
      const users = await User.find().select("-password");
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
}

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});