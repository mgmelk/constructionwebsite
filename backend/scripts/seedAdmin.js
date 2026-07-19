const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin@gmail.com";
    const fullName = "admin";
    const password = "Admin123!";
    const phone = "+251900000000";
    const role = "admin";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.fullName = fullName;
      existingUser.phone = phone;
      existingUser.role = role;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();

      console.log(`Admin already existed and was updated: ${email}`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role,
    });

    console.log(`Admin created successfully: ${email}`);
    console.log(`Temporary password: ${password}`);
  } catch (error) {
    console.error("Admin seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedAdmin();
