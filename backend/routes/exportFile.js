const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const exportFileController = require('../controllers/exportFile');

router.post("/simpleExcel", exportFileController.simpleExcel);

module.exports = router;
