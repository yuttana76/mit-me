const express = require("express");

const router = express.Router();
const checkAuth = require('../middleware/check-auth');

/*
  config for your database
  Provider=SQLOLEDB.1;Password=P@ssw0rd;Persist Security Info=True;User ID=mftsuser;Initial Catalog=MFTS;Data Source=192.168.10.48;"
*/
var config = {
  user: "mftsuser",
  password: "P@ssw0rd",
  server: "192.168.10.48",
  database: "MFTS"
};


router.get("", checkAuth,(req, res, next) => {

  var queryStr = `select * FROM [MFTS].[dbo].[MFTS_Fund] ORDER  BY Amc_Id ,Thai_Name`;

  var sql = require("mssql");

  sql.connect(config, err => {
    // ... error checks

    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {

      // ... error checks
        if(err){
          console.log('Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
          sql.close();
        }

        res.status(200).json({
          message: "Connex  successfully!",
          result: result.recordset
        });
        sql.close();
    })
  });

  sql.on("error", err => {
    // ... error handler
    console.log('sql.on !!!' + err);
    sql.close();
  });
});


module.exports = router;
