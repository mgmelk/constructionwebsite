const Engineer = require("../models/Engineer");



// Create Engineer

const createEngineer = async(req,res)=>{

    try{

        const engineer =
        await Engineer.create(req.body);


        res.status(201).json({

            message:"Engineer created successfully",

            engineer

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Get Engineers

const getEngineers = async(req,res)=>{

    try{

        const engineers =
        await Engineer.find()
        .populate("user","fullName email phone role")
        .populate("assignedProjects");


        res.json(engineers);


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Get One Engineer

const getEngineerById = async(req,res)=>{

    try{

        const engineer =
        await Engineer.findById(req.params.id)
        .populate("user")
        .populate("assignedProjects");


        if(!engineer){

            return res.status(404).json({

                message:"Engineer not found"

            });

        }


        res.json(engineer);


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Update Engineer

const updateEngineer = async(req,res)=>{

    try{

        const engineer =
        await Engineer.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        );


        res.json({

            message:"Engineer updated",

            engineer

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// Delete Engineer

const deleteEngineer = async(req,res)=>{

    try{

        await Engineer.findByIdAndDelete(
            req.params.id
        );


        res.json({

            message:"Engineer deleted"

        });


    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};



module.exports={

createEngineer,
getEngineers,
getEngineerById,
updateEngineer,
deleteEngineer

};