const express = require('express');

const led_apiController = require('../controllers/led_api')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

router.get("/checkGetAPI/", led_apiController.checkAPI);
router.post("/checkPostAPI",led_apiController.checkPostAPI);

router.post("/ledMpamEncrypt/", led_apiController.ledEncrypt);
router.post("/ledMpamDecrypt/", led_apiController.ledDecrypt);

router.post("/mpamGetBankruptList/",led_apiController.callGetBankruptList);
// router.post("/mpamReceiverBreezeWebService/",led_apiController.ReceiverBreezeWebService);
router.post("/mpamGetBankruptListByDate/",led_apiController.GetBankruptListByDate);

module.exports = router;
