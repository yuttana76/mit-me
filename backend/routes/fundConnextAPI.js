const express = require('express');
const router = express.Router();

const fundConnextAPIController = require('../controllers/fundConnextAPI')
const { check, validationResult } = require('express-validator');

// router.post("/downloadFileAPI/",[
//   check('fileType')
//     .exists().withMessage('must have param fileType')
//     .isLength({ min: 1 }).withMessage('fileType must have value '),
//   check('businessDate')
//     .exists().withMessage('must have Param businessDate')
//     .isLength({ min: 1 }).withMessage('businessDate must have value '),
// ], fundConnextAPIController.downloadFileAPI);

router.get("/downloadFileAPI/",[
  check('fileType')
    .exists().withMessage('must have param fileType')
    .isLength({ min: 1 }).withMessage('fileType must have value '),
  check('businessDate')
    .exists().withMessage('must have Param businessDate')
    .isLength({ min: 1 }).withMessage('businessDate must have value '),
], fundConnextAPIController.downloadFileAPI);

// router.get("/test/", fundConnextAPIController.test);

module.exports = router;
