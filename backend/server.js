const path = require("path");
const env = require("./config/env");

// Startup check for SMTP env variables to aid debugging
try {
  console.log("Startup SMTP env check:", {
    SMTP_USER: env.SMTP_USER ? "SET" : "NOT SET",
    SMTP_PASS: env.SMTP_PASS ? "SET" : "NOT SET",
    SMTP_FROM: env.SMTP_FROM || null,
  });
} catch (e) {}

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
const contactRoutes = require("./routes/contactRoutes");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Simple request logger to help debug route matching
app.use((req, res, next) => {
  try {
    console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  } catch (e) {}
  next();
});

const fs = require("fs");

const frontendDist = path.join(__dirname, "../frontend/dist");
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  // Serve SPA index for all non-API routes (use regex to avoid path-to-regexp parsing issues)
  app.get(/^(?!\/api).*/, (req, res) => {
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
// Temporary explicit routes for material purchases to ensure the endpoint is reachable
// These mirror the handlers in adminRoutes but are mounted directly on the app to avoid
// any router mounting/order issues while debugging the 404 problem.
const adminController = require("./controllers/adminController");
const protectMiddleware = require("./middleware/authMiddleware");
const authorizeMiddleware = require("./middleware/roleMiddleware");

app.post(
  "/api/admin/materials",
  protectMiddleware,
  authorizeMiddleware("admin"),
  (req, res, next) => {
    try {
      console.log(`[EXPLICIT_ROUTE] POST /api/admin/materials`);
    } catch (e) {}
    next();
  },
  adminController.createMaterialPurchase
);

app.get(
  "/api/admin/materials",
  protectMiddleware,
  authorizeMiddleware("admin"),
  (req, res, next) => {
    try {
      console.log(`[EXPLICIT_ROUTE] GET /api/admin/materials`);
    } catch (e) {}
    next();
  },
  adminController.getMaterialPurchases
);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/contact", contactRoutes);
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

// Debug route to verify POST handling without auth
app.post('/api/admin/materials-debug', (req, res) => {
  res.json({ success: true, debug: true, body: req.body });
});

// Port
const PORT = process.env.PORT || 5000;

// Debug: list registered routes (useful for verifying route registration)
const listRoutes = () => {
  try {
    const routes = [];
    const stack = app._router?.stack || [];
    stack.forEach((middleware) => {
      if (middleware?.route) {
        routes.push(`${Object.keys(middleware.route.methods).join(',').toUpperCase()} ${middleware.route.path}`);
      } else if (middleware?.name === 'router' && middleware?.handle?.stack) {
        middleware.handle.stack.forEach((handler) => {
          if (handler?.route) {
            routes.push(`${Object.keys(handler.route.methods).join(',').toUpperCase()} ${handler.route.path}`);
          }
        });
      }
    });
    console.log('Registered routes:\n', routes.join('\n'));
  } catch (e) {
    console.error('Failed to list routes', e);
  }
};

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT} on 0.0.0.0`);
  listRoutes();
});