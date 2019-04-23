const express = require('express');
const mailController = require('../controllers/mail')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

router.post("/merchant",mailController.sendMail);

router.post("/surveyByMailToken",selfAuth,mailController.surveyByMailToken);
router.post("/surveyThankCust",mailController.sendMailThankCust);
router.post("/surveyBulkFile",selfAuth,mailController.surveyBulkFile);  // Not finish
module.exports = router;
