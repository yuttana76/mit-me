const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const countryController = require('../controllers/country')

router.get("", countryController.getCountries);

module.exports = router;
