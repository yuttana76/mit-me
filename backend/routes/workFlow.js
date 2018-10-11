const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const workflowController = require('../controllers/workflow')


router.get("/:appRef", workflowController.getWorkFlow);

// router.post("",customerController.CreateCustomer);

// router.put("/:appRef",workflowController.updateWorkFlow);
router.put("/:appRef",workflowController.ExeWFAccountUpdate);

module.exports = router;
