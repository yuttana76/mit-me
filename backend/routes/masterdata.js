const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const masterdataController = require('../controllers/masterdata')

router.get("/occupations", checkAuth,masterdataController.getOccupation);
router.get("/businessType", checkAuth,masterdataController.getBusinessType);
router.get("/position", checkAuth,masterdataController.getPosition);
router.get("/income", checkAuth,masterdataController.getIncome);
router.get("/incomeSource", checkAuth,masterdataController.getIncomeSource);
router.get("/FCbusinessType", checkAuth,masterdataController.getFCbusinessType);
router.get("/FCoccupation", checkAuth,masterdataController.getFCoccupation);
router.get("/FCincomeLevel", checkAuth,masterdataController.getFCincomeLevel);
router.get("/FCincomeSource", checkAuth,masterdataController.getFCincomeSource);
router.get("/FCnation", checkAuth,masterdataController.getFCnation);
router.get("/FCcountry", checkAuth,masterdataController.getFCcountry);

module.exports = router;
