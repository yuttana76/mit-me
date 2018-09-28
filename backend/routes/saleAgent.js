const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const saleAgentController = require('../controllers/saleAgent')

// router.get("", checkAuth, fundController.getFunds);
router.get("", saleAgentController.getSaleAgent);

// router.post("",customerController.CreateCustomer);

// router.put("/:id",customerController.UpdateCustomer);

module.exports = router;
