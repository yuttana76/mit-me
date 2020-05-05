const mpamConfig = require('../config/mpam-config');
var config = mpamConfig.dbParameters;

exports.getEngTitles = (req, res, next) => {

  var fncName = 'getEngTitles';

  var queryStr = `select *
FROM [MFTS].[dbo].[REF_Title_Englishs]
WHERE IsNull([Title_Name], '') != ''
ORDER BY [Title_Name]`;

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
