const dbConfig = require('../config/db-config');

var config = dbConfig.dbParameters;

exports.getClientTypes = (req, res, next) => {
  var fncName = 'getAllClientType';
  var sql = require("mssql");
  var queryStr = `select *
  FROM [MFTS].[dbo].[REF_ClientTypes]
  ORDER  BY ClientType_Code`;

  sql.connect(config, err => {
    new sql.Request().query(queryStr, (err, result) => {

        if(err){
          console.log( fncName +' Quey db. Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
          sql.close();
        }else {
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.recordset
          });
          sql.close();
        }
    })
  });
  sql.on("error", err => {
    console.log(fncName + 'Quey db. sql.on !!!' + err);
    sql.close();
  });
}
