const Project = require("../models/Project");
const EngineerTask = require("../models/EngineerTask");
const EngineerDailyReport = require("../models/EngineerDailyReport");
const EngineerMaterialRequest = require("../models/EngineerMaterialRequest");
const EngineerInspection = require("../models/EngineerInspection");
const EngineerSafetyReport = require("../models/EngineerSafetyReport");
const EngineerDocument = require("../models/EngineerDocument");
const EngineerEquipment = require("../models/EngineerEquipment");
const EngineerNotification = require("../models/EngineerNotification");
const User = require("../models/User");

const getEngineerDashboardData = async (req, res) => {
  try {
    const engineerUserId = req.user?.id;

    const engineerProfile = await User.findById(engineerUserId).select("-password");
    const projects = await Project.find({
      $or: [{ engineers: engineerUserId }, { projectManager: engineerUserId }],
    })
      .populate("client", "fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const tasks = await EngineerTask.find({ engineer: engineerUserId }).sort({ createdAt: -1 }).lean();
    const dailyReports = await EngineerDailyReport.find({ engineer: engineerUserId }).sort({ reportDate: -1 }).lean();
    const materialRequests = await EngineerMaterialRequest.find({ engineer: engineerUserId }).sort({ requestedAt: -1 }).lean();
    const inspections = await EngineerInspection.find({ engineer: engineerUserId }).sort({ inspectionDate: -1 }).lean();
    const safetyReports = await EngineerSafetyReport.find({ engineer: engineerUserId }).sort({ reportedAt: -1 }).lean();
    const documents = await EngineerDocument.find({ engineer: engineerUserId }).sort({ uploadedAt: -1 }).lean();
    const equipment = await EngineerEquipment.find({ engineer: engineerUserId }).sort({ createdAt: -1 }).lean();
    const notifications = await EngineerNotification.find({ engineer: engineerUserId }).sort({ createdAt: -1 }).lean();

    const dashboardData = {
      profile: engineerProfile,
      projects,
      tasks,
      dailyReports,
      materialRequests,
      inspections,
      safetyReports,
      documents,
      equipment,
      notifications,
      stats: {
        totalProjects: projects.length,
        activeProjects: projects.filter((p) => p.status === "In Progress").length,
        completedProjects: projects.filter((p) => p.status === "Completed").length,
        pendingTasks: tasks.filter((t) => t.status !== "Completed").length,
      },
    };

    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEngineerTask = async (req, res) => {
  try {
    const task = await EngineerTask.create({
      engineer: req.user.id,
      ...req.body,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEngineerTask = async (req, res) => {
  try {
    const task = await EngineerTask.findOneAndUpdate(
      { _id: req.params.id, engineer: req.user.id },
      req.body,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createDailyReport = async (req, res) => {
  try {
    const report = await EngineerDailyReport.create({
      engineer: req.user.id,
      ...req.body,
    });
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createMaterialRequest = async (req, res) => {
  try {
    const request = await EngineerMaterialRequest.create({
      engineer: req.user.id,
      ...req.body,
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createInspection = async (req, res) => {
  try {
    const inspection = await EngineerInspection.create({
      engineer: req.user.id,
      ...req.body,
    });
    res.status(201).json(inspection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createSafetyReport = async (req, res) => {
  try {
    const safetyReport = await EngineerSafetyReport.create({
      engineer: req.user.id,
      ...req.body,
    });
    res.status(201).json(safetyReport);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEngineerDocument = async (req, res) => {
  try {
    const document = await EngineerDocument.create({ engineer: req.user.id, ...req.body });
    res.status(201).json(document);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEngineerEquipment = async (req, res) => {
  try {
    const equipment = await EngineerEquipment.create({ engineer: req.user.id, ...req.body });
    res.status(201).json(equipment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEngineerNotification = async (req, res) => {
  try {
    const notification = await EngineerNotification.create({ engineer: req.user.id, ...req.body });
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEngineerProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEngineerDashboardData,
  createEngineerTask,
  updateEngineerTask,
  createDailyReport,
  createMaterialRequest,
  createInspection,
  createSafetyReport,
  createEngineerDocument,
  createEngineerEquipment,
  createEngineerNotification,
  updateEngineerProfile,
};
