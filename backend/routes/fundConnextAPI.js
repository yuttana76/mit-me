const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

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

router.post("/uploadMITdb/",[
  check('fileType')
    .exists().withMessage('must have param fileType')
    .isLength({ min: 1 }).withMessage('fileType must have value '),
  check('fileName')
    .exists().withMessage('must have param fileName')
    .isLength({ min: 1 }).withMessage('fileName must have value '),
  // check('businessDate')
  //   .exists().withMessage('must have Param businessDate')
  //   .isLength({ min: 1 }).withMessage('businessDate must have value '),
  // check('extract')
  //   .exists().withMessage('must have Param extract')
  //   .isLength({ min: 1 }).withMessage('extract must have value '),
], fundConnextAPIController.uploadMITdb);

/**
 * parameter
 * createDate: format  yyyymmdd(20191030)
 */
router.post("/navSync/",[selfAuth
,  check('createDate')
  .isLength({ min: 1 }).withMessage('must have createDate value')
],fundConnextAPIController.navSync);

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
