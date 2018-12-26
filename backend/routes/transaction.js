const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const transController = require('../controllers/transaction')


callTransactions  = (req, res, next) => {
  transController.getTransactionsRep(req, res, next).then(result => {

    res.status(200).json({
      message: "Connex  successfully!",
      result: result
    });
  })

}

router.get("", transController.getTransactionByParams);

// **** Reports API no need authentication
router.get("/report/transaction", transController.getTransactionsRep);

module.exports = router;
