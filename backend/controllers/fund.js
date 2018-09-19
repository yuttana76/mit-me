const dbConfig = require('./config');

// var config = {
//   user: "mftsuser",
//   password: "P@ssw0rd",
//   server: "192.168.10.48",
//   database: "MFTS"
// };

var config = dbConfig.dbParameters;

exports.getFunds = (req, res, next) => {

  var queryStr = `select * FROM [MFTS].[dbo].[MFTS_Fund] ORDER  BY Amc_Id ,Thai_Name`;
  var sql = require("mssql");

  sql.connect(config, err => {
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
}


exports.getFundByCode = (req, res, next) => {

  var _fundCode = req.params.code;

  console.log('_fundCode>>' + _fundCode);

  var queryStr = `select * FROM [MFTS].[dbo].[MFTS_Fund] WHERE Fund_Code ='${_fundCode}'`;

  var sql = require("mssql");

  sql.connect(config, err => {
    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {
      // ... error checks
        if(err){
          console.log('Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
          sql.close();
        }else{
          res.status(200).json({
            message: "Connex  successfully!",
            result: result.recordset

          });
          sql.close();
        }
    })
  });

  sql.on("error", err => {
    // ... error handler
    console.log('sql.on !!!' + err);
    sql.close();
  });
}
