const express = require("express");

const router = express.Router();

const {
    createClient,
    getClients,
    getClientById,
    updateClient,
    deleteClient
} = require("../controllers/clientController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

// Create Client
router.post(
    "/",
    protect,
    authorize("admin", "project_manager"),
    createClient
);

// Get All Clients
router.get(
    "/",
    protect,
    getClients
);

// Get Single Client
router.get(
    "/:id",
    protect,
    getClientById
);

// Update Client
router.put(
    "/:id",
    protect,
    authorize("admin", "project_manager"),
    updateClient
);

// Delete Client
router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteClient
);

module.exports = router;