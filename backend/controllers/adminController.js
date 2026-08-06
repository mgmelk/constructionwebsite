const User = require("../models/User");
const Project = require("../models/Project");
const Admin = require("../models/Admin");
const MaterialPurchase = require("../models/MaterialPurchase");


// Dashboard
const getAdminDashboard = async (req, res) => {

    try {

        const totalUsers = await User.countDocuments();
        const totalProjects = await Project.countDocuments();
        const totalAdmins = await Admin.countDocuments();

        const activeProjects = await Project.countDocuments({
            status: "In Progress"
        });

        const completedProjects = await Project.countDocuments({
            status: "Completed"
        });

        res.json({

            success: true,

            dashboard: {

                totalUsers,
                totalAdmins,
                totalProjects,
                activeProjects,
                completedProjects

            }

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// CREATE ADMIN
const createAdmin = async (req, res) => {

    try {

        const {

            user,
            employeeId,
            accessLevel

        } = req.body;


        const existingAdmin = await Admin.findOne({ user });

        if (existingAdmin) {

            return res.status(400).json({

                message: "Admin already exists"

            });

        }


        const admin = await Admin.create({

            user,
            employeeId,
            accessLevel

        });


        res.status(201).json({

            success: true,

            message: "Admin created successfully",

            admin

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


// GET ADMINS
const getAdmins = async (req, res) => {

    try {

        const admins = await Admin.find()
            .populate("user", "fullName email role");

        res.json({

            success: true,

            admins

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


const createMaterialPurchase = async (req, res) => {
    try {
        const {
            materialName,
            category,
            quantity,
            unit,
            unitPrice,
            supplier,
            invoiceNumber,
            purchaseDate,
            project,
            notes,
            status,
        } = req.body;

        if (!materialName || !quantity || !unitPrice) {
            return res.status(400).json({ message: "Material name, quantity and unit price are required." });
        }

        const totalAmount = Number(quantity) * Number(unitPrice);

        const purchase = await MaterialPurchase.create({
            materialName,
            category: category || "General",
            quantity: Number(quantity),
            unit: unit || "pcs",
            unitPrice: Number(unitPrice),
            totalAmount,
            supplier: supplier || "",
            invoiceNumber: invoiceNumber || "",
            purchaseDate: purchaseDate || new Date(),
            purchasedBy: req.user?.id || null,
            project: project || null,
            status: status || "Pending",
            notes: notes || "",
        });

        res.status(201).json({ success: true, message: "Material purchase registered successfully", purchase });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getMaterialPurchases = async (req, res) => {
    try {
        const purchases = await MaterialPurchase.find()
            .populate("project", "projectName")
            .populate("purchasedBy", "fullName email")
            .sort({ purchaseDate: -1 });

        res.json({ success: true, purchases });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateMaterialPurchase = async (req, res) => {
    try {
        const purchase = await MaterialPurchase.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!purchase) {
            return res.status(404).json({ message: "Material purchase not found" });
        }

        res.json({ success: true, message: "Material purchase updated", purchase });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Get pending payment receipts across projects for admin review
const getPendingReceipts = async (req, res) => {
    try {
        const Project = require("../models/Project");

        const projects = await Project.find({
            $or: [
                { "payments.status": "Pending Approval" },
                { "payments.receiptUrl": { $ne: "" } },
                { "payments.receiptRef": { $ne: "" } },
            ],
        })
            .populate("client", "fullName email")
            .sort({ updatedAt: -1 });

        const pending = [];
        projects.forEach((proj) => {
            (proj.payments || []).forEach((p) => {
                const hasReceipt = Boolean(p.receiptUrl || p.receiptRef);
                if (p.status === "Pending Approval" || hasReceipt) {
                    pending.push({
                        projectId: proj._id,
                        projectName: proj.projectName,
                        projectCode: proj.projectCode,
                        clientName: proj.client?.fullName || "Unknown Client",
                        clientEmail: proj.client?.email || "",
                        id: p.id || p._id,
                        amount: p.amount,
                        paymentMethod: p.paymentMethod,
                        receiptRef: p.receiptRef,
                        receiptUrl: p.receiptUrl,
                        description: p.description,
                        status: hasReceipt && p.status !== "Paid" ? "Receipt Submitted - Pending Approval" : p.status,
                        submittedAt: p.submittedAt || p.updatedAt || proj.updatedAt,
                    });
                }
            });
        });

        res.json({ success: true, pending });
    } catch (error) {
        res.status(500).json({ message: error.message || "Failed to fetch pending receipts" });
    }
};

module.exports = {
    getAdminDashboard,
    createAdmin,
    getAdmins,
    createMaterialPurchase,
    getMaterialPurchases,
    updateMaterialPurchase,
    getPendingReceipts,
};