const express = require('express');

const led_apiController = require('../controllers/led_api')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

router.get("/checkGetAPI/", led_apiController.checkAPI);
router.post("/checkPostAPI",led_apiController.checkPostAPI);

router.post("/ledMpamEncrypt/", led_apiController.ledEncrypt);
router.post("/ledMpamDecrypt/", led_apiController.ledDecrypt);

// #1 get data from LED dialy api.
router.post("/mpamGetBankruptList/",led_apiController.callGetBankruptList);
router.post("/mpamReceiverBreezeWebService/",led_apiController.ReceiverBreezeWebService);
router.post("/mpamGetBankruptListByDate/",led_apiController.GetBankruptListByDate);

// #1 Run schedule
// 1. Download
// 2. Cleaning data
router.post("/ledGetBankruptListSchedule/",led_apiController.ledGetBankruptListSchedule);

// #2 Run Cleaning data
router.post("/cleanFromFile/",led_apiController.cleanCustFromFile);

//initial Cleaning
router.post("/cleanInitial/",led_apiController.cleanInitial);

module.exports = router;
