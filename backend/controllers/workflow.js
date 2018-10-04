// var Promise = require('bluebird');

const dbConfig = require("./config");
// var sql = require("mssql");
var config = dbConfig.dbParameters;


exports.getWorkFlow = (req, res, next) => {

  var fncName = 'getCustomer';
  var custCode = req.params.cusCode;

  var queryStr = `select *
  FROM [MFTS].[dbo].[MIT_WorkFlowTrans]
  WHERE AppRef='${custCode}'`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
        }
    })
  })

  pool1.on('error', err => {
    // ... error handler
    console.log("EROR>>"+err);
  })
}


exports.updateWorkFlow = (req, res, next) => {

}
