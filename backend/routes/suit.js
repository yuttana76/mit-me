const express = require('express');

const suitController = require('../controllers/suit');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.post("/verifyExtLink",checkAuth,suitController.verifyExtLink);
router.post("/evaluate",checkAuth,suitController.suitEvaluate);
router.post("/suitSave",checkAuth,suitController.suitSave);

module.exports = router;
