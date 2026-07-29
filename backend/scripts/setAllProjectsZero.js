require("dotenv").config({ path: "./backend/.env" });
const connectDB = require("../config/db");
const Project = require("../models/Project");

const setAllZero = async () => {
  try {
    await connectDB();
    const res = await Project.updateMany({}, { $set: { progress: 0, status: "Planning" } });
    console.log("All projects in MongoDB set to 0% progress & Planning status:", res);
    process.exit(0);
  } catch (err) {
    console.error("Failed to update projects to 0%:", err);
    process.exit(1);
  }
};

setAllZero();
