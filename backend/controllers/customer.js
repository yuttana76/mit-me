// var Promise = require('bluebird');

const dbConfig = require("./config");
// var sql = require("mssql");
var config = dbConfig.dbParameters;

exports.searchCustomers = (req, res, next) => {
  var fncName = "getNations";

  var numPerPage = parseInt(req.query.pagesize, 10) || 1;
  var page = parseInt(req.query.page, 10) || 1;
  var custId = req.query.cust_id || false;
  var cust_name = req.query.cust_name || false;
  var whereCond = "";

  if (custId !== false) {
    whereCond = `Cust_Code like '%${custId}%'`;
    // whereCond = `CONTAINS(Cust_Code,${custId})`;
  } else {
    whereCond = `First_Name_T like N'%${cust_name}%'`;
    // whereCond = `CONTAINS(First_Name_T, ${cust_name})`;
  }



  var queryStr = `SELECT * FROM (
    SELECT ROW_NUMBER() OVER(ORDER BY Cust_Code) AS NUMBER,
           * FROM [MFTS].[dbo].[Account_Info] WHERE ${whereCond}
      ) AS TBL
WHERE NUMBER BETWEEN ((${page} - 1) * ${numPerPage} + 1) AND (${page} * ${numPerPage})
ORDER BY Cust_Code`;

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


exports.getCustomer = (req, res, next) => {

  var fncName = 'getCustomer';
  var custCode = req.params.cusCode;

  var queryStr = `select *
  FROM [MFTS].[dbo].[Account_Info]
  WHERE Cust_Code='${custCode}'`;

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
  console.log("CreateCustomer>>" );
  var customerObj = JSON.parse(req.body.customer);
  var ceAddressObj = JSON.parse(req.body.ceAddress);
  var maAddressObj = JSON.parse(req.body.maAddress);

  var accountInfoQuery = accountInfoQuery(customerObj);
  var getAccountAddrQuery_1 = addressQuery(customerObj.Cust_Code,1,ceAddressObj);
  var getAccountAddrQuery_2 = addressQuery(customerObj.Cust_Code,2,maAddressObj);

  var executeQueryList = [accountInfoQuery, getAccountAddrQuery_1 ,getAccountAddrQuery_2]
  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {

  executeQueryList.forEach(function(element) {
    // Start Account Info Transaction 1
    var accInfoTransaction = new sql.Transaction(pool1);
    accInfoTransaction.begin(function(err) {
      var requestAccountInfo = new sql.Request(accInfoTransaction);

      requestAccountInfo.query(element, function(err, recordset) {
        if (err) {
          // console.log("Was error !!", err);
          accInfoTransaction.rollback(err => {
             res.status(400).json({
                message: 'Create Customer fail'
              });
          });
        } else {
          accInfoTransaction.commit(err => {
            // console.log("Cmmited !");
             res.status(201).json({
              message: 'Customer create successfully'
            });
          });
        }
      });
    });
    // End Account Info Transaction 1
  }); // ENd loop




  });
  pool1.on("error", err => {
    console.log("EROR>>" + err);
    pool1.close();
  });
};

exports.UpdateCustomer = (req, res, next) => {

};

// *************** Functions
function  accountInfoQuery(customerObj){
  var v_Cust_Code = customerObj.Cust_Code;
  var v_DOB = customerObj.Birth_Day;

  return `INSERT INTO  [MFTS].[dbo].[Account_Info]
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
        ,'${validStr(customerObj.MktId, 0)}'
        ,'${validStr(customerObj.Create_By)}'
        , CURRENT_TIMESTAMP
        ,'${validStr(customerObj.Modify_By)}'
        , NULL
        ,'${validStr(customerObj.IT_SentRepByEmail)}'
        );`;
}


function  addressQuery(v_Cust_Code,v_Addr_Seq,ceAddressObj){

  return  `INSERT INTO  [MFTS].[dbo].[Account_Address]
        VALUES(
        '${v_Cust_Code}'
        ,${v_Addr_Seq}
        ,'${validStr(ceAddressObj.Addr_No)}'
        ,'${validStr(ceAddressObj.Place)}'
        ,'${validStr(ceAddressObj.Road)}'
        ,'${validStr(ceAddressObj.Tambon_Id)}'
        ,'${validStr(ceAddressObj.Amphur_Id)}'
        ,'${validStr(ceAddressObj.Province_Id)}'
        ,'${validStr(ceAddressObj.Country_Id)}'
        ,'${validStr(ceAddressObj.Zip_Code)}'
        ,'${validStr(ceAddressObj.Print_Address)}'
        ,'${validStr(ceAddressObj.Tel)}'
        ,'${validStr(ceAddressObj.Fax)}'
        )`;
}
// *************** Utilities
function validStr(val, defaultVal = "") {
  if (val !== undefined && val !== null) {
    // v has a value
    return val;
  } else {
    // v does not have a value
    return defaultVal;
  }
}
