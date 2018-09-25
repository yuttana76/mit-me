const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const engTitleController = require('../controllers/engTitle')

router.get("", engTitleController.getEngTitles);

module.exports = router;
