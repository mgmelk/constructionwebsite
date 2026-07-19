const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedHRManager() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "hr@gmail.com";
    const fullName = "hr";
    const password = "hr123";
    const phone = "+251911111111";
    const role = "hr_manager";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.fullName = fullName;
      existingUser.phone = phone;
      existingUser.role = role;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();

      console.log(`HR manager already existed and was updated: ${email}`);
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

    console.log(`HR manager created successfully: ${email}`);
    console.log(`Temporary password: ${password}`);
  } catch (error) {
    console.error("HR manager seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedHRManager();
