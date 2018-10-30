const dbConfig = require('./config');

var config = dbConfig.dbParameters;
var logger = require('../config/winston');


exports.searchEmployee = (req, res, next) => {
  var fncName = "searchEmployee";
  console.log('Welcome searchEmployee()');

  var numPerPage = parseInt(req.query.pagesize, 10) || 1;
  var page = parseInt(req.query.page, 10) || 1;
  var empName = req.query.empName || false;
  var depCode = req.query.depCode || false;
  var whereCond = "";

  if (empName !== false) {
    whereCond = ` AND First_Name like '%${empName}%'`;
  }

  if (depCode !== false){
    whereCond = whereCond+ ` AND DEP_CODE = '${depCode}'`;
  }

  if(whereCond !== '' ){

    whereCond = ' 1=1 ' + whereCond;
    console.log('WHERE>>' + whereCond);

    var queryStr = `SELECT  TBL.*,a.NAME AS DEP_NAME FROM (
      SELECT ROW_NUMBER() OVER(ORDER BY First_Name) AS NUMBER,
             * FROM [MFTS].[dbo].[MIT_EMPLOYEE] WHERE ${whereCond}
        ) AS TBL
        LEFT JOIN [MFTS].[dbo].[MIT_DEPARTMENT] a ON TBL.DEP_CODE =  a.DEP_CODE
  WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
  ORDER BY First_Name`;

    const sql = require("mssql");
    const pool1 = new sql.ConnectionPool(config, err => {
      pool1.request() // or: new sql.Request(pool1)
        .query(queryStr, (err, result) => {
          // ... error checks
          if (err) {
            console.log(fncName + " Quey db. Was err !!!" + err);
            res.status(201).json({
              message: err
            });
          } else {
            res.status(200).json({
              message: fncName + "Quey db. successfully!",
              result: result.recordset
            });
          }
        });
    });
    pool1.on("error", err => {
      // ... error handler
      console.log("EROR>>" + err);
    });
  }

};
