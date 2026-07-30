const express = require("express");
const router = express.Router();

const {
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
} = require("../controllers/projectController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Get all projects
router.get("/", protect, getProjects);

// Get single project
router.get("/:id", protect, getProjectById);

// Create project
router.post(
  "/",
  protect,
  authorize("admin", "project_manager"),
  createProject
);

// Update project
router.put(
  "/:id",
  protect,
  authorize("admin", "project_manager"),
  updateProject
);

// Delete project
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProject
);

// Update project status / classification
router.patch(
  "/:id/status",
  protect,
  authorize("admin", "project_manager"),
  updateProjectStatus
);

// Update milestone payment status
router.patch(
  "/:id/payments/:paymentId",
  protect,
  authorize("admin", "project_manager"),
  updatePaymentStatus
);

// Client submit payment receipt photo / ref
router.post(
  "/:id/payments/:paymentId/receipt",
  submitPaymentReceipt
);

router.options(
  "/:id/payments/:paymentId/receipt",
  (req, res) => res.sendStatus(204)
);

// Mark project as completed
router.patch(
  "/:id/complete",
  protect,
  authorize("admin", "project_manager"),
  markProjectCompleted
);

// Upload project media (images / documents)
router.post(
  "/:id/upload",
  protect,
  authorize("admin", "project_manager"),
  uploadProjectMedia
);

module.exports = router;