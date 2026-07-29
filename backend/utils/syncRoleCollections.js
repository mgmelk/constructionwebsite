const Client = require("../models/Client");
const Engineer = require("../models/Engineer");
const Employee = require("../models/Employee");
const HRManager = require("../models/HRManager");
const Admin = require("../models/Admin");

/**
 * Automatically syncs a User record into its respective MongoDB collection
 * (clients, engineers, employees, hr_managers, admins) based on user.role
 */
const syncUserToRoleCollection = async (user, extraData = {}) => {
  if (!user || !user.role) return;

  const role = user.role.trim().toLowerCase();

  try {
    if (role === "client") {
      const existing = await Client.findOne({ email: user.email.toLowerCase() });
      if (!existing) {
        await Client.create({
          companyName: extraData.companyName || user.fullName || "Client Company",
          contactPerson: user.fullName,
          email: user.email.toLowerCase(),
          phone: user.phone || "+251900000000",
          address: extraData.address || "",
          status: "Active",
        });
      } else {
        existing.contactPerson = user.fullName;
        existing.phone = user.phone || existing.phone;
        if (extraData.companyName) existing.companyName = extraData.companyName;
        await existing.save();
      }
    } else if (role === "engineer") {
      const existing = await Engineer.findOne({
        $or: [{ user: user._id }, { employeeId: `ENG-${user._id.toString().slice(-6)}` }],
      });
      if (!existing) {
        await Engineer.create({
          user: user._id,
          employeeId: `ENG-${user._id.toString().slice(-6)}`,
          specialization: extraData.specialization || "Civil Engineer",
          qualification: extraData.qualification || "BSc Engineering",
          experience: Number(extraData.experience) || 1,
          isActive: true,
        });
      }
    } else if (role === "employee" || role === "architect" || role === "site_supervisor" || role === "accountant" || role === "project_manager") {
      const existing = await Employee.findOne({
        $or: [{ user: user._id }, { email: user.email.toLowerCase() }],
      });
      if (!existing) {
        await Employee.create({
          user: user._id,
          fullName: user.fullName,
          email: user.email.toLowerCase(),
          phone: user.phone || "+251900000000",
          position: extraData.position || role.replace("_", " ").toUpperCase(),
          department: extraData.department || "Construction",
          salary: Number(extraData.salary) || 0,
          status: "Active",
        });
      } else {
        existing.fullName = user.fullName;
        existing.phone = user.phone || existing.phone;
        await existing.save();
      }
    } else if (role === "hr_manager") {
      const existing = await HRManager.findOne({
        $or: [{ user: user._id }, { employeeId: `HR-${user._id.toString().slice(-6)}` }],
      });
      if (!existing) {
        await HRManager.create({
          user: user._id,
          employeeId: `HR-${user._id.toString().slice(-6)}`,
          department: "Human Resource",
          position: "HR Manager",
          isActive: true,
        });
      }
    } else if (role === "admin") {
      const existing = await Admin.findOne({
        $or: [{ user: user._id }, { employeeId: `ADM-${user._id.toString().slice(-6)}` }],
      });
      if (!existing) {
        await Admin.create({
          user: user._id,
          employeeId: `ADM-${user._id.toString().slice(-6)}`,
          accessLevel: "Super Admin",
          isActive: true,
        });
      }
    }
  } catch (error) {
    console.error(`[Sync Warning] Failed to sync user ${user.email} (${user.role}) to MongoDB collection:`, error.message);
  }
};

module.exports = syncUserToRoleCollection;
