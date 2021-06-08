const express = require('express');
const streaming2faController = require('../controllers/streaming2fa');
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');
const router = express.Router();
const { check } = require('express-validator');


//Send user/pwd to cust  by MPAM
/**
 * source:D:\Merchants\apps\mit\backend\controllers\readFiles\Streaming\2fa\user_info_mpam.csv
 * target:D:\Merchants\apps\mit\backend\controllers\readFiles\Streaming\2fa\user_info_encrypted.csv
 * backup:D:\Merchants\apps\mit\backend\controllers\readFiles\Streaming\2fa\backup
 */
router.post("/createUserInfo",selfAuth,streaming2faController.createUserInfo);

router.post("/decryptUserInfo",streaming2faController.decryptUserInfo);

// API
router.post("/login",streaming2faController.login);

module.exports = router;
