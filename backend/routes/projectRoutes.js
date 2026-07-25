const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  markProjectCompleted,
  uploadProjectMedia,
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