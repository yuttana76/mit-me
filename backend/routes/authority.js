const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const authorityController = require('../controllers/authority')

// router.get("", checkAuth, fundController.getFunds);
router.get("", authorityController.getAuthority);
router.get("/:groupId", authorityController.getAuthorityByGroup);

module.exports = router;
