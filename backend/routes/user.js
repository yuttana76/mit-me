const express = require('express');

const userController = require('../controllers/user');

const router = express.Router();

router.post("/register",userController.createUser);

router.post("/login", userController.userLogin);

router.get("/userLevel", userController.getUserLevel);

module.exports = router;
