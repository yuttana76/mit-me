const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const proxyController = require('../controllers/proxy')

router.post("/callback", proxyController.callback);

router.post("/authtoken", proxyController.ProxyAuthtoken);
router.post("/providers", proxyController.ProxyProviders);
router.post("/services", proxyController.ProxyServices);
router.post("/as/service", proxyController.ProxyServiceAs);
router.post("/identity/verify", proxyController.IdVerify);
router.post("/identity/verifyStatus", proxyController.IdVerifyStatus);

router.post("/identity/verify-and-request-data", proxyController.IdVerifyRequestData);
router.post("/identity/verify-and-request-data/data", proxyController.IdVerifyRequestDataGETdata);

router.post("/identity/verify-and-request-data/request-data-removal", proxyController.IdVerifyRequestDataRemoval);

module.exports = router;
