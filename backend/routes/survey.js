const express = require('express');

const surveyController = require('../controllers/survey')
const mailController = require('../controllers/mail')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();


router.post("/surveyByMailToken",selfAuth,surveyController.surveyByMailToken);
router.post("/surveyBulkFile",selfAuth,surveyController.surveyBulkFile);
router.post("/surveyThankCust",surveyController.sendMailThankCust);


// Survey Suitability only
router.post("/surveySuit",selfAuth,surveyController.surveySuitByMailToken);
router.post("/surveySuitFile",selfAuth,surveyController.surveySuitBulkFile);

router.post("/surveySuitThankCust",surveyController.sendMailThankCustSuit);

//Development
router.post("/requestPDF",surveyController.requestPDF);

module.exports = router;
