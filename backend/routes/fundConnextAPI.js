const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const fundConnextAPIController = require('../controllers/fundConnextAPI')
const { check } = require('express-validator');


router.get("/customer/individual/:cardNumber", fundConnextAPIController.getIndCust);
router.patch("/customer/individual", fundConnextAPIController.updateCustomerIndPartial);


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


router.post("/uploadMITNAVdb/",[
  check('fileType')
    .exists().withMessage('must have param fileType')
    .isLength({ min: 1 }).withMessage('fileType must have value '),
  check('fileName')
    .exists().withMessage('must have param fileName')
    .isLength({ min: 1 }).withMessage('fileName must have value '),
], fundConnextAPIController.uploadMITNAV_db);


// ********* Download V1
/** STEP 1
 * parameter
* /downloadFileNavAPI?businessDate=20191031
 **/
router.get("/downloadFileNavAPI/",[
  check('businessDate')
    .exists().withMessage('must have Param businessDate')
    .isLength({ min: 1 }).withMessage('businessDate must have value '),
], fundConnextAPIController.downloadFileNavAPI);


/** STEP2
 * parameter
 * createDate: format  yyyymmdd(20191030)
 */
router.post("/navSync/",[selfAuth
,  check('createDate')
  .isLength({ min: 1 }).withMessage('must have createDate value')
],fundConnextAPIController.navSync);


// ********* Download NAV V2

router.post("/downloadNavAPI/v2/",[selfAuth
  ,  check('businessDate')
    .isLength({ min: 1 }).withMessage('must have businessDate value')
  ],fundConnextAPIController.downloadNavAPI_V2);

router.post("/downloadNavSchedule/",[selfAuth
    ,  check('schStatus')
      .isLength({ min: 1 }).withMessage('must have schStatus value')
  ],fundConnextAPIController.downloadNavSchedule);

// ********* Download V2

// ********* Download AllottedTransactions
router.post("/downloadAllottedAPI",[selfAuth
  ,  check('businessDate')
    .isLength({ min: 1 }).withMessage('must have businessDate value')
  ],fundConnextAPIController.downloadAllottedAPI);

router.post("/test_allotedFile"
    ,fundConnextAPIController.allotedFile);


// ********* Download AllottedTransactions

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
