const dbConfig = require('./config');

var config = dbConfig.dbParameters;
var logger = require('../config/winston');

exports.getTransactionByParams = (req, res, next) => {

  var queryStr = `select *
  FROM [MFTS_Transaction]
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

exports.getTransactionsRep = (req, res, next) => {
  var startDate = req.query.startDate || '';
  var endDate = req.query.endDate || '';
  var amcCode = req.query.amcCode || '';
  var fundCode = req.query.fundCode || '';

  logger.info( `Query /getTransactionsRep - ${req.originalUrl} - ${req.ip} `);


  var queryStr = `
  BEGIN
    Declare @startDate VARCHAR(30) = '${startDate}';
    Declare @endDate VARCHAR(30) = '${endDate}';

    SELECT  @startDate AS StartDate, @endDate AS EndDate,C.Amc_Code,C.Agent_Code,'Merchant' as Agent_Name
    ,C.Attend_Name, C.Attend_Tel,C.Attend_Fax
    ,B.Fund_Code,B.Eng_Name,C.Contact_Name,C.Contact_Tel,C.Contact_Fax
    ,A.*
      FROM [MFTS_Transaction] A
      , MFTS_Fund B
      , MFTS_Amc C
      where  A.Fund_Id=B.Fund_Id
      AND B.Amc_Id = C.Amc_Id
      AND C.Active_Flag =1
      AND Tran_Date between @startDate and @endDate
      AND C.Amc_Code='${amcCode}'
      AND B.Fund_Code ='${fundCode}'

    END
   `;

  //  logger.info( `Query /getTransactionsRep - QUERY >> ${queryStr} `);

  var sql = require("mssql");
  sql.connect(config, err => {
    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {
        if(err){
          console.log('Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
          sql.close();
        }
        sql.close();

        // console.log('getTransactionsRep()>>',JSON.stringify(result.recordset));
        // return result.recordset;
        if(result){
          res.status(200).json({
            message: "Connex  successfully!",
            result: result.recordset || null
          });
        }else {
          res.status(400).json({
            message: "Bad Request "
          });
        }

        sql.close();

    })
  });

  sql.on("error", err => {
    console.log('sql.on !!!' + err);
    logger.error(err);
    sql.close();
  });
}
