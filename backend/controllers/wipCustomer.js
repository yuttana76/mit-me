
  // String -> sql.NVarChar
  // Number -> sql.Int
  // Boolean -> sql.Bit
  // Date -> sql.DateTime

const dbConfig = require("./config");
var sql = require("mssql");
var config = dbConfig.dbParameters;


exports.ExeInsertWIPCustomer = (req, res, next) => {

  // console.log("ExeWIPCustomer>> ");
  var o2x = require('object-to-xml');
  var fncName = "ExeWIPCustomer";

  var customerObj = JSON.parse(req.body.customer);
  var ceAddressObj = JSON.parse(req.body.ceAddress);
  var ofAddressObj = JSON.parse(req.body.ofAddress);
  var maAddressObj = JSON.parse(req.body.maAddress);
  var mode = req.body.mode;

  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
      .input('customerXML', sql.Xml,  o2x(customerObj))
      .input('ceAddressXML', sql.Xml,  o2x(ceAddressObj))
      .input('ofAddressXML', sql.Xml,  o2x(ofAddressObj))
      .input('maAddressXML', sql.Xml,  o2x(maAddressObj))
      .input('mode', sql.VarChar(20),  mode)
      .output('wfRef', sql.VarChar(20))
      // .output('message', sql.VarChar(500))
      .execute('[dbo].[MIT_Insert_WIP_customer]', (err, result) => {

       console.log('err>>',JSON.stringify(err));

        if (err) {
          console.log(fncName + " Quey db. Was err !!!" + JSON.stringify(result));

          res.status(201).json({
            message: err
            // result: result.output
          });
        } else {
          console.log(fncName + " Result>>" + JSON.stringify(result));
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result.output
          });
        }
      });
  });
  pool1.on("error", err => {
    // ... error handler
    console.log("EROR>>" + err);
  });
};

exports.ExeRestoreWIPCustomer = (req, res, next) => {

  // console.log("ExeRestoreWIPCustomer>> id=" + req.params.id);
  // console.log('UpdateBy >>',req.body.UpdateBy)

  var fncName = "ExeRestoreWIPCustomer";

  const sql = require("mssql");
  const pool1 = new sql.ConnectionPool(config, err => {
    pool1.request()
      .input('wfRef', sql.VarChar(100),  req.params.id)
      .input('UpdateBy', sql.VarChar(250),  req.body.UpdateBy)
      .execute('[dbo].[MIT_WIP_CUSTOMER_RESTORE]', (err, result) => {

       console.log('err>>',JSON.stringify(err));

        if (err) {
          console.log(fncName + " Quey db. Was err !!!" + JSON.stringify(result));

          res.status(201).json({
            message: err
            // result: result.output
          });
        } else {
          console.log(fncName + " Result>>" + JSON.stringify(result));
          res.status(200).json({
            message: fncName + "Quey db. successfully!",
            result: result
          });
        }
      });
  });
  pool1.on("error", err => {
    // ... error handler
    console.log("EROR>>" + err);
  });
};

exports.getWipCustomer = (req, res, next) => {

  var fncName = 'getWipCustomer';
  var custCode = req.params.cusCode;

  var queryStr = `select *
  FROM [MFTS].[dbo].[MIT_WIP_Account_Info]
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



exports.getWIPAddress = (req, res, next) => {

  var fncName = 'getAddress';
  var custCode = req.params.cusCode;

  var queryStr = `select *
  FROM [MFTS].[dbo].[MIT_WIP_Account_Address]
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
