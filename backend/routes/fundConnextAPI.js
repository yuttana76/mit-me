const express = require('express');
const router = express.Router();

const fundConnextAPIController = require('../controllers/fundConnextAPI')
const { check } = require('express-validator');

router.get("/downloadFileAPI/",[
  check('fileType')
    .exists().withMessage('must have param fileType')
    .isLength({ min: 1 }).withMessage('fileType must have value '),
  check('businessDate')
    .exists().withMessage('must have Param businessDate')
    .isLength({ min: 1 }).withMessage('businessDate must have value '),
], fundConnextAPIController.downloadFileAPI);


router.get("/downloadInfo/",[
  check('fileType')
    .exists().withMessage('must have param fileType')
    .isLength({ min: 1 }).withMessage('fileType must have value '),
  check('businessDate')
    .exists().withMessage('must have Param businessDate')
    .isLength({ min: 1 }).withMessage('businessDate must have value '),
], fundConnextAPIController.downloadInfo);

router.post("/uploadDB/",[
  check('fileType')
    .exists().withMessage('must have param fileType')
    .isLength({ min: 1 }).withMessage('fileType must have value '),
  check('businessDate')
    .exists().withMessage('must have Param businessDate')
    .isLength({ min: 1 }).withMessage('businessDate must have value '),
  check('extract')
    .exists().withMessage('must have Param extract')
    .isLength({ min: 1 }).withMessage('extract must have value '),
], fundConnextAPIController.uploadDB);

router.post("/exportExcel/",[
  check('fileType')
    .exists().withMessage('must have param fileType')
    .isLength({ min: 1 }).withMessage('fileType must have value '),
  check('businessDate')
    .exists().withMessage('must have Param businessDate')
    .isLength({ min: 1 }).withMessage('businessDate must have value '),
  check('extract')
    .exists().withMessage('must have Param extract')
    .isLength({ min: 1 }).withMessage('extract must have value '),
], fundConnextAPIController.exportExcel);


module.exports = router;
