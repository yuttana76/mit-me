const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const groupController = require('../controllers/group')

// router.get("", checkAuth, fundController.getFunds);
router.get("", groupController.getGroup);
router.get("/:groupId", groupController.getGroupById);

router.post("", groupController.createGroup);

module.exports = router;
