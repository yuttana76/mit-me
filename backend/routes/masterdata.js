const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const masterdataController = require('../controllers/masterdata')

router.get("/occupations", masterdataController.getOccupation);
router.get("/businessType", masterdataController.getBusinessType);
router.get("/position", masterdataController.getPosition);
router.get("/income", masterdataController.getIncome);
router.get("/incomeSource", masterdataController.getIncomeSource);

module.exports = router;
