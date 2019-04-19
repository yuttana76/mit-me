const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const custChildrenController = require('../controllers/custChildren')

router.get("/cust/:custid", custChildrenController.getChildrenList);
router.get("/:id", custChildrenController.getChildren);
router.post("/cust/:custid", custChildrenController.CreateChildren);
router.put("/:id", custChildrenController.UpdateChildren);
router.delete("/cust/:custid", custChildrenController.delChildren);

module.exports = router;
