const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const tambonController = require('../controllers/tambon')

router.get("", tambonController.getTambons);

module.exports = router;
