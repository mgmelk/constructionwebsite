const express = require("express");

const router = express.Router();

console.log('adminRoutes module loaded');

// Log incoming requests to this router for debugging
router.use((req, res, next) => {
    try {
        console.log(`[adminRoutes] ${req.method} ${req.path}`);
    } catch (e) {}
    next();
});

const {

    getAdminDashboard,
    createAdmin,
    getAdmins,
    createMaterialPurchase,
    getMaterialPurchases,
    updateMaterialPurchase,
    getPendingReceipts

} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");


// Dashboard
router.get(
    "/dashboard",
    protect,
    authorize("admin"),
    getAdminDashboard
);


// Create Admin
router.post(
    "/",
    protect,
    authorize("admin"),
    createAdmin
);


// Get All Admins
router.get(
    "/",
    protect,
    authorize("admin"),
    getAdmins
);

// Material purchase management
router.post(
    "/materials",
    protect,
    authorize("admin"),
    createMaterialPurchase
);

router.get(
    "/materials",
    protect,
    authorize("admin"),
    getMaterialPurchases
);

router.put(
    "/materials/:id",
    protect,
    authorize("admin"),
    updateMaterialPurchase
);

// Get pending receipts submitted by clients (for admin review)
router.get(
    "/pending-receipts",
    protect,
    authorize("admin"),
    getPendingReceipts
);

module.exports = router;