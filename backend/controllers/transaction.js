const dbConfig = require('./config');

var config = dbConfig.dbParameters;

exports.getTransactionByParams = (req, res, next) => {

  var queryStr = `select *
  FROM [MFTS].[dbo].[MFTS_Transaction]
  WHERE 1=2
  ORDER  BY `;

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
