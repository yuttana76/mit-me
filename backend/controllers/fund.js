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


exports.getFundsXX = (req, res, next) => {

  // const pageSize = +req.query.pageSize;
  // const currentPage = +req.query.page;
  console.log('Welome getFundsXX ');
    var numRows;
    var queryPagination;
    var numPerPage = parseInt(req.query.pageSize, 10) || 1;
    var page = parseInt(req.query.page, 10) || 0;
    console.log('numPerPage>'+numPerPage + ';page>' + page);

    var numPages;
    var skip = page * numPerPage;
    // Here we compute the LIMIT parameter for MySQL query
    var limit = skip + ',' + skip + numPerPage;
    queryAsync('SELECT count(*) as numRows FROM [MFTS].[dbo].[MFTS_Fund]')
    .then(function(results) {
      numRows = results[0].numRows;
      numPages = Math.ceil(numRows / numPerPage);
      console.log('number of pages:', numPages);
    })
    .then(() => queryAsync(`
    SELECT * FROM (
                 SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
                        * FROM [MFTS].[dbo].[Account_Info]
                   ) AS TBL
    WHERE NUMBER BETWEEN ((${numPages} - 1) * ${numRows} + 1) AND (${numPages} * ${numRows})
    ORDER BY Cust_Code`))
    .then(function(results) {
      var responsePayload = {
        results: results
      };
      if (page < numPages) {
        responsePayload.pagination = {
          current: page,
          perPage: numPerPage,
          previous: page > 0 ? page - 1 : undefined,
          next: page < numPages - 1 ? page + 1 : undefined
        }
      }
      else responsePayload.pagination = {
        err: 'queried page ' + page + ' is >= to maximum page number ' + numPages
      }
      res.json(responsePayload);
    })
    .catch(function(err) {
      console.error(err);
      res.json({ err: err });
    });
}
