const express = require('express');

const mitCrmController = require('../controllers/mitCrm');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get("/getMastert", mitCrmController.getMastert);  // TEST
// router.post("/test_tedious", userController.test_tedious); //TEST
;

module.exports = router;
