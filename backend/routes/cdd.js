
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const cddController = require('../controllers/cdd')

router.get("/cddInfo/:cusCode",  cddController.getCDDinfo);
router.post("/cddInfo", cddController.saveCDDInfo);

module.exports = router;
