const express = require('express');

const suitController = require('../controllers/suit');
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');
const router = express.Router();
const { check } = require('express-validator');

router.post("/verifyExtLink",checkAuth,suitController.verifyExtLink);
router.post("/evaluate",checkAuth,suitController.suitEvaluate);
router.post("/suitSave",checkAuth,suitController.suitSave);

router.post("/createPDF",suitController.createPDF_FCOpenAccount);

// router.get("/getSuit/:cusCode",suitController.getSuit);

module.exports = router;
