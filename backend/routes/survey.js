const express = require('express');

const surveyController = require('../controllers/survey')
const mailController = require('../controllers/mail')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

// Survey KYC & Suitability
router.post("/surveyKYCByID",surveyController.surveyKYCByID);
router.post("/surveyKYCBulkFile",selfAuth,surveyController.surveyKYCBulkFile);
router.post("/surveyThankCust",surveyController.sendMailThankCust);

// Survey Suitability only
router.post("/surveySuitByID",selfAuth,surveyController.surveySuitByMailToken);
router.post("/surveySuitByFile",selfAuth,surveyController.surveySuitBulkFile);
router.post("/surveySuitThankCust",surveyController.sendMailThankCustSuit);

//Development
router.post("/requestPDF",surveyController.requestPDF);

//Development
router.post("/reqNewMobile",surveyController.reqNewMobile);

router.get("/dashboard",surveyController.surveyDashboard);
router.get("/getSuit/:cusCode",surveyController.getSuit);
router.get("/custIndPartial/:cusCode",surveyController.custIndPartial);

module.exports = router;
