const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const clientRoutes = require("./routes/clientRoutes");
const hrManagerRoutes = require("./routes/hrManagerRoutes");
const engineerRoutes = require("./routes/engineerRoutes");const quoteRoutes = require("./routes/quoteRoutes");
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require("./routes/authRoutes");

const path = require("path");
const fs = require("fs");

const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) return next();
    res.sendFile(path.join(frontendDist, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("Construction Company Backend is Running...");
  });
}
app.get("/api/test", (req, res) => {

    res.json({

        message: "Hello React"

    });

});

// Authentication routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/employees",employeeRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/hr-managers",hrManagerRoutes);
app.use("/api/engineers",engineerRoutes);

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