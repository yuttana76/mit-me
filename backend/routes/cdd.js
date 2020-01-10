
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const cddController = require('../controllers/cdd')

// router.get("/cddInfo/:cusCode",checkAuth,cddController.getCDDinfo_MIT);
router.get("/cddInfo/:cusCode",cddController.getCDDinfo_MIT);
router.post("/cddInfo",cddController.saveCDDInfo);

router.get("/cddAddr/:cusCode",cddController.getCDDAddr);
router.post("/cddAddr",cddController.saveCDDAddr);

module.exports = router;
