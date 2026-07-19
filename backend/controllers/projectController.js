const Project = require("../models/Project");


// CREATE PROJECT
const createProject = async (req, res) => {

    try {

        const project = await Project.create({

            ...req.body,
            createdBy: req.user.id

        });


        res.status(201).json({
            message: "Project created successfully",
            project
        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// GET ALL PROJECTS
const getProjects = async(req,res)=>{

    try{

        const projects = await Project.find()
        .populate("client","fullName email")
        .populate("projectManager","fullName email");


        res.json(projects);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// GET SINGLE PROJECT
const getProjectById = async(req,res)=>{

    try{

        const project = await Project.findById(req.params.id)
        .populate("client")
        .populate("projectManager");


        if(!project){

            return res.status(404).json({
                message:"Project not found"
            });

        }


        res.json(project);


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// UPDATE PROJECT
const updateProject = async(req,res)=>{

    try{

        const project = await Project.findById(req.params.id);


        if(!project){

            return res.status(404).json({
                message:"Project not found"
            });

        }


        const updatedProject = await Project.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new:true
            }

        );


        res.json({

            message:"Project updated successfully",

            project:updatedProject

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};




// DELETE PROJECT
const deleteProject = async(req,res)=>{

    try{

        const project = await Project.findById(req.params.id);


        if(!project){

            return res.status(404).json({
                message:"Project not found"
            });

        }


        await project.deleteOne();


        res.json({

            message:"Project deleted successfully"

        });



    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};

// ADMIN UPDATE PROJECT ASSIGNMENTS

const assignProject = async (req, res) => {

    try {

        const {
            projectManager,
            client
        } = req.body;


        const project = await Project.findById(
            req.params.id
        );


        if (!project) {

            return res.status(404).json({
                message: "Project not found"
            });

        }


        project.projectManager =
            projectManager || project.projectManager;


        project.client =
            client || project.client;


        await project.save();


        res.json({

            message: "Project assignment updated successfully",

            project

        });


    } catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// UPDATE PROJECT STATUS

const updateProjectStatus = async(req,res)=>{

    try{

        const {
            status,
            progress
        } = req.body;


        const project =
        await Project.findById(req.params.id);


        if(!project){

            return res.status(404).json({
                message:"Project not found"
            });

        }


        project.status =
        status || project.status;


        project.progress =
        progress || project.progress;



        await project.save();


        res.json({

            message:"Project status updated",

            project

        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};


module.exports = {

    createProject,
    getProjects,
    getProjectById,
    updateProject,
    deleteProject,
    assignProject,
    updateProjectStatus

};