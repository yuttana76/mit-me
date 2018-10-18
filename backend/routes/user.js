const express = require('express');

const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.post("/register",userController.createUser);
router.post("/resetPassword",userController.resetPassword);

router.post("/login", userController.userLogin);
router.get("/userInfo", checkAuth,userController.getUserInfo);
router.get("/userLevel", checkAuth,userController.getUserLevel);


module.exports = router;
