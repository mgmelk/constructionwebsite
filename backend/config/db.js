const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    const dbName = conn.connection?.db?.databaseName || process.env.MONGO_URI;
    console.log(`MongoDB Connected -> ${dbName}`);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    // Do not exit the process here so the server can still start for debugging.
    // Route handlers should handle missing DB connections and return 5xx errors.
    // If you prefer the old behavior (exit on DB failure), restore process.exit(1).
  }
};

module.exports = connectDB;