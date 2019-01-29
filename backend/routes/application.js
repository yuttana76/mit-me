const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const applicationController = require('../controllers/application')

// router.get("", checkAuth, fundController.getFunds);
router.get("", applicationController.getApplication);
router.post("", applicationController.addApplication);
router.put("", applicationController.updateApplication);
router.delete("/:appId", applicationController.deleteApplication);



module.exports = router;
