const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const mi_tokenAuth = require('../middleware/by-mi-token');
const { check } = require('express-validator');

const miWealthController = require('../controllers/miWealth')

// 1. Authentication

// Master
// router.get("/UnitholderBalance/",tokenAuth,miWealthController.UnitholderBalance);

// MI functions
router.get("/hellomi/",miWealthController.hellomi);

router.get("/PortDetailByAgents/",mi_tokenAuth,miWealthController.getPortDetailByAgents);
router.get("/PortDetailByPort/",mi_tokenAuth,miWealthController.getPortDetailByPort);
router.get("/Commission/",mi_tokenAuth,miWealthController.getCommission);

module.exports = router;
