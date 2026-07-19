const express = require("express");

const router = express.Router();


const {

createHRManager,
getHRManagers,
getHRManagerById,
updateHRManager,
deleteHRManager

}=require("../controllers/hrManagerController");


const protect =
require("../middleware/authMiddleware");


const authorize =
require("../middleware/roleMiddleware");



// Create

router.post(
"/",
protect,
authorize("admin"),
createHRManager
);


// Get All

router.get(
"/",
protect,
authorize("admin","hr_manager"),
getHRManagers
);


// Get One

router.get(
"/:id",
protect,
authorize("admin","hr_manager"),
getHRManagerById
);


// Update

router.put(
"/:id",
protect,
authorize("admin","hr_manager"),
updateHRManager
);


// Delete

router.delete(
"/:id",
protect,
authorize("admin"),
deleteHRManager
);



module.exports = router;