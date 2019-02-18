const express = require('express');

const suitController = require('../controllers/suit');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// router.post("/verifyExtLink",checkAuth,userController.verifyExtLink);
router.post("/verifyExtLink",suitController.verifyExtLink);

router.post("/evaluate",suitController.suitEvaluate);
module.exports = router;
