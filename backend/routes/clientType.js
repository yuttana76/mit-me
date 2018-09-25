const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
// const clientTypeController = require('../controllers/clientType')
const clientTypeController = require('../controllers/clientType2')
// const clientTypeController = require('../controllers/tedious/T_clientType')

router.get("", clientTypeController.getClientTypes);

module.exports = router;
