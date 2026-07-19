const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedEmployee() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "employee@gmail.com";
    const fullName = "employee";
    const password = "employee123";
    const phone = "+251933333333";
    const role = "employee";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.fullName = fullName;
      existingUser.phone = phone;
      existingUser.role = role;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();

      console.log(`Employee already existed and was updated: ${email}`);
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

    console.log(`Employee created successfully: ${email}`);
    console.log(`Temporary password: ${password}`);
  } catch (error) {
    console.error("Employee seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedEmployee();
