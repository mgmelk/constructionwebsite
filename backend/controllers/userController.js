const User = require("../models/User");
const bcrypt = require("bcryptjs");
const syncUserToRoleCollection = require("../utils/syncRoleCollections");

// GET ALL USERS

const getUsers = async (req,res)=>{

    try{

        const users = await User.find()
        .select("-password");


        res.json(users);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// GET SINGLE USER

const getUserById = async(req,res)=>{

    try{

        const user = await User.findById(req.params.id)
        .select("-password");


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }


        res.json(user);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// CREATE USER BY ADMIN

const createUser = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        // Validate
        if (!fullName || !email || !phone || !password || !role) {
            return res.status(400).json({ message: "fullName, email, phone, password and role are required" });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email: normalizedEmail,
            phone,
            password: hashedPassword,
            role,
        });

        // Automatically sync to dedicated collection (clients, engineers, employees, hr_managers, admins)
        await syncUserToRoleCollection(user, req.body);

        console.log(`Admin created user: ${user.email} (${user._id}) role=${user.role}`);

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("createUser error:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: error.message });
    }
};




// UPDATE USER

const updateUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (req.body.fullName) user.fullName = req.body.fullName.trim();
        if (req.body.phone) user.phone = req.body.phone.trim();
        if (req.body.email) user.email = req.body.email.trim().toLowerCase();
        if (req.body.role) user.role = req.body.role.trim().toLowerCase();

        if (req.body.password && req.body.password.trim().length > 0) {
            user.password = await bcrypt.hash(req.body.password.trim(), 10);
        }

        await user.save();

        // Automatically sync updated user data to role collection
        await syncUserToRoleCollection(user, req.body);

        res.json({
            message: "User updated successfully",
            user: {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                role: user.role,
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email already in use by another account" });
        }
        res.status(500).json({
            message: error.message
        });
    }
};




// DELETE USER

const deleteUser = async(req,res)=>{

    try{

        const user = await User.findById(
            req.params.id
        );


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }



        await user.deleteOne();



        res.json({

            message:"User deleted successfully"

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



module.exports={

    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser

};