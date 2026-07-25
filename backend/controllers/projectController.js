const Project = require("../models/Project");

// CREATE PROJECT
const createProject = async (req, res) => {
  try {
    const {
      projectName,
      projectCode,
      client,
      projectManager,
      engineers,
      employees,
      description,
      location,
      budget,
      startDate,
      endDate,
      progress,
      status,
      images,
      documents,
    } = req.body;

    const generatedCode =
      projectCode && projectCode.trim() !== ""
        ? projectCode.trim()
        : `PRJ-${Date.now().toString().slice(-6)}`;

    const project = await Project.create({
      projectName,
      projectCode: generatedCode,
      client: client || null,
      projectManager: projectManager || null,
      engineers: Array.isArray(engineers) ? engineers : engineers ? [engineers] : [],
      employees: Array.isArray(employees) ? employees : employees ? [employees] : [],
      description: description || "",
      location: location || "",
      budget: Number(budget) || 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      progress: typeof progress !== "undefined" ? Number(progress) : 0,
      status: status || "Planning",
      images: Array.isArray(images) ? images : [],
      documents: Array.isArray(documents) ? documents : [],
      createdBy: req.user ? req.user.id : null,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    res.status(201).json({
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to create project",
    });
  }
};

// GET ALL PROJECTS
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role")
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch projects",
    });
  }
};

// GET SINGLE PROJECT
const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to fetch project details",
    });
  }
};

// UPDATE PROJECT
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const {
      projectName,
      projectCode,
      client,
      projectManager,
      engineers,
      employees,
      description,
      location,
      budget,
      startDate,
      endDate,
      progress,
      status,
      images,
      documents,
    } = req.body;

    if (projectName) project.projectName = projectName;
    if (projectCode) project.projectCode = projectCode;
    if (typeof client !== "undefined") project.client = client || null;
    if (typeof projectManager !== "undefined") project.projectManager = projectManager || null;
    if (typeof engineers !== "undefined") {
      project.engineers = Array.isArray(engineers) ? engineers : engineers ? [engineers] : [];
    }
    if (typeof employees !== "undefined") {
      project.employees = Array.isArray(employees) ? employees : employees ? [employees] : [];
    }
    if (typeof description !== "undefined") project.description = description;
    if (typeof location !== "undefined") project.location = location;
    if (typeof budget !== "undefined") project.budget = Number(budget);
    if (typeof startDate !== "undefined") project.startDate = startDate ? new Date(startDate) : project.startDate;
    if (typeof endDate !== "undefined") project.endDate = endDate ? new Date(endDate) : null;
    if (typeof progress !== "undefined") {
      project.progress = Math.min(100, Math.max(0, Number(progress)));
      if (project.progress === 100) {
        project.status = "Completed";
      }
    }
    if (typeof status !== "undefined") project.status = status;
    if (Array.isArray(images)) project.images = images;
    if (Array.isArray(documents)) project.documents = documents;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to update project",
    });
  }
};

// DELETE PROJECT
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to delete project",
    });
  }
};

// MARK PROJECT AS COMPLETED
const markProjectCompleted = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.status = "Completed";
    project.progress = 100;
    if (!project.endDate) {
      project.endDate = new Date();
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    res.json({
      message: "Project marked as Completed",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to mark project as completed",
    });
  }
};

// UPLOAD PROJECT MEDIA (Images or Documents)
const uploadProjectMedia = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const { images, documents } = req.body;

    if (Array.isArray(images)) {
      images.forEach((img) => {
        if (img && img.url) {
          project.images.push({
            url: img.url,
            name: img.name || "Project Image",
            uploadedAt: new Date(),
          });
        }
      });
    }

    if (Array.isArray(documents)) {
      documents.forEach((doc) => {
        if (doc && doc.url && doc.name) {
          project.documents.push({
            url: doc.url,
            name: doc.name,
            uploadedAt: new Date(),
          });
        }
      });
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    res.json({
      message: "Project media uploaded successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to upload project media",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  markProjectCompleted,
  uploadProjectMedia,
};