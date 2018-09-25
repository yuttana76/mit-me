const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const nationController = require('../controllers/nation')

router.get("", nationController.getNations);

module.exports = router;
