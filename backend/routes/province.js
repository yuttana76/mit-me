const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const provinceController = require('../controllers/province')

router.get("", provinceController.getProvinces);

module.exports = router;
