const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const amcController = require('../controllers/amc')

// router.get("", checkAuth, fundController.getFunds);
router.get("", amcController.getAMC);

module.exports = router;
