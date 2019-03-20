const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const clientTypeController = require('../controllers/clientType2')

router.get("", checkAuth,clientTypeController.getClientTypes);

module.exports = router;
