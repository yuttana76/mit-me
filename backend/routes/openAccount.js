const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const openAccountCtr = require('../controllers/openAccount')


router.post("/openAccount", openAccountCtr.OpenAccount);

module.exports = router;
