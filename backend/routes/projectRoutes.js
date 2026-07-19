const express = require("express");

const router = express.Router();


const {

createProject,
getProjects,
getProjectById,
updateProject,
deleteProject,
assignProject,
updateProjectStatus

}= require("../controllers/projectController");


const protect = require("../middleware/authMiddleware");

const authorize = require("../middleware/roleMiddleware");



// Create project

router.post(
"/",
protect,
authorize("admin","project_manager"),
createProject
);



// Get all projects

router.get(
"/",
protect,
getProjects
);



// Get one project

router.get(
"/:id",
protect,
getProjectById
);



// Update project

router.put(
"/:id",
protect,
authorize("admin","project_manager"),
updateProject
);



// Delete project

router.delete(
"/:id",
protect,
authorize("admin"),
deleteProject
);



module.exports = router;