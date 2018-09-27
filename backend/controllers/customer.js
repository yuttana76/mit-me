// var Promise = require('bluebird');

const dbConfig = require('./config');
var sql = require("mssql");
var config = dbConfig.dbParameters;


// exports.getCustomers = (req, res, next) => {

//   var fncName = 'getNations';

//   var numPerPage = parseInt(req.query.pagesize, 10) || 1;
//   var page = parseInt(req.query.page, 10) || 1;
//   var custId = req.query.cust_id || false;
//   var cust_name = req.query.cust_name || false;
//   var whereCond = '';

//   if ( custId !== false ){
//     whereCond = `Cust_Code like '%${custId}%'`;
//   }else {
//     whereCond = `First_Name_T like N'%${cust_name}%'`;
//   }


//   var queryStr = `SELECT * FROM (
//     SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
//            * FROM [MFTS].[dbo].[Account_Info] WHERE ${whereCond}
//       ) AS TBL
// WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
// ORDER BY Cust_Code`;
//   // Here we compute the LIMIT parameter for MySQL query

//   sql.connect(config, err => {
//     // Callbacks
//     new sql.Request().query(queryStr, (err, result) => {
//       // ... error checks
//         if(err){
//           console.log('Was err !!!' + err);
//           res.status(201).json({
//             message: err,
//           });
//         }else{
//           console.log('>>',JSON.stringify(result));
//           res.status(200).json({
//             message: "Connex  successfully!",
//             result: result.recordset

//           });
//           sql.close();
//           // ****************************
//         }
//     })
//   });

//   sql.on("error", err => {
//     // ... error handler
//     console.log('sql.on !!!' + err);
//     sql.close();
//   });
// }



exports.getCustomers = (req, res, next) => {


  var fncName = 'getNations';

  var numPerPage = parseInt(req.query.pagesize, 10) || 1;
  var page = parseInt(req.query.page, 10) || 1;
  var custId = req.query.cust_id || false;
  var cust_name = req.query.cust_name || false;
  var whereCond = '';

  if ( custId !== false ){
    whereCond = `Cust_Code like '%${custId}%'`;
  }else {
    whereCond = `First_Name_T like N'%${cust_name}%'`;
  }

  var queryStr = `SELECT * FROM (
    SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
           * FROM [MFTS].[dbo].[Account_Info] WHERE ${whereCond}
      ) AS TBL
WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
ORDER BY Cust_Code`;

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

exports.CreateCustomer = (req, res, next) => {
  console.log('CreateCustomer>>' +v_Cust_Code + " ;v_DOB>>"+v_DOB);
  var customerObj = JSON.parse(req.body.customer);
  var ceAddressObj = JSON.parse(req.body.ceAddress);
  var maAddressObj = JSON.parse(req.body.maAddress);

 // Convert parameter
var v_Cust_Code = customerObj.Cust_Code;
var v_DOB = customerObj.Birth_Day;

console.log('CreateCustomer>>' +v_Cust_Code + " ;v_DOB>>"+v_DOB);

var accountInfoStr = `INSERT INTO  [MFTS].[dbo].[Account_Info]
        VALUES(
        '${v_Cust_Code}'
        ,'${validStr(customerObj.Card_Type)}'
        ,'${validStr(customerObj.Group_Code)}'
        ,'${validStr(customerObj.Title_Name_T)}'
        ,'${validStr(customerObj.First_Name_T)}'
        ,'${validStr(customerObj.Last_Name_T)}'
        ,'${validStr(customerObj.Title_Name_E)}'
        ,'${validStr(customerObj.First_Name_E)}'
        ,'${validStr(customerObj.Last_Name_E)}'
         , CONVERT(datetime, '${v_DOB}')
        ,'${validStr(customerObj.Nation_Code)}'
        ,'${validStr(customerObj.Sex)}'
        ,'${validStr(customerObj.Tax_No)}'
        ,'${validStr(customerObj.Mobile)}'
        ,'${validStr(customerObj.Email)}'
        ,'${validStr(customerObj.MktId,0)}'
        ,'${validStr(customerObj.Create_By)}'
        , CURRENT_TIMESTAMP
        ,'${validStr(customerObj.Modify_By)}'
        , NULL
        ,'${validStr(customerObj.IT_SentRepByEmail)}'
        );`;

  const sql = require('mssql')
  const pool1 = new sql.ConnectionPool(config, err => {

    // Start Transaction 1
    var transaction = new sql.Transaction(pool1);
    transaction.begin(function(err) {
        var requestAccountInfo = new sql.Request(transaction);
        requestAccountInfo.query(accountInfoStr, function(err, recordset) {
            if (err) {
              console.log('Was error !!',err);
                  transaction.rollback(err => {
                      // console.log('rollback>>',err);
                  })
              } else {
                  transaction.commit(err => {
                      console.log('Cmmited !');
                  })
              }
            });

        });
      // End Transaction 1
     });
     pool1.on('error', err => {
          console.log("EROR>>"+err);
          pool1.close();
        })
      }

exports.UpdateCustomer = (req, res, next) => {

}

// *************** Functions

// *************** Utilities
function validStr(val, defaultVal = '') {
  if (val !== undefined && val !== null) {
    // v has a value
    return val ;
  } else {
    // v does not have a value
    return defaultVal;
  }
}
