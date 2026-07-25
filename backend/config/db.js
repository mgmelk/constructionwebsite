const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");

// Disable command buffering globally so queries fail immediately instead of hanging 10 seconds
mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 3000);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 5000,
    });

    const dbName = conn.connection?.db?.databaseName || "construction";
    console.log(`MongoDB Connected Successfully -> Database: "${dbName}"`);
  } catch (error) {
    console.error("\n=======================================================");
    console.error("❌ MONGODB CONNECTION ERROR:");
    console.error(`   ${error.message}`);
    console.error("👉 Solution: Whitelist your IP in MongoDB Atlas (https://cloud.mongodb.com -> Security -> Network Access -> Add Current IP)");
    console.error("=======================================================\n");
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected! Attempting reconnect...");
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});

module.exports = connectDB;