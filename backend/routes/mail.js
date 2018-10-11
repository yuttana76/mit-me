const express = require('express');
const mailController = require('../controllers/mail')
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post("/merchant",mailController.sendMail);

module.exports = router;
