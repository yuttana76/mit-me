const express = require('express');

const otpTokenController = require('../controllers/otpToken');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// router.post("/verifyExtLink",checkAuth,userController.verifyExtLink);
router.post("/getOTPtokenMail",checkAuth,otpTokenController.getOTPtokenToMail);
router.post("/getOTPtokenSMS",checkAuth,otpTokenController.OTPtokenToSMS);
router.post("/verityOTPtoken",checkAuth,otpTokenController.verityOTPtoken);
router.post("/verityByDOB",checkAuth,otpTokenController.verityByDOB);

module.exports = router;
