const HRManager = require("../models/HRManager");


// Create HR Manager

const createHRManager = async(req,res)=>{

    try{

        const hrManager = await HRManager.create(req.body);


        res.status(201).json({

            message:"HR Manager created successfully",

            hrManager

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



// Get All HR Managers

const getHRManagers = async(req,res)=>{

    try{

        const hrManagers = await HRManager.find()
        .populate("user","fullName email phone role");


        res.json(hrManagers);


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Get Single HR Manager

const getHRManagerById = async(req,res)=>{

    try{

        const hrManager =
        await HRManager.findById(req.params.id)
        .populate("user");


        if(!hrManager){

            return res.status(404).json({

                message:"HR Manager not found"

            });

        }


        res.json(hrManager);


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Update HR Manager

const updateHRManager = async(req,res)=>{

    try{

        const hrManager =
        await HRManager.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        );


        res.json({

            message:"HR Manager updated",

            hrManager

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Delete HR Manager

const deleteHRManager = async(req,res)=>{

    try{

        await HRManager.findByIdAndDelete(
            req.params.id
        );


        res.json({

            message:"HR Manager deleted"

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



module.exports={

createHRManager,
getHRManagers,
getHRManagerById,
updateHRManager,
deleteHRManager

};