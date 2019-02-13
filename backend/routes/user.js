const express = require('express');

const userController = require('../controllers/user');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.post("/register",userController.createUser);
router.post("/login", userController.userLoginByParam);
router.post("/resetPassword",userController.resetPassword);
router.get("/userInfo", checkAuth,userController.getUserInfo);
router.get("/userLevel", checkAuth,userController.getUserLevel);

router.get("/userLevelByUserId",userController.getUserLevelByUserId);
router.delete("/userLevelByAppId/:userId/:appId",userController.deleteUserLevelByAppId);
router.post("/addUserLevel",userController.addUserLevel);

router.get("/userGroupByUserId",userController.getUserGroupByUserId);
router.delete("/userGroupByUserId/:userId/:groupId",userController.deleteUserGroupByGroupId);
router.post("/addUserGroup",userController.addUserGroup);

router.get("/searchUser",userController.searchUser);
router.post("/exeUserEmp",userController.ExeUserEmp);

module.exports = router;
