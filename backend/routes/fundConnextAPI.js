const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const fundConnextAPIController = require('../controllers/fundConnextAPI')
const { check } = require('express-validator');
const { route } = require('./customer');

// Schedule
router.get("/scheduleDownload/",fundConnextAPIController.scheduleDownload);
router.get("/apiAuditor/",fundConnextAPIController.apiAuditor); // // On development

// customer/individual/ API
router.get("/customer/individual/:cardNumber", fundConnextAPIController.getIndCust);

router.get("/customer/individual-DEV/:cardNumber", fundConnextAPIController.getIndCustDEV);
router.post("/customer/individual", fundConnextAPIController.createCustomerIndividual);
router.put("/customer/individual", fundConnextAPIController.updateCustomerIndividual);
router.patch("/customer/individual", fundConnextAPIController.updateCustomerIndPartial);//Partrial


// Step 1 Download FC data (T+0 min)
router.get("/downloadCustomerProfile",fundConnextAPIController.downloadCustomerProfile);
router.get("/downloadCustomerProfile_v4",fundConnextAPIController.downloadCustomerProfile_v4); // Single form

// Step 2 Upload data to MFTS(Approve) (T+5 min)
// 2.1 uploadCustomerProfilePROC
// 2.2 fundProfileAutoUpdateAPI
router.get("/uploadCustomerProfile",fundConnextAPIController.uploadCustomerProfile);

// Step 3 Report to staff (T+10 min)
router.get("/reportSchedult",fundConnextAPIController.reportSCHMitlog);

// download API
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

// router.post("/uploadMITNAVdb/",[
//   check('fileType')
//     .exists().withMessage('must have param fileType')
//     .isLength({ min: 1 }).withMessage('fileType must have value '),
//   check('fileName')
//     .exists().withMessage('must have param fileName')
//     .isLength({ min: 1 }).withMessage('fileName must have value '),
// ], fundConnextAPIController.uploadMITNAV_db);


// ********* Download V1
/** STEP 1
 * parameter
* /downloadFileNavAPI?businessDate=20191031
 **/
// router.get("/downloadFileNavAPI/",[
//   check('businessDate')
//     .exists().withMessage('must have Param businessDate')
//     .isLength({ min: 1 }).withMessage('businessDate must have value '),
// ], fundConnextAPIController.downloadFileNavAPI);


/** STEP2
 * parameter
 * createDate: format  yyyymmdd(20191030)
 */
// router.post("/navSync/",[selfAuth
// ,  check('createDate')
//   .isLength({ min: 1 }).withMessage('must have createDate value')
// ],fundConnextAPIController.navSync);


// ********* Download NAV V2
//Download NAV & Sync DB. (Active)
router.post("/downloadNavAPI/v2/",[check('businessDate')
    // .isLength({ min: 1 }).withMessage('must have businessDate value')
  ],fundConnextAPIController.downloadNavAPI_V2);


// Inactive
router.post("/downloadNavSchedule/",[selfAuth
    ,  check('schStatus')
      .isLength({ min: 1 }).withMessage('must have schStatus value')
  ],fundConnextAPIController.downloadNavSchedule);


// ********* Download AllottedTransactions (Active)
router.post("/downloadAllottedAPI",[check('businessDate')
    .isLength({ min: 1 }).withMessage('must have businessDate value')
  ],fundConnextAPIController.downloadAllottedAPI);


// ********* Download UnitholderBalance (Active)
router.post("/downloadUnitholderBalanceAPI",[check('businessDate')
.isLength({ min: 1 }).withMessage('must have businessDate value')
],fundConnextAPIController.UnitholderBalanceAPI);


// ********* Download FundProfile (developing)
router.post("/downloadFundProfilAPI",[check('businessDate')
.isLength({ min: 1 }).withMessage('must have businessDate value')
],fundConnextAPIController.FundProfileAPI);

router.post("/fundProfileAutoUpdate"
// ,[check('businessDate').isLength({ min: 1 }).withMessage('must have businessDate value')]
,fundConnextAPIController.fundProfileAutoUpdateAPI);


// ********* Download

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

// Testing & Developing

router.post("/testUpdateSuit/",fundConnextAPIController.updateSuitAPI);

router.post("/validateFC_API_download/",fundConnextAPIController.validateFC_API_download);

// Get customer V4 Single form
router.get("/customer/individual/v4/:cardNumber", fundConnextAPIController.getIndCust_V4);

module.exports = router;
