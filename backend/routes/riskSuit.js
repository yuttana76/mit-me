const express = require('express');

const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const riskSuitController = require('../controllers/riskSuit');

router.get("/splitRiskSuit",riskSuitController.splitRiskSuit);
// router.get("/riskSuitTrans",riskSuitController.riskSuitTrans);

module.exports = router;
