const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const workflowController = require('../controllers/workflow')

router.put("/:appRef", checkAuth, workflowController.ExeWFAccountUpdate);

router.get("/wfByAppRef", checkAuth, workflowController.getWorkFlowByAppRef);
router.get("/currentLevel", checkAuth, workflowController.getCurrentLevel);

module.exports = router;
