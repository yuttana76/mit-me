const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const anoucementController = require('../controllers/anoucement')

// router.get("", checkAuth, fundController.getFunds);
router.get("", anoucementController.getAnoucement);
router.get("/active", anoucementController.getActiveAnoucement);
router.post("", anoucementController.addAnoucement);
router.put("", anoucementController.updateAnoucement);
router.delete("/:id", anoucementController.delAnoucement);


module.exports = router;
