const express = require("express");

const router = express.Router();


const {

createEngineer,
getEngineers,
getEngineerById,
updateEngineer,
deleteEngineer

}=require("../controllers/engineerController");


const protect =
require("../middleware/authMiddleware");


const authorize =
require("../middleware/roleMiddleware");



// Create

router.post(
"/",
protect,
authorize("admin"),
createEngineer
);


// Get All

router.get(
"/",
protect,
getEngineers
);


// Get One

router.get(
"/:id",
protect,
getEngineerById
);


// Update

router.put(
"/:id",
protect,
authorize("admin"),
updateEngineer
);


// Delete

router.delete(
"/:id",
protect,
authorize("admin"),
deleteEngineer
);



module.exports = router;