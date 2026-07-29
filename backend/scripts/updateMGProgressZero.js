require("dotenv").config({ path: "./backend/.env" });
const connectDB = require("../config/db");
const Project = require("../models/Project");

const updateProgressZero = async () => {
  try {
    await connectDB();
    const result = await Project.updateMany(
      { projectName: /MG Building/i },
      { $set: { progress: 0, status: "Planning" } }
    );
    console.log(`Updated MG Building progress to 0% and status to Planning:`, result);
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err);
    process.exit(1);
  }
};

updateProgressZero();
