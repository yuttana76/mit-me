const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const employeeController = require('../controllers/employee')

router.get("/search", employeeController.searchEmployee);
router.get("/byUserId/:userId", employeeController.getEmployeeByUserId);

module.exports = router;
