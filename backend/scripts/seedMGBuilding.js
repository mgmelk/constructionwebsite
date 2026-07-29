require("dotenv").config({ path: "./backend/.env" });
const connectDB = require("../config/db");
const User = require("../models/User");
const Project = require("../models/Project");
const syncUserToRoleCollection = require("../utils/syncRoleCollections");
const bcrypt = require("bcryptjs");

const seedMGBuilding = async () => {
  try {
    await connectDB();
    console.log("Connected to MongoDB for MG Building seeding...");

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    // 1. Ensure David Engineer (+251929581296) exists in User collection & Engineers collection
    let davidEng = await User.findOne({ email: "david.engineer@gmail.com" });
    if (!davidEng) {
      davidEng = await User.create({
        fullName: "David Engineer",
        email: "david.engineer@gmail.com",
        phone: "+251929581296",
        password: hashedPassword,
        role: "engineer",
      });
      console.log("Created David Engineer user (+251929581296).");
    } else {
      davidEng.fullName = "David Engineer";
      davidEng.phone = "+251929581296";
      davidEng.role = "engineer";
      await davidEng.save();
      console.log("Updated David Engineer user (+251929581296).");
    }
    await syncUserToRoleCollection(davidEng, { specialization: "Civil Engineer" });

    // 2. Ensure Alex Employee exists in User collection & Employees collection
    let alexEmp = await User.findOne({ email: "alex.employee@gmail.com" });
    if (!alexEmp) {
      alexEmp = await User.create({
        fullName: "Alex Employee",
        email: "alex.employee@gmail.com",
        phone: "+251911998877",
        password: hashedPassword,
        role: "employee",
      });
      console.log("Created Alex Employee user.");
    } else {
      alexEmp.fullName = "Alex Employee";
      alexEmp.role = "employee";
      await alexEmp.save();
      console.log("Updated Alex Employee user.");
    }
    await syncUserToRoleCollection(alexEmp, { position: "Site Supervisor", department: "Construction" });

    // 3. Ensure Client user exists
    let clientUser = await User.findOne({ email: "client@gmail.com" });
    if (!clientUser) {
      clientUser = await User.create({
        fullName: "Abebe Kebede",
        email: "client@gmail.com",
        phone: "+251911000000",
        password: hashedPassword,
        role: "client",
      });
      await syncUserToRoleCollection(clientUser, { companyName: "Global Tech Africa" });
    }

    // 4. Create or update MG Building Project
    let mgProject = await Project.findOne({ projectName: /MG Building/i });
    if (!mgProject) {
      mgProject = await Project.create({
        projectName: "MG Building Commercial Complex",
        projectCode: "PRJ-MG-8090",
        client: clientUser._id,
        projectManager: davidEng._id,
        engineers: [davidEng._id],
        employees: [alexEmp._id],
        description: "Modern 22-story MG Building commercial complex featuring executive office suites, structural reinforced concrete framing, underground parking, and smart glass architecture.",
        location: "Bole Medhanealem Corridor, Addis Ababa",
        budget: 45000000,
        progress: 72,
        status: "In Progress",
        startDate: new Date("2024-03-15"),
        endDate: new Date("2026-11-30"),
        images: [
          { url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1000&q=80", name: "MG Building Exterior Facade" },
          { url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80", name: "Floor Slab Concrete Construction" }
        ],
      });
      console.log("Created MG Building project in database.");
    } else {
      mgProject.projectName = "MG Building Commercial Complex";
      mgProject.projectManager = davidEng._id;
      mgProject.engineers = [davidEng._id];
      mgProject.employees = [alexEmp._id];
      await mgProject.save();
      console.log("Updated MG Building project with David Engineer (+251929581296) and Alex Employee.");
    }

    console.log("MG Building database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding MG Building failed:", err);
    process.exit(1);
  }
};

seedMGBuilding();
