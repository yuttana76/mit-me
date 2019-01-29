const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fundController = require('../controllers/fund')

router.get("", fundController.getFunds);
router.get("/amc/:amcCode", fundController.getFundsByAMC);
router.get("/:code", fundController.getFundByCode);
router.get("/uploadNAV/:fineName", fundController.UploadFoundNAV);

module.exports = router;
