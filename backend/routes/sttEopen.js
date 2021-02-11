const express = require('express');
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');
const router = express.Router();
const { check } = require('express-validator');
const sttEopen = require('../controllers/sttEopen');

//Save Register information
router.get("/testApi",sttEopen.testApi);
router.post("/signVerify",sttEopen.signVerify);

router.post("/broker-login",sttEopen.brokerLogin);


// 3.1 Download Files
// :11009338
router.get("/applications/:applicationId/files",sttEopen.downloadFiles);

// 3.3 List Application Id
router.get("/applications",sttEopen.applications);


// 3.2 Download JSON
// :11009338
router.get("/applications/:applicationId",sttEopen.downloadJSON);


module.exports = router;
