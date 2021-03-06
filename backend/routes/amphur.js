const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const amphurController = require('../controllers/amphur')

router.get("", amphurController.getAmphurs);

module.exports = router;
