const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const authorityController = require('../controllers/authority')

router.get("", checkAuth,authorityController.getAuthority);
router.get("/:groupId", checkAuth,authorityController.getAuthorityByGroup);
router.get("/permis/:userId/:appId", checkAuth,authorityController.getPermissionByAppId);
router.post("", checkAuth,authorityController.addAuthority);
router.delete("/:groupId/:AppId", checkAuth,authorityController.deleteAuthority);

module.exports = router;
