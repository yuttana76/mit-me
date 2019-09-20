const express = require('express');
const smsController = require('../controllers/sms')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

router.post("/smsDeb",selfAuth,smsController.smsDeb);


module.exports = router;
