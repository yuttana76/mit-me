const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const departmentController = require('../controllers/department')

router.get("", departmentController.getDepartments);

module.exports = router;
