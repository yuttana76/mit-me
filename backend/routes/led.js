const express = require('express');
const multer = require('multer');

const ledController = require('../controllers/led')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

// backend/downloadFiles/files
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Complete_list_of_MIME_types
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "application/pdf":"pdf",
  "application/x-tar":"tar",
  "application/zip":"zip",
};

const storage = multer.diskStorage({

  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    callback(error, "backend/downloadFiles/files");
  },
  filename: (req, file, callback) => {

    let name ;

      if(file.originalname.split(".")){
        name=file.originalname.split(".")[0]
        .toLowerCase()
        .split(" ")
        .join("-");
      }else{
        name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");
      }

    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + "-" + Date.now() + "." + ext);
  }
});


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
router.post("/ledMasHis/:id",multer({ storage: storage }).single("resourceRef"), ledController.createLedMasHis);
router.put("/ledMasHis/:id",multer({ storage: storage }).single("resourceRef"), ledController.updateLedMasHis);
module.exports = router;
