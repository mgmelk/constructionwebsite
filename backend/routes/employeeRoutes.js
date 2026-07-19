const express=require("express");

const router=express.Router();


const {

createEmployee,
getEmployees,
getEmployeeById,
updateEmployee,
deleteEmployee

}=require("../controllers/employeeController");


const protect =
require("../middleware/authMiddleware");


const authorize =
require("../middleware/roleMiddleware");



// Create employee

router.post(
"/",
protect,
authorize("admin","hr_manager"),
createEmployee
);



// Get employees

router.get(
"/",
protect,
authorize("admin","hr_manager"),
getEmployees
);



// Get one employee

router.get(
"/:id",
protect,
getEmployeeById
);



// Update

router.put(
"/:id",
protect,
authorize("admin","hr_manager"),
updateEmployee
);



// Delete

router.delete(
"/:id",
protect,
authorize("admin","hr_manager"),
deleteEmployee
);


module.exports=router;