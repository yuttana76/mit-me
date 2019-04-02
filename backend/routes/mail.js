const express = require('express');
const mailController = require('../controllers/mail')
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/merchant",mailController.sendMail);

router.post("/surveyByMailToken",mailController.surveyByMailToken);
router.post("/surveyThankCust",mailController.sendMailThankCust);
router.post("/surveyBulk",mailController.surveyByMailBulk);  // Not finish
module.exports = router;
