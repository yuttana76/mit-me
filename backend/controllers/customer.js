// var Promise = require('bluebird');
const dbConfig = require('./config');
var sql = require("mssql");
var config = dbConfig.dbParameters;
// var connection = mssql.con({
//   host     : dbConfig.mssql_db_server,
//   user     : dbConfig.mssql_db_user,
//   password : dbConfig.mssql_db_password,
//   database : dbConfig.mssql_db_database
// });

// var queryAsync = Promise.promisify(connection.query.bind(connection));
// connection.connect();

// // do something when app is closing
// // see http://stackoverflow.com/questions/14031763/doing-a-cleanup-action-just-before-node-js-exits
// process.stdin.resume()
// process.on('exit', exitHandler.bind(null, { shutdownDb: true } ));

// // var bodyParser = require('body-parser');
// // app.use(bodyParser.urlencoded({ extended: true }));


exports.getCustomers = (req, res, next) => {

  console.log('Welcome getCustomers()');

  var numPerPage = parseInt(req.query.pagesize, 10) || 1;
  var page = parseInt(req.query.page, 10) || 1;
  var custId = req.query.cust_id || false;
  var cust_name = req.query.cust_name || false;
  var whereCond = '';
console.log('numPerPage='+numPerPage + ';page=' + page + ' ;custId=' +custId + ';cust_name=' + cust_name);

  if ( custId !== false ){
    whereCond = `Cust_Code like '%${custId}%'`;
  }else {
    whereCond = `First_Name_T like N'%${cust_name}%'`;
  }

console.log('whereCond>>',whereCond);

  var queryStr = `SELECT * FROM (
    SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
           * FROM [MFTS].[dbo].[Account_Info] WHERE ${whereCond}
      ) AS TBL
WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
ORDER BY Cust_Code`;
  // Here we compute the LIMIT parameter for MySQL query

  sql.connect(config, err => {
    // Callbacks
    new sql.Request().query(queryStr, (err, result) => {
      // ... error checks
        if(err){
          console.log('Was err !!!' + err);
          res.status(201).json({
            message: err,
          });
        }else{
          console.log('>>',JSON.stringify(result));
          res.status(200).json({
            message: "Connex  successfully!",
            result: result.recordset

          });
          sql.close();
          // ****************************
        }
    })
  });

  sql.on("error", err => {
    // ... error handler
    console.log('sql.on !!!' + err);
    sql.close();
  });
}
