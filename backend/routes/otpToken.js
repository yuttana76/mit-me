const express = require('express');

const otpTokenController = require('../controllers/otpToken');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// router.post("/verifyExtLink",checkAuth,userController.verifyExtLink);
router.post("/getOTPtokenMail",otpTokenController.getOTPtokenToMail);
router.post("/getOTPtokenSMS",otpTokenController.OTPtokenToSMS);
router.post("/verityOTPtoken",otpTokenController.verityOTPtoken);
router.post("/verityByDOB",otpTokenController.verityByDOB);

module.exports = router;
