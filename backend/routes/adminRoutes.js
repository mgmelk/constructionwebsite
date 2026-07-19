const express = require("express");

const router = express.Router();

const {

    getAdminDashboard,
    createAdmin,
    getAdmins

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

module.exports = router;