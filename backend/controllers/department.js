const dbConfig = require('../config/db-config');

var config = dbConfig.dbParameters;


exports.getDepartments = (req, res, next) => {

  var fncName = 'getNations';

  var queryStr = `
  SELECT *
  FROM [MFTS].[dbo].[MIT_DEPARTMENT]
  ORDER BY NAME
  `;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request() // or: new sql.Request(pool1)
    .query(queryStr, (err, result) => {
        // ... error checks
        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(404).json({
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
