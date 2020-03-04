const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const downloadController = require('../controllers/download')

router.get("/NAV/:file(*)", downloadController.downloadNAV);
router.get("/file/:fileName(*)", downloadController.downloadfile);

module.exports = router;
