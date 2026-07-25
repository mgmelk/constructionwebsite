const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Project = require("../models/Project");
const Quote = require("../models/Quote");

async function seedAll() {
  try {
    console.log("Connecting to MongoDB:", process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB!");

    const passwordHash = await bcrypt.hash("Password123!", 10);

    // 1. Seed Users
    const users = [
      {
        fullName: "System Admin",
        email: "admin@gmail.com",
        phone: "+251900000000",
        password: passwordHash,
        role: "admin",
      },
      {
        fullName: "John Client",
        email: "client@gmail.com",
        phone: "+251944444444",
        password: passwordHash,
        role: "client",
      },
      {
        fullName: "Alex Employee",
        email: "employee@gmail.com",
        phone: "+251933333333",
        password: passwordHash,
        role: "employee",
      },
      {
        fullName: "David Engineer",
        email: "engineer@gmail.com",
        phone: "+251922222222",
        password: passwordHash,
        role: "engineer",
      },
      {
        fullName: "Sarah HR",
        email: "hr@gmail.com",
        phone: "+251911111111",
        password: passwordHash,
        role: "hr_manager",
      },
    ];

    const seededUsers = [];
    for (const u of users) {
      let userDoc = await User.findOne({ email: u.email });
      if (!userDoc) {
        userDoc = await User.create(u);
        console.log(`Created user: ${u.fullName} (${u.role})`);
      } else {
        console.log(`User already exists: ${u.fullName}`);
      }
      seededUsers.push(userDoc);
    }

    const clientUser = seededUsers.find((u) => u.role === "client");
    const engineerUser = seededUsers.find((u) => u.role === "engineer");

    // 2. Seed Sample Projects
    const existingProject = await Project.findOne({ projectCode: "PRJ-001" });
    if (!existingProject) {
      await Project.create({
        projectName: "Commercial Tower Construction",
        projectCode: "PRJ-001",
        client: clientUser?._id,
        projectManager: engineerUser?._id,
        location: "Addis Ababa, Ethiopia",
        status: "In Progress",
        startDate: new Date(),
        budget: 5000000,
        description: "15-story modern commercial complex construction project.",
      });
      console.log("Created sample project: PRJ-001");
    } else {
      console.log("Sample project PRJ-001 already exists.");
    }

    // 3. Seed Sample Quotes
    const existingQuote = await Quote.findOne({ email: "client@gmail.com" });
    if (!existingQuote) {
      await Quote.create({
        fullName: "John Client",
        email: "client@gmail.com",
        phone: "+251944444444",
        companyName: "Client Construction Ltd",
        projectType: "Commercial Building",
        projectSize: "5000 sq ft",
        details: "Looking for a cost estimation for a 5-story commercial building.",
        status: "Pending",
      });
      console.log("Created sample quote request.");
    } else {
      console.log("Sample quote request already exists.");
    }

    console.log("\n--- SEEDING COMPLETED SUCCESSFULLY ---");
    console.log("Database 'construction' now contains initial collections & data!");
  } catch (error) {
    console.error("Seeding failed with error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedAll();
