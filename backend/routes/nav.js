const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const navController = require('../controllers/nav')

// router.get("", checkAuth, fundController.getFunds);
router.get("", navController.getNavMenu);



module.exports = router;
