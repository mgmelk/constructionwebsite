const env = require("./env");
const mongoose = require("mongoose");

// Disable command buffering globally so queries fail immediately instead of hanging 10 seconds
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 3000);

let reconnectAttempts = 0;
let isConnecting = false;
const MAX_RECONNECT_ATTEMPTS = 6;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined. Set it in the backend .env file.");
    return;
  }

  if (isConnecting) return;
  isConnecting = true;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      retryWrites: true,
      appName: "construction-backend",
      tls: true,
      tlsAllowInvalidCertificates: false,
    });

    reconnectAttempts = 0;
    const dbName = conn.connection?.db?.databaseName || "construction";
    console.log(`MongoDB Connected Successfully -> Database: "${dbName}"`);
  } catch (error) {
    reconnectAttempts += 1;
    console.error("\n=======================================================");
    console.error("❌ MONGODB CONNECTION ERROR:");
    console.error(`   ${error.message}`);
    if (error?.message?.includes("ECONNREFUSED") || error?.message?.includes("ENOTFOUND") || error?.message?.includes("IP") || error?.message?.includes("whitelist")) {
      console.error("👉 Solution: Whitelist your current IP address in MongoDB Atlas Network Access and ensure the cluster is reachable.");
    } else {
      console.error("👉 Solution: Verify the Atlas URI, username/password, TLS settings, and Network Access in MongoDB Atlas.");
    }
    console.error("=======================================================\n");

    if (reconnectAttempts <= MAX_RECONNECT_ATTEMPTS) {
      const delayMs = Math.min(10000, reconnectAttempts * 2000);
      console.log(`Retrying MongoDB connection in ${delayMs / 1000}s...`);
      setTimeout(() => {
        isConnecting = false;
        connectDB();
      }, delayMs);
    }
  } finally {
    isConnecting = false;
  }
};

mongoose.connection.on("connected", () => {
  reconnectAttempts = 0;
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected! Attempting reconnect...");
  if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
    const delayMs = Math.min(10000, (reconnectAttempts + 1) * 2000);
    setTimeout(() => {
      connectDB();
    }, delayMs);
  }
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

module.exports = connectDB;