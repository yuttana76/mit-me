const express = require('express');

const utilityController = require('../controllers/utility');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.post("/autoGenPwd",utilityController.autoGeneratePassword);

module.exports = router;
