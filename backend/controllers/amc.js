const dbConfig = require('./config');

var config = dbConfig.dbParameters;

exports.getAMC = (req, res, next) => {

  var fncName = 'getAMC()';
  var queryStr = `select [Amc_Id]
  ,[Amc_Code]
  ,[Amc_Name]
  ,[amc_name_e]
  FROM [MFTS].[dbo].[MFTS_Amc]
  WHERE Active_Flag=1
  ORDER  BY Amc_Code`;

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
