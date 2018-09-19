const dbConfig = require('./config');

var config = dbConfig.dbParameters;

exports.getAMC = (req, res, next) => {

  var queryStr = `select [Amc_Id]
  ,[Amc_Code]
  ,[Amc_Name]
  ,[amc_name_e]
  FROM [MFTS].[dbo].[MFTS_Amc]
  WHERE Active_Flag=1
  ORDER  BY Amc_Code`;

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
}
