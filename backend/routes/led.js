const express = require('express');
const ledController = require('../controllers/led')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

// router.post("/uploadFile",selfAuth,ledController.uploadFile);
// router.post("/uploadBulkFileMaster",selfAuth,ledController.uploadBulkFileMaster);
router.get("/CallGetBankruptList",selfAuth,ledController.callGetBankruptList);

router.post("/uploadBulkFileDialy",selfAuth,ledController.uploadBulkFileDialy);

router.post("/checkCustDialy",selfAuth,ledController.checkCustDialy);
// router.post("/checkCustByID",selfAuth,ledController.checkCustByID);

router.get("/inspCust/", ledController.searchInsp);
router.put("/inspCust/", ledController.updateInspCust);
router.get("/ledMaster/", ledController.searchLedMaster);

router.get("/ledMasterBykey/", ledController.getLEDMasterBykey);
router.get("/inspByCustCode/", ledController.getInspByCustCode);
router.get("/inspByKey/", ledController.getInspByKey);
router.get("/inspByGroupId/", ledController.getInspByGroupId);
router.get("/inspHistory/", ledController.getInspHistory);
router.post("/inspHistory/", ledController.getAddInspHistory);
router.get("/inspResource/", ledController.getInspResource);

router.get("/cntInspToday/", ledController.cntInspToday);
router.get("/cntOnInspection/", ledController.cntOnInspection);
router.get("/cntOnFreeze/", ledController.cntOnFreeze);

router.get("/cntByDate", ledController.cntByDate);

router.get("/ledMasHis/:id", ledController.getledMasHis);
router.post("/ledMasHis/:id", ledController.createLedMasHis);
router.put("/ledMasHis/:id", ledController.updateLedMasHis);
module.exports = router;
