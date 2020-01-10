const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fatcaController = require('../controllers/fatca')

router.get("/custam", checkAuth,fatcaController.getCustAM);

router.get("/getfatca/:cusCode",fatcaController.getFATCA);
router.post("/saveFATCA",fatcaController.saveFATCA);

module.exports = router;
