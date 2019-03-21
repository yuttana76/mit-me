
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const cddController = require('../controllers/cdd')

router.get("/cddInfo/:cusCode",checkAuth,cddController.getCDDinfo_MIT);
router.post("/cddInfo",checkAuth,cddController.saveCDDInfo);

router.get("/cddAddr/:cusCode",checkAuth,cddController.getCDDAddr);
router.post("/cddAddr",checkAuth,cddController.saveCDDAddr);

module.exports = router;
