const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const PIDTypesController = require('../controllers/PIDType')

router.get("", PIDTypesController.getPIDTypes);

module.exports = router;
