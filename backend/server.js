const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const clientRoutes = require("./routes/clientRoutes");
const hrManagerRoutes = require("./routes/hrManagerRoutes");
const engineerRoutes = require("./routes/engineerRoutes");

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

// Home route
app.get("/", (req, res) => {
  res.send("Construction Company Backend is Running...");
});
app.get("/api/test", (req, res) => {

    res.json({

        message: "Hello React"

    });

});

// Authentication routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/employees",employeeRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/hr-managers",hrManagerRoutes);
app.use("/api/engineers",engineerRoutes);

// Port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});