const express = require('express');

const verifyExtController = require('../controllers/verifyExt');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

// router.post("/verifyExtLink",checkAuth,userController.verifyExtLink);
router.post("/verifyExtLink",verifyExtController.verifyExtLink);

module.exports = router;
