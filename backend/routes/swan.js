const express = require('express');
const swanController = require('../controllers/swan')
const checkAuth = require('../middleware/check-auth');
const selfAuth = require('../middleware/self-auth');

const router = express.Router();

router.get("/getCustomers",selfAuth,swanController.getCustomers);


module.exports = router;
