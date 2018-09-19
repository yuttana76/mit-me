const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fundController = require('../controllers/fund')

/*
  config for your database
  Provider=SQLOLEDB.1;Password=P@ssw0rd;Persist Security Info=True;User ID=mftsuser;Initial Catalog=MFTS;Data Source=192.168.10.48;"
*/

router.get("", checkAuth, fundController.getFunds);

module.exports = router;
