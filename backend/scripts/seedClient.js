const path = require("path");
const dotenv = require("dotenv");
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function seedClient() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "client@gmail.com";
    const fullName = "client";
    const password = "client123";
    const phone = "+251944444444";
    const role = "client";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.fullName = fullName;
      existingUser.phone = phone;
      existingUser.role = role;
      existingUser.password = await bcrypt.hash(password, 10);
      await existingUser.save();

      console.log(`Client already existed and was updated: ${email}`);
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

    console.log(`Client created successfully: ${email}`);
    console.log(`Temporary password: ${password}`);
  } catch (error) {
    console.error("Client seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedClient();
