const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const proxyController = require('../controllers/proxy')

router.post("/authtoken", proxyController.authtoken);

module.exports = router;
