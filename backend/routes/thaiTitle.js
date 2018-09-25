const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
// const thaiTitleController = require('../controllers/thaiTitle2')
const thaiTitleController = require('../controllers/thaiTitle')

router.get("", thaiTitleController.getThaiTitles);

module.exports = router;
