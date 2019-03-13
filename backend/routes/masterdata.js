const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const masterdataController = require('../controllers/masterdata')

router.get("/occupations", masterdataController.getOccupation);
router.get("/businessType", masterdataController.getBusinessType);
router.get("/position", masterdataController.getPosition);
router.get("/income", masterdataController.getIncome);
router.get("/incomeSource", masterdataController.getIncomeSource);

router.get("/FCbusinessType", masterdataController.getFCbusinessType);
router.get("/FCoccupation", masterdataController.getFCoccupation);
router.get("/FCincomeLevel", masterdataController.getFCincomeLevel);
router.get("/FCincomeSource", masterdataController.getFCincomeSource);
router.get("/FCnation", masterdataController.getFCnation);
router.get("/FCcountry", masterdataController.getFCcountry);


module.exports = router;
