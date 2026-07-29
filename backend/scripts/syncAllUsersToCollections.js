require("dotenv").config({ path: "./backend/.env" });
const connectDB = require("../config/db");
const User = require("../models/User");
const syncUserToRoleCollection = require("../utils/syncRoleCollections");

const syncAllUsers = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB database.");

    const users = await User.find();
    console.log(`Found ${users.length} users in User collection. Syncing to role collections...`);

    for (const user of users) {
      await syncUserToRoleCollection(user);
      console.log(`✓ Synced ${user.email} (${user.role})`);
    }

    console.log("All users successfully synced to their respective MongoDB collections!");
    process.exit(0);
  } catch (err) {
    console.error("Sync script failed:", err);
    process.exit(1);
  }
};

syncAllUsers();
