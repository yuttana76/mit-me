const express = require('express');
const streaming2faController = require('../controllers/streaming2fa');
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');
const router = express.Router();
const { check } = require('express-validator');


//Send user/pwd to cust  by MPAM
router.post("/createUserInfo",selfAuth,streaming2faController.createUserInfo);
router.post("/decryptUserInfo",streaming2faController.decryptUserInfo);


// API
router.post("/login",streaming2faController.login);

module.exports = router;
