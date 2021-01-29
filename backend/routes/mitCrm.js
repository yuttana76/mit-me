const express = require('express');

const mitCrmController = require('../controllers/mitCrm');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get("/getMastert", mitCrmController.getMastert);  // TEST
router.get("/person/:cusCode", mitCrmController.getPersonalById);  // TEST
router.post("/person", mitCrmController.createPersonal);  // TEST
router.put("/person/:cusCode", mitCrmController.updatePersonal);  // TEST
// router.post("/test_tedious", userController.test_tedious); //TEST
;

module.exports = router;
