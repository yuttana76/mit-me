// var Promise = require('bluebird');

const dbConfig = require("./config");
// var sql = require("mssql");
var config = dbConfig.dbParameters;


exports.getWorkFlow = (req, res, next) => {

  var fncName = 'getCustomer';
  var custCode = req.params.cusCode;

  var queryStr = `select *
  FROM [MFTS].[dbo].[MIT_WorkFlowTrans]
  WHERE AppRef='${custCode}'`;

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


exports.updateWorkFlow = (req, res, next) => {
  var o2x = require('object-to-xml');
  // var customerObj = JSON.parse(req.body);

  console.log('cusCode>>', req.params.cusCode);
  console.log('BODY>>', req.body );

  // const sql = require("mssql");
  // const pool1 = new sql.ConnectionPool(config, err => {
  //   pool1.request()
  //     .input('customerXML', sql.Xml,  o2x(customerObj))
  //     .input('ceAddressXML', sql.Xml,  o2x(ceAddressObj))
  //     .input('ofAddressXML', sql.Xml,  o2x(ofAddressObj))
  //     .input('maAddressXML', sql.Xml,  o2x(maAddressObj))
  //     .output('wfRef', sql.VarChar(20))
  //     // .output('message', sql.VarChar(500))
  //     .execute('[dbo].[MIT_Insert_WIP_customer]', (err, result) => {

  //      console.log('err>>',JSON.stringify(err));

  //       if (err) {
  //         console.log(fncName + " Quey db. Was err !!!" + JSON.stringify(result));

  //         res.status(201).json({
  //           message: err
  //           // result: result.output
  //         });
  //       } else {
  //         console.log(fncName + " Result>>" + JSON.stringify(result));
  //         res.status(200).json({
  //           message: fncName + "Quey db. successfully!",
  //           result: result.output
  //         });
  //       }
  //     });
  // });
  // pool1.on("error", err => {
  //   // ... error handler
  //   console.log("EROR>>" + err);
  // });
};
