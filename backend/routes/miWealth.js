const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const tokenAuth = require('../middleware/by-token');
const { check } = require('express-validator');

const miWealthController = require('../controllers/miWealth')

// 1. Authentication

// Master
// router.get("/UnitholderBalance/",tokenAuth,miWealthController.UnitholderBalance);

// MI functions
router.get("/PortDetailByAgents/",tokenAuth,miWealthController.getPortDetailByAgents);
router.get("/PortDetailByPort/",tokenAuth,miWealthController.getPortDetailByPort);
router.get("/Commission/",tokenAuth,miWealthController.getCommission);

module.exports = router;
