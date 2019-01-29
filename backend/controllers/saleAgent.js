const dbConfig = require('../config/db-config');
// var sql = require("mssql");
var config = dbConfig.dbParameters;


exports.getSaleAgent = (req, res, next) => {
  var fncName = "getNations";

  var numPerPage = parseInt(req.query.pagesize, 10) || 20;
  var page = parseInt(req.query.page, 10) || 1;
  var userCode = req.query.User_Code || '';
  var whereCond = "";

  console.log('Page>'+ page + ' ;NumPer Page>>' + numPerPage);
  // if (custId !== false) {
  //   whereCond = `Cust_Code like '%${custId}%'`;
  // } else {
    // whereCond = `First_Name_T like N'%${cust_name}%'`;
  // }

  whereCond = userCode;

var queryStr = `SELECT * FROM (
                              SELECT   ROW_NUMBER() OVER(ORDER BY User_Code) AS NUMBER,   s.Id, s.Type, s.License_Code, s.Issue_Date, u.User_Code, u.Full_Name, u.Email, u.Flag
                              FROM  [MFTS].dbo.MFTS_SalesCode AS s LEFT OUTER JOIN
                                      AppCtrl.dbo.UserInfo AS u ON s.Id = u.User_Id
                              WHERE  u.User_Code like '%${whereCond}%'
    ) AS TBL
WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
ORDER BY User_Code`;

  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1
      .request() // or: new sql.Request(pool1)
      .query(queryStr, (err, result) => {
        // ... error checks
        if (err) {
          console.log(fncName + " Quey db. Was err !!!" + err);
          res.status(201).json({
            message: err
          });
        } else {

          console.log(JSON.stringify(result.recordset));

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
};
