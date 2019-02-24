const express = require('express');

const otpTokenController = require('../controllers/otpToken');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// router.post("/verifyExtLink",checkAuth,userController.verifyExtLink);
router.post("/getOTPtoken",otpTokenController.getOTPtokenToMail);
router.post("/verityOTPtoken",otpTokenController.verityOTPtoken);
router.post("/verityByDOB",otpTokenController.verityByDOB);

module.exports = router;
