const express = require('express');
const ledController = require('../controllers/led')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

// router.post("/uploadFile",selfAuth,ledController.uploadFile);
// router.post("/uploadBulkFileMaster",selfAuth,ledController.uploadBulkFileMaster);
router.post("/uploadBulkFileDialy",selfAuth,ledController.uploadBulkFileDialy);

router.post("/checkCustDialy",selfAuth,ledController.checkCustDialy);
// router.post("/checkCustByID",selfAuth,ledController.checkCustByID);

router.get("/inspCust/", ledController.searchInsp);

router.get("/ledMasterBykey/", ledController.getLEDMasterBykey);
router.get("/inspByCustCode/", ledController.getInspByCustCode);
router.get("/inspByKey/", ledController.getInspByKey);

router.get("/inspByGroupId/", ledController.getInspByGroupId);
router.get("/inspHistory/", ledController.getInspHistory);
router.get("/inspResource/", ledController.getInspResource);


module.exports = router;
