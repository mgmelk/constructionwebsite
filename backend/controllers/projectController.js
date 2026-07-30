const mongoose = require("mongoose");
const Project = require("../models/Project");
const Message = require("../models/Message");

const sanitizeObjectId = (id) => {
  if (!id) return null;
  const str = String(id).trim();
  if (!str) return null;
  if (mongoose.Types.ObjectId.isValid(str) && String(new mongoose.Types.ObjectId(str)) === str) {
    return str;
  }
  return null;
};

const sanitizeObjectIdArray = (arr) => {
  const list = Array.isArray(arr) ? arr : arr ? [arr] : [];
  return list.map(sanitizeObjectId).filter(Boolean);
};

const normalizeImages = (imgList) => {
  if (!Array.isArray(imgList)) return [];
  return imgList
    .map((img) => {
      if (typeof img === "string" && img.trim() !== "") {
        let url = img.trim();
        if (url.startsWith("data:")) {
          url = url.replace(/[\r\n\s]+/g, "");
        } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = `https://${url}`;
        }
        return { url, name: "Project Image", uploadedAt: new Date() };
      }
      if (img && typeof img === "object" && img.url) {
        let url = String(img.url).trim();
        if (url.startsWith("data:")) {
          url = url.replace(/[\r\n\s]+/g, "");
        } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
          url = `https://${url}`;
        }
        return { url, name: img.name || "Project Image", uploadedAt: img.uploadedAt || new Date() };
      }
      return null;
    })
    .filter(Boolean);
};

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
      paidAmount,
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
      client: sanitizeObjectId(client) || client || null,
      projectManager: sanitizeObjectId(projectManager),
      engineers: sanitizeObjectIdArray(engineers),
      employees: sanitizeObjectIdArray(employees),
      description: description || "",
      location: location || "",
      budget: typeof budget !== "undefined" && budget !== null && budget !== "" ? Number(budget) : 150000000,
      paidAmount: typeof paidAmount !== "undefined" && paidAmount !== null && paidAmount !== "" ? Number(paidAmount) : 0,
      startDate: startDate ? new Date(startDate) : new Date(),
      endDate: endDate ? new Date(endDate) : null,
      progress: typeof progress !== "undefined" ? Number(progress) : 0,
      status: status || "Planning",
      images: normalizeImages(images),
      documents: Array.isArray(documents) ? documents : [],
      createdBy: sanitizeObjectId(req.user?.id),
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
      paidAmount,
      startDate,
      endDate,
      progress,
      status,
      images,
      documents,
    } = req.body;

    if (projectName) project.projectName = projectName;
    if (projectCode) project.projectCode = projectCode;
    if (typeof client !== "undefined") {
      project.client = sanitizeObjectId(client) || client || null;
    }
    if (typeof projectManager !== "undefined") {
      project.projectManager = sanitizeObjectId(projectManager);
    }
    if (typeof engineers !== "undefined") {
      project.engineers = sanitizeObjectIdArray(engineers);
    }
    if (typeof employees !== "undefined") {
      project.employees = sanitizeObjectIdArray(employees);
    }
    if (typeof description !== "undefined") project.description = description;
    if (typeof location !== "undefined") project.location = location;
    if (typeof budget !== "undefined" && budget !== null && budget !== "") project.budget = Number(budget);
    if (typeof paidAmount !== "undefined" && paidAmount !== null && paidAmount !== "") project.paidAmount = Number(paidAmount);
    if (typeof startDate !== "undefined") project.startDate = startDate ? new Date(startDate) : project.startDate;
    if (typeof endDate !== "undefined") project.endDate = endDate ? new Date(endDate) : null;
    if (typeof progress !== "undefined") {
      project.progress = Math.min(100, Math.max(0, Number(progress)));
      if (project.progress === 100) {
        project.status = "Completed";
      }
    }
    if (typeof status !== "undefined") project.status = status;
    if (Array.isArray(images)) project.images = normalizeImages(images);
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

const updateProjectStatus = async (req, res) => {
  try {
    const { status, progress } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (status) {
      project.status = status;
      if (status === "Completed") {
        project.progress = 100;
        if (!project.endDate) project.endDate = new Date();
      }
    }

    if (typeof progress !== "undefined" && progress !== null) {
      project.progress = Math.min(100, Math.max(0, Number(progress)));
      if (project.progress === 100) {
        project.status = "Completed";
      }
    }

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    res.json({
      message: `Project status updated to ${project.status}`,
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to update project status",
    });
  }
};

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

const updatePaymentStatus = async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const { status, paymentMethod, receiptRef } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const paymentItem = project.payments.find((p) => String(p.id) === String(paymentId) || String(p._id) === String(paymentId));
    if (!paymentItem) {
      return res.status(404).json({ message: "Milestone payment item not found" });
    }

    if (status) paymentItem.status = status;
    if (paymentMethod) paymentItem.paymentMethod = paymentMethod;
    if (receiptRef) paymentItem.receiptRef = receiptRef;

    const newPaidTotal = project.payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    project.paidAmount = newPaidTotal;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    res.json({
      message: `Milestone payment ${paymentItem.id} marked as ${paymentItem.status}. Total Paid: ${newPaidTotal.toLocaleString()} Birr`,
      project: updatedProject,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update payment status" });
  }
};

const submitPaymentReceipt = async (req, res) => {
  try {
    const { id, paymentId } = req.params;
    const { receiptUrl, paymentMethod, receiptRef } = req.body;

    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const paymentItem = project.payments.find((p) => String(p.id) === String(paymentId) || String(p._id) === String(paymentId));
    if (!paymentItem) {
      return res.status(404).json({ message: "Milestone payment item not found" });
    }

    if (receiptUrl) paymentItem.receiptUrl = receiptUrl;
    if (paymentMethod) paymentItem.paymentMethod = paymentMethod;
    if (receiptRef) paymentItem.receiptRef = receiptRef;
    paymentItem.status = "Pending Approval";
    paymentItem.submittedAt = new Date();

    project.paidAmount = project.payments
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("client", "fullName email phone role")
      .populate("projectManager", "fullName email role")
      .populate("engineers", "fullName email phone role")
      .populate("employees", "fullName email phone role");

    res.json({
      message: "Payment receipt submitted to Admin for verification!",
      project: updatedProject,
    });

    // Create an in-app message/notification for Admins so the submission appears in admin messages
    try {
      const senderId = req.user?.id || null;
      const senderName = req.user?.fullName || (req.body.senderName || "Client");
      const senderEmail = req.user?.email || (req.body.senderEmail || "client@example.com");

      await Message.create({
        sender: senderId,
        senderName,
        senderEmail,
        recipient: null,
        recipientName: "Admin",
        project: project._id,
        projectName: project.projectName || "Project",
        subject: `Payment receipt submitted: ${paymentItem.id || paymentId}`,
        body: `A client submitted a payment receipt for milestone ${paymentItem.id || paymentId}. Receipt ref: ${paymentItem.receiptRef || 'N/A'}.`,
        read: false,
        status: "Open",
        replies: [],
      });
    } catch (e) {
      console.error("Failed to create admin message for receipt submission:", e.message || e);
    }
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to submit payment receipt" });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  markProjectCompleted,
  updateProjectStatus,
  uploadProjectMedia,
  updatePaymentStatus,
  submitPaymentReceipt,
};