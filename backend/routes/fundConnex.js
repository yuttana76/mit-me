const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fundController = require('../controllers/fund')

// router.get("", checkAuth, fundController.getFunds);
router.get("", fundController.getFunds);

module.exports = router;
