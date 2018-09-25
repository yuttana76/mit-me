const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const clientTypeController = require('../controllers/clientType')

router.get("", clientTypeController.getClientTypes);

module.exports = router;
