const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const tokenAuth = require('../middleware/by-token');
const { check } = require('express-validator');

const miWealthController = require('../controllers/miWealth')

// 1. Authentication

// Schedule
router.get("/UnitholderBalance/",tokenAuth,miWealthController.UnitholderBalance);
router.get("/AllottedTransactions/",tokenAuth,miWealthController.AllottedTransactions);

module.exports = router;
