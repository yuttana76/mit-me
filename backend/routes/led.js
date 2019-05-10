const express = require('express');
const ledController = require('../controllers/led')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

router.post("/uploadFile",selfAuth,ledController.uploadFile);
router.post("/uploadBulkFile",selfAuth,ledController.uploadBulkFile);

router.post("/checkCustAll",selfAuth,ledController.checkCustAll);
router.post("/checkCustByID",selfAuth,ledController.checkCustByID);

module.exports = router;
