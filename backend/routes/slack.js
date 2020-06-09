
const express = require("express");
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const slackController = require('../controllers/tools/slack')

router.post("/slackmsg",slackController.slackmsgAPI);

module.exports = router;
