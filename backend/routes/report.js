const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const repSummaryController = require('../controllers/reports/repSummary')

// router.get("", checkAuth, fundController.getFunds);
router.get("/summary", repSummaryController.repSummary);

module.exports = router;
