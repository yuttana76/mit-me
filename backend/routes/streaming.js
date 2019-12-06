const express = require('express');

const streamingController = require('../controllers/streaming');
// const createStreamUserHTMLController = require('../controllers/exmPDF/createStreamUserHTML');
// const createStreamUserPdfController = require('../controllers/exmPDF/createStreamUserPdf');
const mailController = require('../controllers/mail')
const genStreamPDFController = require('../controllers/exmPDF/genStreamPDF');

const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');
const router = express.Router();
const { check } = require('express-validator');


//Save Register information
router.post("/regis",[
  check('idCard')
    .exists().withMessage('must have param idCard')
    .isLength({ min: 1 }).withMessage('idCard must have value '),
  check('fname')
    .exists().withMessage('must have Param fname')
    .isLength({ min: 1 }).withMessage('fname must have value '),
  check('lname')
    .exists().withMessage('must have Param lname')
    .isLength({ min: 1 }).withMessage('lname must have value '),
  check('email')
    .isEmail().withMessage('must be an email format')
    .exists().withMessage('must have Param email')
    .isLength({ min: 1 }).withMessage('email must have value '),
  check('mobile')
    .exists().withMessage('must have Param mobile')
    .isLength({ min: 1 }).withMessage('mobile must have value '),
],streamingController.addRegis);

//Verify OTP
router.post("/regisProcess",[
  check('idCard')
  .exists().withMessage('must have param idCard')
  .isLength({ min: 1 }).withMessage('idCard must have value '),
check('acceptFlag')
  .exists().withMessage('must have Param acceptFlag')
  .isLength({ min: 1 }).withMessage('acceptFlag must have value '),
check('otp')
  .exists().withMessage('must have Param otp')
  .isLength({ min: 1 }).withMessage('otp must have value ')
],streamingController.regisProcess);


//Send user/pwd to cust  by MPAM
router.post("/userPwdToCust",selfAuth
,streamingController.userPwdToCust);


// New customer register
router.post("/regisNewCustToMail",streamingController.regisNewCustToMail);


// Send mail streaming to customer bulk file
router.post("/mailStreamingCustFile",mailController.mailStreamingCustFile);
//Send sms streaming bulk file
router.post("/smsStreamingCustFile",mailController.smsStreamingCustFile);


// TEST
router.post("/demoSendDataMail",streamingController.demoSendDataMail);
router.post("/generatePDF",genStreamPDFController.generatePDF);
router.get("/pdfEncrypt",streamingController.pdfEncrypt);

module.exports = router;
