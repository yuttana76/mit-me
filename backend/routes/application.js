const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const applicationController = require('../controllers/application')

// router.get("", checkAuth, fundController.getFunds);
router.get("", checkAuth,applicationController.getApplication);
router.post("", checkAuth,applicationController.addApplication);
router.put("", checkAuth,applicationController.updateApplication);
router.delete("/:appId", checkAuth,applicationController.deleteApplication);



module.exports = router;
