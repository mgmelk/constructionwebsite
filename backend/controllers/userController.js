const User = require("../models/User");
const bcrypt = require("bcryptjs");


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

const createUser = async(req,res)=>{

    try{

        const {
            fullName,
            email,
            phone,
            password,
            role
        } = req.body;



        const existingUser = await User.findOne({
            email
        });


        if(existingUser){

            return res.status(400).json({
                message:"Email already exists"
            });

        }



        const hashedPassword =
        await bcrypt.hash(password,10);



        const user = await User.create({

            fullName,
            email,
            phone,
            password:hashedPassword,
            role

        });



        res.status(201).json({

            message:"User created successfully",

            user:{
                id:user._id,
                fullName:user.fullName,
                email:user.email,
                role:user.role
            }

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// UPDATE USER

const updateUser = async(req,res)=>{

    try{

        const user = await User.findById(
            req.params.id
        );


        if(!user){

            return res.status(404).json({
                message:"User not found"
            });

        }



        user.fullName =
        req.body.fullName || user.fullName;


        user.phone =
        req.body.phone || user.phone;


        user.role =
        req.body.role || user.role;



        await user.save();



        res.json({

            message:"User updated successfully",

            user

        });



    }catch(error){

        res.status(500).json({
            message:error.message
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