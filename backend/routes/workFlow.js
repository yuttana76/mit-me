const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const workflowController = require('../controllers/workflow')


router.get("/:cusCode", workflowController.getWorkFlow);

// router.post("",customerController.CreateCustomer);

router.put("/:cusCode",workflowController.updateWorkFlow);

module.exports = router;
