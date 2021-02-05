const express = require('express');

const mitCrmController = require('../controllers/mitCrm');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get("/getMastert", mitCrmController.getMastert);
router.get("/person/:cusCode", mitCrmController.getPersonalById);
router.post("/person", mitCrmController.createPersonal);
router.put("/person/:cusCode", mitCrmController.updatePersonal);

router.get("/searchPersonal", mitCrmController.searchPersonal);

router.get("/portfolio/:cusCode", mitCrmController.portfolio);

module.exports = router;
