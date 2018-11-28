const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fundController = require('../controllers/fund')

router.get("", fundController.getFunds);
router.get("/amc/:amcCode", fundController.getFundsByAMC);
router.get("/:code", fundController.getFundByCode); //http://localhost:3000/api/fund/ACFIF2

module.exports = router;
