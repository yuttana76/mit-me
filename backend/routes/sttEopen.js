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

router.get("/applications",sttEopen.applications);
router.get("/downloadJSON/:applicationId",sttEopen.downloadJSON);


module.exports = router;
