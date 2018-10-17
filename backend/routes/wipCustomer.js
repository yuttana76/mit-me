const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const wipCustomerController = require('../controllers/wipCustomer')

// router.get("", checkAuth, fundController.getFunds);
// router.get("", customerController.getCustomers);

router.post("", checkAuth,wipCustomerController.ExeInsertWIPCustomer);

router.put("/restore/:id", checkAuth,wipCustomerController.ExeRestoreWIPCustomer);

module.exports = router;
