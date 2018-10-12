const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const workflowController = require('../controllers/workflow')

router.put("/:appRef",workflowController.ExeWFAccountUpdate);

router.get("/wfByAppRef", workflowController.getWorkFlowByAppRef);
router.get("/currentLevel", workflowController.getCurrentLevel);

module.exports = router;
