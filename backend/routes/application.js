const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const applicationController = require('../controllers/application')

// router.get("", checkAuth, fundController.getFunds);
router.get("", applicationController.getApplication);

module.exports = router;
