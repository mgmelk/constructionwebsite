const express = require("express");

const router = express.Router();


const {

getUsers,
getUserById,
createUser,
updateUser,
deleteUser

}=require("../controllers/userController");



const protect =
require("../middleware/authMiddleware");


const authorize =
require("../middleware/roleMiddleware");




// Admin gets all users

router.get(
"/",
protect,
authorize("admin"),
getUsers
);




// Admin gets one user

router.get(
"/:id",
protect,
authorize("admin"),
getUserById
);




// Admin creates user

router.post(
"/",
protect,
authorize("admin"),
createUser
);




// Admin updates user

router.put(
"/:id",
protect,
authorize("admin"),
updateUser
);




// Admin deletes user

router.delete(
"/:id",
protect,
authorize("admin"),
deleteUser
);



module.exports=router;