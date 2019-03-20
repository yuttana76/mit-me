const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const amphurController = require('../controllers/amphur')

router.get("", checkAuth,amphurController.getAmphurs);

module.exports = router;
