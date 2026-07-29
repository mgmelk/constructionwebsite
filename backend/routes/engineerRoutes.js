const express = require("express");
const router = express.Router();

const {
  createEngineer,
  getEngineers,
  getEngineerById,
  updateEngineer,
  deleteEngineer,
} = require("../controllers/engineerController");
const {
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
} = require("../controllers/engineerDashboardController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

router.get("/dashboard", protect, authorize("engineer"), getEngineerDashboardData);
router.post("/tasks", protect, authorize("engineer"), createEngineerTask);
router.put("/tasks/:id", protect, authorize("engineer"), updateEngineerTask);
router.post("/daily-reports", protect, authorize("engineer"), createDailyReport);
router.post("/material-requests", protect, authorize("engineer"), createMaterialRequest);
router.post("/inspections", protect, authorize("engineer"), createInspection);
router.post("/safety-reports", protect, authorize("engineer"), createSafetyReport);
router.post("/documents", protect, authorize("engineer"), createEngineerDocument);
router.post("/equipment", protect, authorize("engineer"), createEngineerEquipment);
router.post("/notifications", protect, authorize("engineer"), createEngineerNotification);
router.put("/profile", protect, authorize("engineer"), updateEngineerProfile);

router.post("/", protect, authorize("admin"), createEngineer);
router.get("/", protect, getEngineers);
router.get("/:id", protect, getEngineerById);
router.put("/:id", protect, authorize("admin"), updateEngineer);
router.delete("/:id", protect, authorize("admin"), deleteEngineer);

module.exports = router;
