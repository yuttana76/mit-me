const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const onlineProcessController = require('../controllers/onlineProcess')


router.post("/fcOpenAccount", onlineProcessController.saveFcOpenAccount);

module.exports = router;
