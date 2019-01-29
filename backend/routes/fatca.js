const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fatcaController = require('../controllers/fatca')

router.get("/custam", fatcaController.getCustAM);

module.exports = router;
