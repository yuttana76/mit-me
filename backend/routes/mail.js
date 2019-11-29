const express = require('express');
const mailController = require('../controllers/mail')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

router.post("/merchant",mailController.sendMail);

//Move to survey.js
// router.post("/surveyByMailToken",selfAuth,mailController.surveyByMailToken);
// router.post("/surveyBulkFile",selfAuth,mailController.surveyBulkFile);
// router.post("/surveyThankCust",mailController.sendMailThankCust);

// Streaming send mail to customer
router.post("/mailStreamingCustFile",mailController.mailStreamingCustFile);
router.post("/smsStreamingCustFile",mailController.smsStreamingCustFile);

module.exports = router;
