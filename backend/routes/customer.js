const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const customerController = require('../controllers/customer')

router.get("/testAPI",customerController.testAPI);

router.get("", customerController.searchCustomers);
router.get("/:cusCode", checkAuth, customerController.getCustomer);
router.post("", checkAuth, customerController.CreateCustomer);
router.put("/:cusCode", checkAuth, customerController.UpdateCustomer);

// router.get("/orgCusInfo/:cusCode", customerController.getCustomerFullInfo);
router.get("/orgCusInfo/:cusCode", customerController.getORG_CustomerInfo);
router.get("/fcCusInfo/:cusCode", customerController.getFC_CustomerInfo);

router.post("/approveCustInfo", customerController.approveCustInfo);

// router.get("/cddInfo/:cusCode",  customerController.getCDDinfo);
// router.post("/cddInfo", customerController.saveCDDInfo);

module.exports = router;
