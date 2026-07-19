const Employee = require("../models/Employee");


// CREATE EMPLOYEE

const createEmployee = async(req,res)=>{

    try{


        const employee =
        await Employee.create(req.body);



        res.status(201).json({

            message:"Employee created successfully",

            employee

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// GET ALL EMPLOYEES

const getEmployees = async(req,res)=>{

    try{


        const employees =
        await Employee.find()
        .populate("user","fullName email role");



        res.json(employees);



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// GET SINGLE EMPLOYEE


const getEmployeeById = async(req,res)=>{

    try{


        const employee =
        await Employee.findById(req.params.id);



        if(!employee){

            return res.status(404).json({

                message:"Employee not found"

            });

        }



        res.json(employee);



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// UPDATE EMPLOYEE


const updateEmployee = async(req,res)=>{

    try{


        const employee =
        await Employee.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        );


        res.json({

            message:"Employee updated",

            employee

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// DELETE EMPLOYEE


const deleteEmployee = async(req,res)=>{

    try{


        await Employee.findByIdAndDelete(
            req.params.id
        );


        res.json({

            message:"Employee deleted"

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



module.exports={

createEmployee,
getEmployees,
getEmployeeById,
updateEmployee,
deleteEmployee

};