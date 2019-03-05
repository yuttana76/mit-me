const express = require('express');

const suitController = require('../controllers/suit');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// router.post("/verifyExtLink",checkAuth,userController.verifyExtLink);

// router.post("/verifyExtLink",suitController.verifyExtLink_TEST);
router.post("/verifyExtLink",suitController.verifyExtLink);
router.post("/evaluate",suitController.suitEvaluate);
router.post("/suitSave",suitController.suitSave);

// router.post("/saveFATCA",suitController.saveFATCA);
module.exports = router;
