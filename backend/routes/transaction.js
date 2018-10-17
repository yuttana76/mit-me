const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const transController = require('../controllers/transaction')

// router.get("", checkAuth, fundController.getFunds);
router.get("", checkAuth, transController.getTransactionByParams);

module.exports = router;
