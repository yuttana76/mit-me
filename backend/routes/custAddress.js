const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const custAddressController = require('../controllers/custAddress')

router.get("/:cusCode", custAddressController.getAddress);

module.exports = router;
