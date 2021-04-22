const express = require('express');
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');
const router = express.Router();
const { check } = require('express-validator');
const sttEopen = require('../controllers/sttEopen');

//Save Register information
router.get("/testApi",sttEopen.testApi);
router.post("/signVerify",sttEopen.signVerify);
router.get("/reportSchedult",sttEopen.reportSCHMitlog);
router.post("/broker-login",sttEopen.brokerLogin);


// 3.3 List Applications
router.get("/applications",sttEopen.applications);
// 3.2 Download JSON
router.get("/downloadJSON/:applicationId",sttEopen.downloadJSON);
// 3.1 Download Files
router.get("/applications/:applicationId/files",sttEopen.downloadFiles);

router.post("/mailByWealth",[
  check('fullname').exists().withMessage('must have param fullname '),
  check('username').exists().withMessage('must have param username '),
  check('toEmail').exists().withMessage('must have param toEmail'),
],sttEopen.mailByWealth);


module.exports = router;
