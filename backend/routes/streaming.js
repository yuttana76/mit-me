const express = require('express');

const streamingController = require('../controllers/streaming');
const checkAuth = require('../middleware/check-auth');
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

//Update register information
router.put("/regis",streamingController.updateRegis);

//get request OTP to mobile
router.get("/reqOTP",streamingController.reqOTP);

//Send data to customer(E-mail)
router.post("/sendData",streamingController.sendData);



module.exports = router;
