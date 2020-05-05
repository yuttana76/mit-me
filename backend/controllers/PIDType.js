const mpamConfig = require('../config/mpam-config');
var config = mpamConfig.dbParameters;

exports.getPIDTypes = (req, res, next) => {
  var fncName = 'getPIDTypes';

  var sql = require("mssql");
  var queryStr = `select *
  FROM [REF_PIDTypes]
  ORDER  BY [PIDType_Code],[PIDType_Desc]`;

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
