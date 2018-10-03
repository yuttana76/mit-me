const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const customerController = require('../controllers/customer')

// router.get("", checkAuth, fundController.getFunds);
router.get("", customerController.searchCustomers);

router.get("/:cusCode", customerController.getCustomer);

router.post("",customerController.CreateCustomer);

router.put("/:cusCode",customerController.UpdateCustomer);

module.exports = router;
