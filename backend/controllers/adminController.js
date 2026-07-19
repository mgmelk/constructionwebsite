const User = require("../models/User");
const Project = require("../models/Project");
const Admin = require("../models/Admin");


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


module.exports = {

    getAdminDashboard,
    createAdmin,
    getAdmins

};