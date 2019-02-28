const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const customerController = require('../controllers/customer')

// router.get("", checkAuth, fundController.getFunds);
router.get("", customerController.searchCustomers);

router.get("/:cusCode", checkAuth, customerController.getCustomer);

router.post("", checkAuth, customerController.CreateCustomer);

router.put("/:cusCode", checkAuth, customerController.UpdateCustomer);
router.get("/cddInfo/:cusCode",  customerController.getCDDinfo);
module.exports = router;
